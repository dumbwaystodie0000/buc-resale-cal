"use client";

import type { Property, Mode } from "./types";
import { calculateValues } from "./calculations";
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
              value={p.loanTenure || 30}
              onChange={(v: number) =>
                updateProperty(p.id, "loanTenure", Math.min(Math.max(v, 1), 35))
              }
              step={1}
              className="w-20"
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
              value={p.interestRate || 2.0}
              onChange={(v: number) =>
                updateProperty(
                  p.id,
                  "interestRate",
                  Math.min(Math.max(v, 0.01), 5.0),
                )
              }
              step={0.01}
              className="w-20"
              data-oid="gjto0-."
            />
          </div>
        )}
        data-oid="s-f_4sq"
      />

      <DataRow
        label={
          <TooltipLabel
            label="LTV %"
            tooltip="Loan-to-Value ratio: the percentage of the property value that you can borrow. Maximum 75% for most properties."
            data-oid="y665:.p"
          />
        }
        properties={properties}
        render={(p) => (
          <div className="flex items-center gap-2" data-oid="fzw2gkq">
            <ClearableNumberInput
              value={p.ltv || 75}
              onChange={(v: number) =>
                updateProperty(p.id, "ltv", Math.min(Math.max(v, 1), 75))
              }
              step={1}
              className="w-20"
              data-oid="vrbvo_8"
            />
          </div>
        )}
        data-oid="wb5zg35"
      />

      <DataRow
        label={
          <TooltipLabel
            label="Bank Loan"
            tooltip="The actual loan amount you will receive from the bank, calculated as Purchase Price × LTV %."
            data-oid="15v-uwu"
          />
        }
        properties={properties}
        render={(p) => {
          const bankLoan = (p.purchasePrice * (p.ltv || 75)) / 100;
          return (
            <div className="space-y-1" data-oid="4d5tyjk">
              <div
                className="text-sm font-medium text-slate-900"
                data-oid="3gsbne8"
              >
                {fmtCurrency(bankLoan)}
              </div>
            </div>
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
                  {balanceMonths} months to end Holding Period
                </div>
              }
              data-oid="19vdar:"
            />
          );
        }}
        data-oid="2y:l4fg"
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
