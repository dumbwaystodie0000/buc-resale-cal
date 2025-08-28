"use client";

import type { Property, Mode } from "./types";
import { calculateValues } from "./calculations";
import { fmtCurrency } from "./utils";
import {
  LabeledNumber,
  DualCell,
  ValueText,
  LabeledCurrency,
  TooltipLabel,
} from "./ui-components";
import { SectionRow, DataRow, ConditionalBUCDataRow } from "./table-components";
import VacancyMonthSelector from "./vacancy-month-selector";

interface GrowthRentalSectionProps {
  properties: Property[];
  mode: Mode;
  taxBracket: number;
  balanceMonthsMap: Map<string, number>;
  updateProperty: (id: string, field: keyof Property, value: any) => void;
}

export default function GrowthRentalSection({
  properties,
  mode,
  taxBracket,
  balanceMonthsMap,
  updateProperty,
}: GrowthRentalSectionProps) {
  return (
    <>
      <SectionRow
        title={mode === "own" ? "Growth" : "Rental & Growth"}
        colSpan={properties.length + 1}
        icon="graph-up-arrow"
        data-oid="b47pshv"
      />

      <DataRow
        label={
          <TooltipLabel
            label="Projected Property Growth"
            tooltip="The expected increase in property value over the holding period, based on the annual growth rate you specify."
            data-oid=":a8bnjr"
          />
        }
        properties={properties}
        render={(p) => {
          const d = calculateValues(p, {
            mode,
            taxBracket,
            vacancyMonth: p.vacancyMonth,
            monthlyRental: p.monthlyRental,
          });
          return (
            <DualCell
              left={
                <ValueText data-oid="6u49uow">
                  {fmtCurrency(d.projectedGrowth)}
                </ValueText>
              }
              right={
                <LabeledNumber
                  label="Annual %"
                  value={p.annualGrowth}
                  step={0.1}
                  onChange={(v) => updateProperty(p.id, "annualGrowth", v)}
                  data-oid="ato-k_2"
                />
              }
              data-oid="m5f1e_i"
            />
          );
        }}
        data-oid="w:ue9."
      />

      {mode === "investment" && (
        <>
          <ConditionalBUCDataRow
            label={
              <TooltipLabel
                label="Rental Income"
                tooltip="Monthly rental income you expect to receive from the property. This amount is used to calculate rental income tax: Monthly rent × 12 × 0.85 (15% expenses deduction) × tax bracket rate × rental years. For BUC properties, rental years = balance months after TOP ÷ 12 (rounded up). For Resale properties, rental years = holding period. This affects your cash flow and investment returns."
                data-oid="nco80p6"
              />
            }
            properties={properties}
            fieldKey="monthlyRental"
            mode={mode}
            balanceMonthsMap={balanceMonthsMap}
            renderInput={(p) => {
              const d = calculateValues(p, {
                mode,
                taxBracket,
                vacancyMonth: p.vacancyMonth,
                monthlyRental: p.monthlyRental,
              });
              return (
                <DualCell
                  left={
                    <ValueText data-oid="7x72t.v">
                      {fmtCurrency(d.rentalIncome)}
                    </ValueText>
                  }
                  right={
                    <LabeledCurrency
                      label="Monthly"
                      value={p.monthlyRental}
                      step={100}
                      onChange={(v) => updateProperty(p.id, "monthlyRental", v)}
                      data-oid="vlhnsm-"
                    />
                  }
                  data-oid="bzi7osz"
                />
              );
            }}
            data-oid="s2dw-xk"
          />

          <DataRow
            label={
              <TooltipLabel
                label="Vacancy Month"
                tooltip="The number of months per year when the property is vacant and not generating rental income. This affects your total rental income calculation but does not affect rental income tax calculation (tax is calculated assuming 0 vacancy months for both BUC and Resale properties)."
                data-oid="la74_5y"
              />
            }
            properties={properties}
            render={(p) => {
              // For BUC properties, check if balance months after TOP > 0
              if (p.type === "BUC") {
                const balanceMonths = balanceMonthsMap.get(p.id) || 0;
                if (balanceMonths === 0) {
                  return (
                    <div className="text-xs text-slate-500" data-oid="qfna9e.">
                      N/A
                    </div>
                  );
                }
              }

              return (
                <DualCell
                  left={
                    <div
                      className="text-red-600 font-medium"
                      data-oid="jurc80r"
                    >
                      {(() => {
                        const d = calculateValues(p, {
                          mode,
                          taxBracket,
                          vacancyMonth: p.vacancyMonth,
                          monthlyRental: p.monthlyRental,
                        });
                        return d.vacancyDeduction === 0
                          ? fmtCurrency(0)
                          : `-${fmtCurrency(d.vacancyDeduction)}`;
                      })()}
                    </div>
                  }
                  right={
                    <VacancyMonthSelector
                      value={String(p.vacancyMonth)}
                      onChange={(v: string) =>
                        updateProperty(p.id, "vacancyMonth", Number.parseInt(v))
                      }
                      data-oid="y2qnw5a"
                    />
                  }
                  data-oid="mpnz:rq"
                />
              );
            }}
            data-oid="cjj:-bf"
          />
        </>
      )}

      <tr className="bg-[#E6F2E6] hover:bg-[#D9E9D9]" data-oid="2mawz7.">
        <td
                      className="sticky left-0 z-10 px-4 py-3 border-b border-r border-[#CCCCCC]/50 text-[#000000] font-semibold text-[14px] align-middle"
          data-oid="5o9hi5:"
        >
          <TooltipLabel
            label="Est. Gross Profit"
            tooltip="The estimated gross profit from your property investment, calculated as Projected Property Growth plus Total Rental Income minus Total Interest Payable."
            data-oid="o:sj8cf"
          />
        </td>
        {properties.map((p, i) => {
          const d = calculateValues(p, {
            mode,
            taxBracket,
            vacancyMonth: p.vacancyMonth,
            monthlyRental: p.monthlyRental,
          });
          return (
            <td
              key={p.id}
              className={`px-4 py-3 border-b border-r border-[#CCCCCC]/50 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
              data-oid="fqh9t2p"
            >
              <ValueText
                className="text-[#000000] font-semibold"
                data-oid="t2pbazv"
              >
                {fmtCurrency(d.grossProfit)}
              </ValueText>
            </td>
          );
        })}
      </tr>

      <tr className="h-4 bg-white" data-oid="h59vgxk">
        <td
          colSpan={properties.length + 1}
          className="border-none"
          data-oid="h0y:2a3"
        ></td>
      </tr>
    </>
  );
}
