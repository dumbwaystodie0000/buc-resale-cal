"use client";

import type { Property, Mode, CommissionRate } from "./types";
import { TAX_BRACKETS } from "./constants";
import { calculateValues, calculateABSD } from "./calculations";
import { fmtCurrency, fmtRate } from "./utils";
import {
  CurrencyInput,
  LabeledCurrency,
  DualCell,
  ValueText,
  CommissionRateSelector,
  SalesCommissionRateSelector,
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
import { Checkbox } from "@/components/ui/checkbox";

// ABSD Profile Selector Component
function ABSDProfileSelector({ 
  citizenship, 
  propertyCount, 
  onChange 
}: { 
  citizenship: "SC" | "PR" | "Foreigner" | "Company"
  propertyCount: number
  onChange: (citizenship: "SC" | "PR" | "Foreigner" | "Company", propertyCount: number) => void
}) {
  const buyerProfileOptions = [
    { value: "SC", label: "SG Citizen" },
    { value: "PR", label: "PR" },
    { value: "Foreigner", label: "Foreigner" },
    { value: "Company", label: "Entity" }
  ];

  const propertyCountOptions = [
    { value: 1, label: "1st" },
    { value: 2, label: "2nd" },
    { value: 3, label: "3rd+" }
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
                        <div className="text-xs font-medium text-[#666666]">Buyer Profile:</div>
        <div className="grid grid-cols-2 gap-1">
          {buyerProfileOptions.map((option) => (
            <button
              key={option.value}
              className={`h-6 px-2 text-[11px] rounded border ${
                citizenship === option.value
                  ? "bg-[#B40101] hover:bg-[#9D0101] text-white border-[#B40101]"
                  : "text-[#333333]/80 bg-[#F5F5F5] border-[#E5E5E5] opacity-60"
              }`}
              onClick={() => onChange(option.value as "SC" | "PR" | "Foreigner" | "Company", propertyCount)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-[#666666]">Property Count:</div>
        <div className="flex gap-1">
          {propertyCountOptions.map((option) => (
            <button
              key={option.value}
              className={`h-6 px-2 text-[11px] rounded border ${
                propertyCount === option.value
                  ? "bg-[#B40101] hover:bg-[#9D0101] text-white border-[#B40101]"
                  : "text-[#333333]/80 bg-[#F5F5F5] border-[#E5E5E5] opacity-60 cursor-not-allowed"
              }`}
              onClick={() => onChange(citizenship, option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ExpensesSectionProps {
  properties: Property[];
  mode: Mode;
  taxBracket: number;
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
        title="Expenses"
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
              monthlyRental: p.monthlyRentWhileWaiting,
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
            monthlyRental: p.monthlyRentWhileWaiting,
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
                {fmtRate(p.interestRate ?? 2.0)}
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
            monthlyRental: p.monthlyRentWhileWaiting,
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
          const d = calculateValues(p, {
            mode,
            taxBracket,
            vacancyMonth: p.vacancyMonth,
            monthlyRental: p.monthlyRentWhileWaiting,
          });
          return (
            <ValueText data-oid="bsd-value">
              {fmtCurrency(d.bsd)}
            </ValueText>
          );
        }}
        data-oid="bsd-row"
      />

      <DataRow
        label={
          <div className="flex items-center gap-3" data-oid="absd-label">
            <TooltipLabel
              label="Additional Buyer Stamp Duty (ABSD)"
              tooltip={`Additional Buyer Stamp Duty is an additional tax on property purchases. Current rate: ${(() => {
                const citizenship = properties[0]?.absdCitizenship || "SC";
                const propertyCount = properties[0]?.absdPropertyCount || 1;
                const rate = calculateABSD(1000000, citizenship, propertyCount) / 1000000 * 100;
                return rate === 0 ? "0%" : `${rate.toFixed(0)}%`;
              })()}`}
              data-oid="absd-tooltip"
            />

            <div
              className="ml-auto flex flex-col items-start gap-1 min-w-[160px]"
              data-oid="absd-selector"
            >
              <ABSDProfileSelector
                citizenship={properties[0]?.absdCitizenship || "SC"}
                propertyCount={properties[0]?.absdPropertyCount || 1}
                onChange={(citizenship, propertyCount) => {
                  // Apply the settings to all properties
                  properties.forEach((property) => {
                    updateProperty(property.id, "absdCitizenship", citizenship);
                    updateProperty(property.id, "absdPropertyCount", propertyCount);
                  });
                }}
                data-oid="absd-profile-selector"
              />
            </div>
          </div>
        }
        properties={properties}
        render={(p) => {
          const d = calculateValues(p, {
            mode,
            taxBracket,
            vacancyMonth: p.vacancyMonth,
            monthlyRental: p.monthlyRentWhileWaiting,
          });
          
          return (
            <ValueText data-oid="absd-value">
              {fmtCurrency(d.absd)}
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
              label="Seller Stamp Duty (SSD)"
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
              monthlyRental: p.monthlyRentWhileWaiting,
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
              <ValueText data-oid="zftl7u9">
                {fmtCurrency(d.ssdPayable)}
              </ValueText>
            );
          }}
          data-oid="9d4d.q7"
        />
      )}

      <DataRow
        label={
          <TooltipLabel
            label="Est. Property Tax"
            tooltip="Automatically calculated property tax based on Annual Value (AV) and Singapore property tax rates."
            data-oid="i-a4-of"
          />
        }
        properties={properties}
        render={(p) => {
          const calculatedValues = calculateValues(p, {
            mode,
            taxBracket,
            vacancyMonth: p.vacancyMonth,
            monthlyRental: p.monthlyRental,
          });
          return fmtCurrency(calculatedValues.propertyTax);
        }}
        data-oid="812boo."
      />

      {mode === "investment" && (
        <DataRow
          label={
            <div className="flex items-center gap-3" data-oid="qkc4565">
              <TooltipLabel
                label="Income Tax on Net Rental Received"
                tooltip="Income tax payable on your net rental income. This field estimates the income tax on your rental earnings based on your highest tax rate. To find your rate, please calculate your total chargeable income for the year: Your Personal Annual Income + This Property's Net Rental Income."
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
                  monthlyRental: p.monthlyRental,
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
                <div className="flex items-center gap-1">
                  <Checkbox
                    id="rental-gst-toggle"
                    checked={properties[0]?.rentalGstEnabled || false}
                    onCheckedChange={(checked) => {
                      properties.forEach((property) => {
                        updateProperty(property.id, "rentalGstEnabled", checked as boolean);
                      });
                    }}
                    data-oid="rental-gst-toggle-checkbox"
                  />
                  <label
                    htmlFor="rental-gst-toggle"
                    className="text-xs text-[#666666] font-normal whitespace-nowrap"
                    data-oid="rental-gst-toggle-label"
                  >
                    GST is Payable
                  </label>
                </div>
              </div>
            </div>
          }
          properties={properties}
          mode={mode}
          balanceMonthsMap={balanceMonthsMap}
          globalCommissionRate={globalCommissionRate}
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
          render={(p) => {
            const d = calculateValues(p, {
              mode,
              taxBracket: 0, // We don't need tax bracket for commission calculation
              vacancyMonth: p.vacancyMonth,
              monthlyRental: p.monthlyRental,
            });
            
            // Show the calculated commission amount (including GST if enabled)
            return (
              <div className="space-y-1" data-oid="rental-comm-value">
                <div className="text-sm font-medium text-slate-900" data-oid="rental-comm-amount">
                  {fmtCurrency(d.agentCommission || 0)}
                </div>
                {p.commissionRate === "other" && (
                  <LabeledCurrency
                    label="Custom"
                    value={p.agentCommission}
                    step={1000}
                    onChange={(v) =>
                      updateProperty(p.id, "agentCommission", v)
                    }
                    data-oid="rental-comm-custom"
                  />
                )}
              </div>
            );
          }}
          data-oid="ti_k_sk"
        />
      )}

      {/* Sales Commission Agent - shown in both own and investment modes */}
      <DataRow
        label={
          <div className="flex items-center gap-3" data-oid="sales-comm-label">
            <TooltipLabel
              label="Sales Commission Agent"
              tooltip="Commission paid to property agents when selling the property. Based on projected selling price (purchase price + projected growth)."
              data-oid="sales-comm-tooltip"
            />

            <div
              className="ml-auto flex flex-col items-start gap-1"
              data-oid="sales-comm-selector"
            >
              <SalesCommissionRateSelector
                value={properties[0]?.salesCommissionRate || ""}
                onChange={(rate) => {
                  // Apply the rate to all properties
                  properties.forEach((property) => {
                    updateProperty(property.id, "salesCommissionRate", rate);
                    // Clear the commission amount when "none" is selected
                    if (rate === "none") {
                      updateProperty(property.id, "salesCommission", 0);
                    }
                    // Clear the commission amount when "other" is selected so user can enter their own value
                    if (rate === "other") {
                      updateProperty(property.id, "salesCommission", 0);
                    }
                  });
                }}
                data-oid="sales-comm-rate-selector"
              />
              <div className="flex items-center gap-1">
                <Checkbox
                  id="gst-toggle"
                  checked={properties[0]?.salesGstEnabled || false}
                  onCheckedChange={(checked) => {
                    properties.forEach((property) => {
                      updateProperty(property.id, "salesGstEnabled", checked as boolean);
                    });
                  }}
                  data-oid="gst-toggle-checkbox"
                />
                <label
                  htmlFor="gst-toggle"
                  className="text-xs text-[#666666] font-normal whitespace-nowrap"
                  data-oid="gst-toggle-label"
                >
                  GST is Payable
                </label>
              </div>
            </div>
          </div>
        }
        properties={properties}
        render={(p) => {
          const d = calculateValues(p, {
            mode,
            taxBracket,
            vacancyMonth: p.vacancyMonth,
            monthlyRental: p.monthlyRentWhileWaiting,
          });
          
          return (
            <div className="space-y-1" data-oid="sales-comm-value">
              <div className="text-sm font-medium text-slate-900" data-oid="sales-comm-amount">
                {fmtCurrency(d.salesCommission || 0)}
              </div>
              {p.salesCommissionRate === "other" && (
                <LabeledCurrency
                  label="Custom"
                  value={p.salesCommission}
                  step={1000}
                  onChange={(v) =>
                    updateProperty(p.id, "salesCommission", v)
                  }
                  data-oid="sales-comm-custom"
                />
              )}
            </div>
          );
        }}
        data-oid="sales-comm-row"
      />

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

      <tr className="kw-highlight hover:bg-[#F0E6E6]" data-oid="2a6r:21">
        <td
          className="sticky left-0 z-10 px-4 py-3 border-b border-r border-[#CCCCCC]/50 text-[#000000] font-semibold text-[14px]align-middle"
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
            className={`px-4 py-3 border-b border-r border-[#CCCCCC]/50 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
            data-oid="4xmg1sn"
          >
            <ValueText
              className="text-[#B40101] font-semibold"
              data-oid="ivd2ebf"
            >
              {fmtCurrency(
                calculateValues(p, {
                  mode,
                  taxBracket,
                  vacancyMonth: p.vacancyMonth,
                  monthlyRental: p.monthlyRentWhileWaiting,
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
