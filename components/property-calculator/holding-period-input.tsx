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
        className="text-md font-bold text-[#000000]"
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
          className="w-12 px-2 py-1 text-sm border border-[#CCCCCC] rounded focus:outline-none focus:ring-2 focus:ring-[#999999] focus:border-[#999999] text-[#000000]"
          data-oid="holding-period-header-input"
        />
      </div>
      <span className="text-xs text-[#666666]" data-oid="s8l0.gu">
        Year(s)
      </span>
    </div>
  );
}
