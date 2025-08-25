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
        data-oid="brhat5o"
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
        data-oid="nk5wis7"
      />

      <tr className="hover:bg-slate-100" data-oid="ww95kc.">
        <td
          className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
          data-oid="w.d0eah"
        >
          <div className="flex items-center gap-2" data-oid="nh:.772">
            <DollarSign className="h-4 w-4 text-slate-600" data-oid="_jq1v_r" />
            <span data-oid=".mu0j:o">Est. Net Profit</span>
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
              data-oid="upigb-5"
            >
              <div
                className={`font-semibold ${isNegative ? "text-red-600" : "text-green-600"}`}
                data-oid="5qwx_55"
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
        data-oid="kv2g30w"
      />

      <IconRow
        label="Annualised Gain"
        icon={Percent}
        properties={properties}
        renderValue={(p) => `${p.annualGrowth || 0}%`}
        data-oid="3c3v77:"
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
        data-oid="wb:_atz"
      />
    </>
  );
}
