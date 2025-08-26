import { TrendingUp, DollarSign, Percent, Calculator } from "lucide-react";
import type { Property, Mode } from "./types";
import { calculateValues } from "./calculations";
import { fmtCurrency, fmtPercent } from "./utils";
import { IconRow, SectionRow } from "./table-components";

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
        label={`Projected Property Valuation`}
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

      <tr className="hover:bg-slate-100" data-oid="u4vga3l">
        <td
          className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
          data-oid="ij90bu2"
        >
          <div className="flex items-center gap-2" data-oid="_bbc3a5">
            <DollarSign className="h-4 w-4 text-slate-600" data-oid="clcgrvi" />
            <span data-oid="it0blf0">Est. Net Profit</span>
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
              className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
              data-oid="c_vlo:6"
            >
              <div
                className={`font-semibold ${isNegative ? "text-red-600" : "text-green-600"}`}
                data-oid="ewqwwi8"
              >
                {fmtCurrency(netProfit)}
              </div>
            </td>
          );
        })}
      </tr>
      <IconRow
        label="Return on Equity (ROE)"
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
        label="Annualised Gain"
        icon={Percent}
        properties={properties}
        renderValue={(p) => `${p.annualGrowth || 0}%`}
        data-oid="qr9uwg:"
      />

      <IconRow
        label="Total Cash/CPF Return After Sale"
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
