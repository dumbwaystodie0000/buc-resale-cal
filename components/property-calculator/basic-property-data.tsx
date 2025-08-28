"use client";

import type { Property, Mode } from "./types";
import { calculateValues, calculateMonthlyInstalmentForProperty, getBUCMonthlyInstalmentBreakdown, getBUCStartingStage } from "./calculations";
import { fmtCurrency, calculateBalanceMonthAftTOP } from "./utils";
import {
  CurrencyInput,
  ClearableNumberInput,
  DualCell,
  MonthYearPicker,
  TooltipLabel,
} from "./ui-components";
import { DataRow } from "./table-components";

interface BasicPropertyDataProps {
  properties: Property[];
  mode: Mode;
  updateProperty: (id: string, field: keyof Property, value: any) => void;
}

export default function BasicPropertyData({
  properties,
  mode,
  updateProperty,
}: BasicPropertyDataProps) {
  return (
    <>
      <DataRow
        label={
          <TooltipLabel
            label="Purchase Price"
            tooltip="The total price you will pay for the property, including any additional costs."
            data-oid="240lh6f"
          />
        }
        properties={properties}
        render={(p) => (
          <CurrencyInput
            value={p.purchasePrice}
            onChange={(v) => updateProperty(p.id, "purchasePrice", v)}
            data-oid="41fg8jo"
          />
        )}
        data-oid="zt9yngv"
      />

      <DataRow
        label={
          <TooltipLabel
            label="Loan Tenure (Years)"
            tooltip="The number of years over which you will repay your mortgage loan. Maximum 35 years."
            data-oid="j9rcj28"
          />
        }
        properties={properties}
        render={(p) => (
          <div className="flex items-center gap-2" data-oid="24imvpn">
            <ClearableNumberInput
              value={p.loanTenure || 0}
              onChange={(v: number) => {
                // Allow 0 for cleared state, but validate non-zero values
                const validatedValue = v === 0 ? 0 : Math.min(Math.max(v, 1), 35);
                updateProperty(p.id, "loanTenure", validatedValue);
              }}
              step={1}
              className="w-20"
              placeholder="0"
              data-oid="_76z9mp"
            />
          </div>
        )}
        data-oid="ax6p5zc"
      />

      <DataRow
        label={
          <TooltipLabel
            label="Interest Rate %"
            tooltip="The annual interest rate on your mortgage loan. This affects your monthly payments and total interest paid."
            data-oid="tpunoit"
          />
        }
        properties={properties}
        render={(p) => (
          <div className="flex items-center gap-2" data-oid="3jrtn_w">
            <ClearableNumberInput
              value={p.interestRate ?? 0}
              onChange={(v: number) => {
                // Allow 0 for cleared state, but validate non-zero values
                const validatedValue = v === 0 ? 0 : Math.min(Math.max(v, 0.01), 5.0);
                updateProperty(p.id, "interestRate", validatedValue);
              }}
              step={0.01}
              className="w-20"
              placeholder="0"
              data-oid="gjto0-."
            />
          </div>
        )}
        data-oid="s-f_4sq"
      />

      <DataRow
        label={
          <TooltipLabel
            label="Bank Loan"
            tooltip="Loan-to-Value ratio and the actual loan amount you will receive from the bank. You can edit either the loan amount or LTV percentage - the other will be calculated automatically."
            data-oid="15v-uwu"
          />
        }
        properties={properties}
        render={(p) => {
          const currentBankLoan = p.bankLoan > 0 ? p.bankLoan : (p.purchasePrice * (p.ltv || 75)) / 100;
          const currentLtv = p.ltv || 75;
          
          return (
            <DualCell
              left={
                <div className="flex items-center gap-2" data-oid="3gsbne8">
                                      <CurrencyInput
                      value={currentBankLoan}
                      onChange={(v) => {
                        // When user inputs bank loan amount, calculate and update LTV
                        if (v > 0 && p.purchasePrice > 0) {
                          // Enforce maximum LTV of 75%
                          const calculatedLtv = (v / p.purchasePrice) * 100;
                          const newLtv = Math.min(calculatedLtv, 75);
                          const maxAllowedLoan = (p.purchasePrice * 75) / 100;
                          const finalLoanAmount = Math.min(v, maxAllowedLoan);
                          
                          updateProperty(p.id, "ltv", Math.round(newLtv));
                          updateProperty(p.id, "bankLoan", finalLoanAmount);
                        } else {
                          updateProperty(p.id, "bankLoan", v);
                        }
                      }}
                      data-oid="bank-loan-input"
                    />
                </div>
              }
              right={
                <div className="flex items-center gap-2" data-oid="fzw2gkq">
                  <span className="text-[11px] text-slate-600 whitespace-nowrap">LTV %</span>
                  <ClearableNumberInput
                    value={currentLtv}
                    onChange={(v: number) => {
                      // When user inputs LTV percentage, calculate and update bank loan amount
                      // Enforce maximum LTV of 75%
                      const validatedLtv = Math.min(v, 75);
                      if (validatedLtv > 0 && p.purchasePrice > 0) {
                        const newBankLoan = (p.purchasePrice * validatedLtv) / 100;
                        updateProperty(p.id, "ltv", validatedLtv);
                        updateProperty(p.id, "bankLoan", newBankLoan);
                      } else {
                        updateProperty(p.id, "ltv", validatedLtv);
                        updateProperty(p.id, "bankLoan", 0);
                      }
                    }}
                    step={1}
                    className="w-16"
                    placeholder="0"
                    data-oid="vrbvo_8"
                  />
                </div>
              }
              data-oid="0_8y40y"
            />
          );
        }}
        data-oid="0_8y40y"
      />

      <DataRow
        label={
          <TooltipLabel
            label="Est. TOP (Month-Year)"
            tooltip="Estimated Temporary Occupation Permit date for BUC properties. This is when construction is expected to be completed."
            data-oid="2qv5m3a"
          />
        }
        properties={properties}
        render={(p) => {
          if (p.type === "Resale") {
            return (
              <span className="text-slate-500" data-oid="o05z0qn">
                N/A
              </span>
            );
          }

          const balanceMonths = calculateBalanceMonthAftTOP(
            p.estTOP,
            properties[0]?.holdingPeriod || 4,
          );

          return (
            <DualCell
              left={
                <MonthYearPicker
                  value={p.estTOP}
                  onChange={(date) => updateProperty(p.id, "estTOP", date)}
                  disabled={false}
                  data-oid="vcw7:fn"
                />
              }
              right={
                <div
                  className="text-xs text-slate-600 whitespace-normal leading-tight max-w-[120px] break-words"
                  data-oid="dakjrsa"
                >
                  Remaining Holding Period: {balanceMonths} months
                </div>
              }
              data-oid="19vdar:"
            />
          );
        }}
        data-oid="2y:l4fg"
      />

      <DataRow
        label={
          <TooltipLabel
            label="Monthly Instalment"
            tooltip="Your monthly mortgage payment amount. For BUC properties, this shows Year 1-5 breakdown based on construction progress. For Resale properties, this is the standard monthly payment."
            data-oid="monthly-instalment-tooltip"
          />
        }
        properties={properties}
        render={(p) => {
          if (p.type === "BUC") {
            // For BUC properties, show breakdown by years
            const breakdown = getBUCMonthlyInstalmentBreakdown(p, p.estTOP);
            const startingStage = getBUCStartingStage(p);
            
            return (
              <div className="space-y-2" data-oid="monthly-instalment-buc-breakdown">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  {/* Row 1: Yr 1, Yr 2, Yr 3 */}
                  <div className="text-left">
                    <div className="text-slate-600">Yr 1:</div>
                    <div className="font-medium">{fmtCurrency(breakdown.year1)}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-slate-600">Yr 2:</div>
                    <div className="font-medium">{fmtCurrency(breakdown.year2)}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-slate-600">Yr 3:</div>
                    <div className="font-medium">{fmtCurrency(breakdown.year3)}</div>
                  </div>
                  {/* Row 2: Yr 4, Yr 5 */}
                  <div className="text-left">
                    <div className="text-slate-600">Yr 4:</div>
                    <div className="font-medium">{fmtCurrency(breakdown.year4)}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-slate-600">Yr 5+:</div>
                    <div className="font-medium">{fmtCurrency(breakdown.year5)}</div>
                  </div>
                </div>
              </div>
            );
          } else {
            // For Resale properties or BUC without TOP date, show standard calculation
            const monthlyInstalment = calculateMonthlyInstalmentForProperty(p, p.estTOP);
            return (
              <div className="space-y-1" data-oid="monthly-instalment-value">
                <div
                  className="text-sm font-medium text-slate-900"
                  data-oid="monthly-instalment-amount"
                >
                  {fmtCurrency(monthlyInstalment)}
                </div>

              </div>
            );
          }
        }}
        data-oid="monthly-instalment-row"
      />

      <tr className="h-4 bg-white" data-oid="8501bzl">
        <td
          colSpan={properties.length + 1}
          className="border-none"
          data-oid="xds6gpw"
        ></td>
      </tr>
    </>
  );
}

