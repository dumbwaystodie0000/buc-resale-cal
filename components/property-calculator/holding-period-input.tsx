"use client";

import { TooltipLabel } from "./ui-components";

interface HoldingPeriodInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export default function HoldingPeriodInput({
  value,
  onChange,
  onBlur,
}: HoldingPeriodInputProps) {
  return (
    <div className="flex items-center gap-2" data-oid="wq6ki4e">
      <TooltipLabel
        label="Holding Period:"
        tooltip="The number of years you plan to hold the property before selling it. This affects calculations for interest payments, rental income, and property growth."
        className="text-sm font-medium text-slate-700"
        data-oid="pj3cj82"
      />

      <div className="relative" data-oid="fzelwpx">
        <input
          type="number"
          min="0"
          step="0.5"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="w-16 px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-oid="holding-period-header-input"
        />
      </div>
      <span className="text-sm text-slate-600" data-oid="s8l0.gu">
        Year(s)
      </span>
    </div>
  );
}
