"use client";

import type { Property, Mode, CommissionRate } from "./types";
import { TAX_BRACKETS } from "./constants";
import { calculateValues } from "./calculations";
import { fmtCurrency, fmtRate } from "./utils";
import {
  CurrencyInput,
  LabeledCurrency,
  DualCell,
  ValueText,
  CommissionRateSelector,
  TooltipLabel,
} from "./ui-components";
import {
  SectionRow,
  DataRow,
  MaybeNADataRow,
  ConditionalBUCDataRow,
  CommissionRateDataRow,
} from "./table-components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpensesSectionProps {
  properties: Property[];
  mode: Mode;
  taxBracket: number;
  monthlyRental: number;
  selectedTaxId: string | undefined;
  balanceMonthsMap: Map<string, number>;
  globalCommissionRate: CommissionRate;
  setSelectedTaxId: (id: string) => void;
  setTaxBracket: (rate: number) => void;
  updateProperty: (id: string, field: keyof Property, value: any) => void;
  setGlobalCommissionRate: (rate: CommissionRate) => void;
}

export default function ExpensesSection({
  properties,
  mode,
  taxBracket,
  monthlyRental,
  selectedTaxId,
  balanceMonthsMap,
  globalCommissionRate,
  setSelectedTaxId,
  setTaxBracket,
  updateProperty,
  setGlobalCommissionRate,
}: ExpensesSectionProps) {
  const selectedTax = selectedTaxId
    ? TAX_BRACKETS.find((o) => o.id === selectedTaxId)
    : undefined;

  return (
    <>
      <SectionRow
        title="Other Expenses"
        colSpan={properties.length + 1}
        icon="piggy-bank"
        data-oid="7boy0a8"
      />

      {mode === "own" && (
        <DataRow
          label={
            <TooltipLabel
              label="Rent while waiting for BUC"
              tooltip="Monthly rent you need to pay while waiting for your BUC property to be completed. Only applicable to BUC properties."
              data-oid="3hpvpd7"
            />
          }
          properties={properties}
          render={(p) => {
            const d = calculateValues(p, {
              mode,
              taxBracket,
              vacancyMonth: p.vacancyMonth,
              monthlyRental,
            });
            const isNA = p.type === "Resale";
            return isNA ? (
              <div className="text-xs text-slate-500" data-oid="mypjuj3">
                N/A
              </div>
            ) : (
              <DualCell
                left={
                  <ValueText data-oid="dbar_u6">
                    {fmtCurrency(d.rentWhileWaitingTotal)}
                  </ValueText>
                }
                right={
                  <LabeledCurrency
                    label="Monthly"
                    value={p.monthlyRentWhileWaiting}
                    step={100}
                    onChange={(v) =>
                      updateProperty(p.id, "monthlyRentWhileWaiting", v)
                    }
                    data-oid="58holdy"
                  />
                }
                data-oid="19vdar:"
              />
            );
          }}
          data-oid="2y:l4fg"
        />
      )}

      <DataRow
        label={
          <TooltipLabel
            label="Total Interest Payable (Bank Loan)"
            tooltip="Total interest you will pay on your mortgage loan over the holding period. This is calculated based on your loan amount, interest rate, and tenure."
            data-oid="a9kttki"
          />
        }
        properties={properties}
        render={(p) => {
          const d = calculateValues(p, {
            mode,
            taxBracket,
            vacancyMonth: p.vacancyMonth,
            monthlyRental,
          });
          return (
            <div className="space-y-1" data-oid="4d5tyjk">
              <div
                className="text-sm font-medium text-slate-900"
                data-oid="3gsbne8"
              >
                {fmtCurrency(d.bankInterest)}
              </div>
              <div className="text-xs text-slate-600" data-oid="dakjrsa">
                {p.type === "BUC" ? "BUC Int: " : "Resale Int: "}
                {fmtRate(p.interestRate || 2.0)}
              </div>
            </div>
          );
        }}
        data-oid="0_8y40y"
      />

      <ConditionalBUCDataRow
        label={
          <TooltipLabel
            label="Maintenance Fee"
            tooltip="Monthly maintenance fee for the property. This covers common area maintenance, security, and other shared services."
            data-oid="ey6k:0u"
          />
        }
        properties={properties}
        fieldKey="maintenanceFee"
        mode={mode}
        balanceMonthsMap={balanceMonthsMap}
        renderInput={(p) => {
          const d = calculateValues(p, {
            mode,
            taxBracket,
            vacancyMonth: p.vacancyMonth,
            monthlyRental,
          });
          return (
            <DualCell
              left={
                <ValueText data-oid="t051b5m">
                  {fmtCurrency(d.maintenanceFeeTotal)}
                </ValueText>
              }
              right={
                <LabeledCurrency
                  label="Monthly"
                  value={p.monthlyMaintenance}
                  step={50}
                  onChange={(v) =>
                    updateProperty(p.id, "monthlyMaintenance", v)
                  }
                  data-oid="ef.hi7p"
                />
              }
              data-oid="bzi7osz"
            />
          );
        }}
        data-oid="g08sbt8"
      />

      <DataRow
        label={
          <TooltipLabel
            label="Buyer Stamp Duty (BSD)"
            tooltip="Buyer Stamp Duty is a tax on documents signed when you buy or acquire property in Singapore."
            data-oid="bsd-tooltip"
          />
        }
        properties={properties}
        render={(p) => {
          return (
            <ValueText data-oid="bsd-value">
              $0
            </ValueText>
          );
        }}
        data-oid="bsd-row"
      />

      <DataRow
        label={
          <TooltipLabel
            label="Additional Buyer Stamp Duty (ABSD)"
            tooltip="Additional Buyer Stamp Duty is an additional tax on property purchases. Rates vary by citizenship and number of properties owned."
            data-oid="absd-tooltip"
          />
        }
        properties={properties}
        render={(p) => {
          return (
            <ValueText data-oid="absd-value">
              $0
            </ValueText>
          );
        }}
        data-oid="absd-row"
      />

      {/* SSD Payable - only show if holding period is less than 4 years */}
      {properties[0]?.holdingPeriod < 4 && (
        <DataRow
          label={
            <TooltipLabel
              label="SSD Payable"
              tooltip="Seller's Stamp Duty (SSD) is payable if you sell your property within 4 years of purchase. Rates: 16% (1st year), 12% (2nd year), 8% (3rd year), 4% (4th year)."
              data-oid="75zo1b7"
            />
          }
          properties={properties}
          render={(p) => {
            const d = calculateValues(p, {
              mode,
              taxBracket,
              vacancyMonth: p.vacancyMonth,
              monthlyRental,
            });

            const sellingYear = p.holdingPeriod + 1;
            let rateText = "";

            if (sellingYear === 1) {
              rateText = "16%";
            } else if (sellingYear === 2) {
              rateText = "12%";
            } else if (sellingYear === 3) {
              rateText = "8%";
            } else if (sellingYear === 4) {
              rateText = "4%";
            }

            return (
              <DualCell
                left={
                  <ValueText data-oid="zftl7u9">
                    {fmtCurrency(d.ssdPayable)}
                  </ValueText>
                }
                right={
                  <div
                    className="text-xs text-slate-600 text-center"
                    data-oid="otmukr8"
                  >
                    {rateText}
                  </div>
                }
                data-oid="0g67wio"
              />
            );
          }}
          data-oid="9d4d.q7"
        />
      )}

      <ConditionalBUCDataRow
        label={
          <TooltipLabel
            label="Est. Property Tax"
            tooltip="Estimated annual property tax based on the Annual Value (AV) of your property."
            data-oid="i-a4-of"
          />
        }
        properties={properties}
        fieldKey="propertyTax"
        mode={mode}
        balanceMonthsMap={balanceMonthsMap}
        renderInput={(p) => (
          <CurrencyInput
            value={p.propertyTax}
            onChange={(v) => updateProperty(p.id, "propertyTax", v)}
            data-oid="xy5y3sq"
          />
        )}
        data-oid="812boo."
      />

      {mode === "investment" && (
        <DataRow
          label={
            <div className="flex items-center gap-3" data-oid="qkc4565">
              <TooltipLabel
                label="Income Tax on Net Rental Received"
                tooltip="Income tax payable on your net rental income after deducting allowable expenses. The tax rate depends on your personal income tax bracket."
                data-oid="0n9vwx9"
              />

              <div
                className="ml-auto flex flex-col items-start gap-1"
                data-oid="ru0umbs"
              >
                <Select
                  value={selectedTaxId}
                  onValueChange={(id: string) => {
                    const opt = TAX_BRACKETS.find((o) => o.id === id)!;
                    setSelectedTaxId(id);
                    setTaxBracket(opt.rate);
                  }}
                  data-oid="htsxu6."
                >
                  <SelectTrigger
                    className="h-8 w-[180px] text-xs text-slate-500 border border-slate-200 rounded"
                    data-oid="j5p86rb"
                  >
                    {selectedTax ? (
                      <div
                        className="flex w-full items-center justify-between text-xs text-slate-500"
                        data-oid="aaa7gio"
                      >
                        <span className="truncate pr-2" data-oid="xfalhd:">
                          {selectedTax.range}
                        </span>
                        <span
                          className="text-right tabular-nums"
                          data-oid="_jswt_m"
                        >
                          ({fmtRate(selectedTax.rate)})
                        </span>
                      </div>
                    ) : (
                      <SelectValue
                        placeholder="Select Tax Bracket"
                        data-oid="tvj_5ai"
                      />
                    )}
                  </SelectTrigger>
                  <SelectContent
                    className="max-h-72 w-[180px] text-xs text-slate-600"
                    data-oid="i0e2gs9"
                  >
                    {TAX_BRACKETS.map((o) => (
                      <SelectItem
                        key={o.id}
                        value={o.id}
                        textValue={`${o.range} (${fmtRate(o.rate)})`}
                        className="relative pl-3 pr-3 text-xs text-slate-500"
                        data-oid="e:pmx39"
                      >
                        <span data-oid="j6auz0e">{o.range}</span>
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                          data-oid="1dpb8ks"
                        >
                          ({fmtRate(o.rate)})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          }
          properties={properties}
          render={(p) => (
            <div data-oid="1885moh">
              {fmtCurrency(
                calculateValues(p, {
                  mode,
                  taxBracket,
                  vacancyMonth: p.vacancyMonth,
                  monthlyRental,
                }).taxOnRental,
              )}
            </div>
          )}
          data-oid="ezznh8f"
        />
      )}

      <ConditionalBUCDataRow
        label={
          <TooltipLabel
            label="Minor Renovation"
            tooltip="Cost of minor renovations or improvements you plan to make to the property. This could include painting, flooring, or minor structural changes."
            data-oid=":3dosq2"
          />
        }
        properties={properties}
        fieldKey="minorRenovation"
        mode={mode}
        balanceMonthsMap={balanceMonthsMap}
        renderInput={(p) => (
          <CurrencyInput
            value={p.minorRenovation}
            onChange={(v) => updateProperty(p.id, "minorRenovation", v)}
            data-oid="mg6b731"
          />
        )}
        data-oid="s6ch814"
      />

      <ConditionalBUCDataRow
        label={
          <TooltipLabel
            label="Furniture & Fittings"
            tooltip="Cost of furniture, appliances, and fittings you plan to purchase for the property. This includes items like sofas, beds, kitchen appliances, etc."
            data-oid=":w-gsuu"
          />
        }
        properties={properties}
        fieldKey="furnitureFittings"
        mode={mode}
        balanceMonthsMap={balanceMonthsMap}
        renderInput={(p) => (
          <CurrencyInput
            value={p.furnitureFittings}
            onChange={(v) => updateProperty(p.id, "furnitureFittings", v)}
            data-oid="iiy2iqh"
          />
        )}
        data-oid="j_.6xu."
      />

      {mode === "investment" && (
        <CommissionRateDataRow
          label={
            <div className="flex items-center gap-3" data-oid="yt4nsu:">
              <TooltipLabel
                label="Rental Agent Commission"
                tooltip="Commission paid to property agents for finding tenants and managing rental agreements. You can select from preset rates or enter a custom amount."
                data-oid=":mgb2mq"
              />

              <div
                className="ml-auto flex flex-col items-start gap-1"
                data-oid="-r8gz_-"
              >
                <CommissionRateSelector
                  value={globalCommissionRate}
                  onChange={(rate) => {
                    setGlobalCommissionRate(rate);
                    // Apply the global rate to all properties
                    properties.forEach((property) => {
                      updateProperty(property.id, "commissionRate", rate);
                      // Clear the commission amount when "none" is selected
                      if (rate === "none") {
                        updateProperty(property.id, "agentCommission", 0);
                      }
                      // Clear the commission amount when "other" is selected so user can enter their own value
                      if (rate === "other") {
                        updateProperty(property.id, "agentCommission", 0);
                      }
                    });
                  }}
                  data-oid="8h4lige"
                />
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    id="global-commission-gst"
                    checked={properties.every(p => p.commissionGST)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      properties.forEach((property) => {
                        updateProperty(property.id, "commissionGST", checked);
                      });
                    }}
                    className="h-3 w-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="global-commission-gst">GST is payable</label>
                </div>
              </div>
            </div>
          }
          properties={properties}
          mode={mode}
          balanceMonthsMap={balanceMonthsMap}
          globalCommissionRate={globalCommissionRate}
          monthlyRental={monthlyRental}
          onCommissionRateChange={(propertyId, rate) => {
            updateProperty(propertyId, "commissionRate", rate);
            // Clear the commission amount when "none" is selected
            if (rate === "none") {
              updateProperty(propertyId, "agentCommission", 0);
            }
            // Clear the commission amount when "other" is selected so user can enter their own value
            if (rate === "other") {
              updateProperty(propertyId, "agentCommission", 0);
            }
          }}
          onAgentCommissionChange={(propertyId, value) =>
            updateProperty(propertyId, "agentCommission", value)
          }
          onCommissionGSTChange={(propertyId, value) =>
            updateProperty(propertyId, "commissionGST", value)
          }
          data-oid="ti_k_sk"
        />
      )}

      <DataRow
        label={
          <TooltipLabel
            label="Other Expenses"
            tooltip="Any other miscellaneous expenses related to the property purchase or ownership, such as legal fees, agent fees, or other one-time costs."
            data-oid="9yxi3x0"
          />
        }
        properties={properties}
        render={(p) => (
          <CurrencyInput
            value={p.otherExpenses}
            onChange={(v) => updateProperty(p.id, "otherExpenses", v)}
            data-oid="3flriw6"
          />
        )}
        data-oid="4-b9kwv"
      />

      <tr className="bg-red-50 hover:bg-red-100" data-oid="2a6r:21">
        <td
          className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
          data-oid="oe3c-h6"
        >
          <TooltipLabel
            label="Total Expenses"
            tooltip="Sum of all expenses including interest, maintenance, property tax, renovation costs, furniture, and other miscellaneous expenses."
            data-oid="7a3qlq-"
          />
        </td>
        {properties.map((p, i) => (
          <td
            key={p.id}
            className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
            data-oid="4xmg1sn"
          >
            <ValueText
              className="text-rose-700 font-semibold"
              data-oid="ivd2ebf"
            >
              {fmtCurrency(
                calculateValues(p, {
                  mode,
                  taxBracket,
                  vacancyMonth: p.vacancyMonth,
                  monthlyRental,
                }).totalOtherExpenses,
              )}
            </ValueText>
          </td>
        ))}
      </tr>

      <tr className="h-4 bg-white" data-oid="-zqyh:.">
        <td
          colSpan={properties.length + 1}
          className="border-none"
          data-oid="s-rod.0"
        ></td>
      </tr>
    </>
  );
}
