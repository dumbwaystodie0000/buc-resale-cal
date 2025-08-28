import { TrendingUp, DollarSign, Percent, Calculator } from "lucide-react";
import type { Property, Mode } from "./types";
import { calculateValues } from "./calculations";
import { fmtCurrency, fmtPercent } from "./utils";
import { IconRow, SectionRow } from "./table-components";
import { TooltipLabel } from "./ui-components";

interface PropertySummaryProps {
  properties: Property[];
  mode: Mode;
  taxBracket: number;
  monthlyRental: number;
}

export default function PropertySummary({
  properties,
  mode,
  taxBracket,
  monthlyRental,
}: PropertySummaryProps) {
  return (
    <>
      <SectionRow
        title="Investment Summary"
        colSpan={properties.length + 1}
        icon="journal-richtext"
        data-oid="ega469e"
      />

      <IconRow
        label={
          <TooltipLabel
            label="Projected Property Valuation"
            tooltip="The estimated future value of your property at the end of the holding period, based on the annual growth rate and holding period."
            data-oid="w_q4lhv"
          />
        }
        icon={TrendingUp}
        properties={properties}
        renderValue={(p) =>
          fmtCurrency(
            calculateValues(p, {
              mode,
              taxBracket,
              vacancyMonth: p.vacancyMonth,
              monthlyRental,
            }).projectedValuation,
          )
        }
        data-oid="wqes:dc"
      />

      <tr className="hover:bg-[#F8F9FA]" data-oid="u4vga3l">
        <td
                      className="sticky left-0 z-10 px-4 py-3 border-b border-r border-[#CCCCCC]/50 font-medium text-sm align-middle"
          data-oid="ij90bu2"
        >
          <div className="flex items-center gap-2" data-oid="_bbc3a5">
            <DollarSign className="h-4 w-4 text-[#666666]" data-oid="clcgrvi" />
            <TooltipLabel
              label="Est. Net Profit"
              tooltip="The estimated net profit after selling the property, calculated as Projected Property Valuation minus Purchase Price minus Total Expenses."
              data-oid="5ld0m1r"
            />
          </div>
        </td>
        {properties.map((p, i) => {
          const netProfit = calculateValues(p, {
            mode,
            taxBracket,
            vacancyMonth: p.vacancyMonth,
            monthlyRental,
          }).netProfit;
          const isNegative = netProfit < 0;
          return (
            <td
              key={p.id}
              className={`px-4 py-3 border-b border-r border-[#CCCCCC]/50 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
              data-oid="c_vlo:6"
            >
              <div
                className={`font-bold ${isNegative ? "text-[#B40101]" : "text-[#000000]"}`}
                data-oid="ewqwwi8"
              >
                {fmtCurrency(netProfit)}
              </div>
            </td>
          );
        })}
      </tr>
      <IconRow
        label={
          <TooltipLabel
            label="Return on Equity (ROE)"
            tooltip="Return on Equity measures the profitability of your investment relative to the equity you have in the property. Higher ROE indicates better investment performance."
            data-oid=".g88k0m"
          />
        }
        icon={Percent}
        properties={properties}
        renderValue={(p) => {
          const roe = calculateValues(p, {
            mode,
            taxBracket,
            vacancyMonth: p.vacancyMonth,
            monthlyRental,
          }).roe;
          return roe === 0 ? "0%" : fmtPercent(roe);
        }}
        data-oid="ylkq90r"
      />

      <IconRow
        label={
          <TooltipLabel
            label="Annualised Gain"
            tooltip="The annual growth rate you specified for the property. This represents the expected yearly appreciation in property value."
            data-oid="3n21ou4"
          />
        }
        icon={Percent}
        properties={properties}
        renderValue={(p) => `${p.annualGrowth || 0}%`}
        data-oid="qr9uwg:"
      />

      <IconRow
        label={
          <TooltipLabel
            label="Total Cash/CPF Return After Sale"
            tooltip="The total amount of cash and CPF you will receive after selling the property, including your initial investment and any profits or losses."
            data-oid="wp10a44"
          />
        }
        icon={Calculator}
        properties={properties}
        renderValue={(p) =>
          fmtCurrency(
            calculateValues(p, {
              mode,
              taxBracket,
              vacancyMonth: p.vacancyMonth,
              monthlyRental,
            }).totalCashReturn,
          )
        }
        data-oid="_7i2lh:"
      />
    </>
  );
}
