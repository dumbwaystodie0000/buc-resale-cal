import { TrendingUp, DollarSign, Percent, Calculator } from "lucide-react";
import type { Property, Mode } from "./types";
import { calculateValues } from "./calculations";
import { fmtCurrency, fmtPercent } from "./utils";
import { IconRow, SectionRow } from "./table-components";

interface PropertySummaryProps {
  properties: Property[];
  mode: Mode;
  taxBracket: number;
  vacancyMonth: number;
}

export default function PropertySummary({
  properties,
  mode,
  taxBracket,
  vacancyMonth,
}: PropertySummaryProps) {
  return (
    <>
      <SectionRow
        title="Investment Summary"
        colSpan={properties.length + 1}
        icon="journal-richtext"
        data-oid="dg-gyr9"
      />

      <IconRow
        label={`Projected Property Valuation`}
        icon={TrendingUp}
        properties={properties}
        renderValue={(p) =>
          fmtCurrency(
            calculateValues(p, { mode, taxBracket, vacancyMonth })
              .projectedValuation,
          )
        }
        data-oid="1118:-2"
      />

      <tr className="hover:bg-slate-100" data-oid="bmgab-8">
        <td
          className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
          data-oid="ybv:g49"
        >
          <div className="flex items-center gap-2" data-oid="4pa2tbi">
            <DollarSign className="h-4 w-4 text-slate-600" data-oid="d:k.0qf" />
            <span data-oid="sf7i0ae">Est. Net Profit</span>
          </div>
        </td>
        {properties.map((p, i) => {
          const netProfit = calculateValues(p, {
            mode,
            taxBracket,
            vacancyMonth,
          }).netProfit;
          const isNegative = netProfit < 0;
          return (
            <td
              key={p.id}
              className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
              data-oid="961tb3r"
            >
              <div
                className={`font-semibold ${isNegative ? "text-red-600" : "text-green-600"}`}
                data-oid="wrw9zrn"
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
            vacancyMonth,
          }).roe;
          return roe === 0 ? "0%" : fmtPercent(roe);
        }}
        data-oid="86xai8c"
      />

      <IconRow
        label="Annualised Gain"
        icon={Percent}
        properties={properties}
        renderValue={(p) => `${p.annualGrowth || 0}%`}
        data-oid="fe1j12x"
      />

      <IconRow
        label="Total Cash/CPF Return After Sale"
        icon={Calculator}
        properties={properties}
        renderValue={(p) =>
          fmtCurrency(
            calculateValues(p, { mode, taxBracket, vacancyMonth })
              .totalCashReturn,
          )
        }
        data-oid="49d_r_0"
      />
    </>
  );
}
