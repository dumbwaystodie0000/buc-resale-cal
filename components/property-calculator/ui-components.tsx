"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Calendar, ChevronDownIcon, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PropertyType, CommissionRate, SalesCommissionRate } from "./types";
import { fmtCurrency } from "./utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ClearableNumberInput = React.forwardRef<
  HTMLInputElement,
  {
    value: number;
    onChange: (v: number) => void;
    step?: number;
    placeholder?: string;
    className?: string;
    showCurrency?: boolean;
    disabled?: boolean;
  }
>(
  (
    {
      value,
      onChange,
      step = 1000,
      placeholder,
      className = "",
      showCurrency = false,
      disabled = false,
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Update input value when value prop changes and not editing
    useEffect(() => {
      if (!isEditing) {
        setInputValue(Number.isFinite(value) ? value.toString() : "0");
      }
    }, [value, isEditing]);

    const handleFocus = () => {
      setIsEditing(true);
      // If value is 0, start with empty string instead of "0"
      setInputValue(
        Number.isFinite(value) && value !== 0 ? value.toString() : "",
      );
    };

    const handleBlur = () => {
      setIsEditing(false);
      const numValue = Number.parseFloat(inputValue || "0");
      onChange(numValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setIsEditing(false);
        const numValue = Number.parseFloat(inputValue || "0");
        onChange(numValue);
        // Use the current target (the input element that received the key press) to blur
        e.currentTarget.blur();
      }
    };

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      // Prevent mouse wheel from changing the input value
      e.currentTarget.blur();
    };

    const displayValue = isEditing
      ? inputValue
      : showCurrency && Number.isFinite(value) && value > 0
        ? fmtCurrency(value).replace("S$", "") // Remove currency symbol to avoid clutter
        : Number.isFinite(value) && value !== 0
          ? value.toString()
          : "";

    return (
      <div className={`relative ${className}`} data-oid="n3wubq8">
        <Input
          ref={ref}
          type={isEditing ? "number" : "text"}
          inputMode="decimal"
          step={step}
          value={displayValue}
          placeholder={placeholder || (value === 0 ? "0" : undefined)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          disabled={disabled}
          className="h-9 text-left pr-8 px-2 py-1 text-sm border border-[#CCCCCC] rounded focus:outline-none focus:ring-2 focus:ring-[#999999] focus:border-[#999999] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-[#000000] bg-[#FFFFFF]"
          data-oid="4udbg:w"
        />

        <button
          type="button"
          aria-label="Clear input"
          title="Clear"
          onClick={() => {
            onChange(0);
            setInputValue(""); // Set to empty string instead of "0"
            setIsEditing(true); // Keep in editing mode to show empty input
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
              }
            }, 0);
          }}
          disabled={disabled}
          className="absolute right-2 top-1.5 rounded p-0.5 text-[#999999] hover:text-[#666666] disabled:opacity-50 disabled:cursor-not-allowed"
          data-oid="u1-sry3"
        >
          <X className="h-3.5 w-3.5" data-oid="t0erz_a" />
        </button>
      </div>
    );
  },
);

export function PropertyTypeBadge({ type }: { type: PropertyType }) {
  return (
    <div
      className="inline-flex items-center rounded-md px-2 py-1"
      data-oid="gjmdz-h"
    >
      <img
        src={type === "BUC" ? "/buc.png" : "/resale.png"}
        alt={type}
        className="w-8 h-8 mr-2"
        data-oid="property-type-icon"
      />

      <span
        className={`text-md font-bold ${type === "BUC" ? "text-orange-700" : "text-emerald-700"}`}
        data-oid="7o3026i"
      >
        {type}
      </span>
    </div>
  );
}

export function PropertyPlaceholderButton({
  propertyId,
  propertyType,
  onClick,
}: {
  propertyId: string;
  propertyType: PropertyType;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full h-32 bg-[#F8F9FA] border-2 border-dashed border-[#CCCCCC] rounded-lg hover:bg-[#F0F0F0] hover:border-[#999999] transition-colors flex flex-col items-center justify-center gap-2 text-[#666666]"
      data-oid="41q9x8y"
    >
      <div className="text-sm font-medium" data-oid="y48h4ra">
        Select / Create New Entry
      </div>
      <div className="text-xs text-[#999999]" data-oid="7qxuk6o">
        Click to add property details
      </div>
    </button>
  );
}

export function PropertyCell({
  property,
  isEmpty,
  onPopulate,
  children,
}: {
  property: any;
  isEmpty: boolean;
  onPopulate: () => void;
  children: React.ReactNode;
}) {
  if (isEmpty) {
    return (
      <PropertyPlaceholderButton
        propertyId={property.id}
        propertyType={property.type}
        onClick={onPopulate}
        data-oid="1_4.kgx"
      />
    );
  }

  return <>{children}</>;
}

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  {
    value: number;
    onChange: (v: number) => void;
    step?: number;
    disabled?: boolean;
  }
>(({ value, onChange, step = 1000, disabled = false }, ref) => {
  return (
    <ClearableNumberInput
      value={value}
      onChange={onChange}
      step={step}
      showCurrency={true}
      disabled={disabled}
      ref={ref}
      data-oid="rslxlri"
    />
  );
});

export function LabeledCurrency({
  label,
  value,
  onChange,
  step = 100,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div className="flex items-center gap-2" data-oid="cwxrusp">
      <div className="text-[11px] text-slate-600" data-oid=".smgj9u">
        {label}
      </div>
      <ClearableNumberInput
        value={value}
        onChange={onChange}
        step={step}
        className="w-22"
        showCurrency={true}
        data-oid="y1kg3ff"
      />
    </div>
  );
}

export function LabeledNumber({
  label,
  value,
  onChange,
  step = 0.1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div className="flex items-center gap-2" data-oid="ex1lq57">
      <div className="text-[11px] text-slate-600" data-oid="eetzpqd">
        {label}
      </div>
      <ClearableNumberInput
        value={value}
        onChange={onChange}
        step={step}
        className="w-20"
        data-oid="yighzuw"
      />
    </div>
  );
}

export function DualCell({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4" data-oid="7x1geqp">
      <div className="flex-1" data-oid="ckf6gc-">
        {left}
      </div>
      <div className="flex-shrink-0 min-w-0" data-oid="pp8f7lb">
        {right}
      </div>
    </div>
  );
}

export function ValueText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-sm ${className}`} data-oid="-z_em2v">
      {children}
    </div>
  );
}

export function MonthYearPicker({
  value,
  onChange,
  disabled = false,
}: {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    value?.getMonth() ?? new Date().getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    value?.getFullYear() ?? new Date().getFullYear(),
  );

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Generate years from current year to 10 years in the future
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);

  const handleApply = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    onChange(newDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (disabled) {
    return (
      <div className="text-xs text-slate-500" data-oid="e311_7z">
        N/A
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} data-oid="8zn:btk">
      <PopoverTrigger asChild data-oid="b:qqqdx">
        <Button
          variant="outline"
          className="h-9 w-28 justify-start text-left font-normal px-2 py-1 text-xs text-slate-500 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-oid="ka:49am"
        >
          <Calendar className="h-1 w-1" data-oid="i8vhk.m" />
          {value ? formatDate(value) : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3 z-[50]" data-oid="v1omtcq">
        <div className="space-y-3" data-oid="i9tj-.x">
          {/* Header showing current selection */}
          <div
            className="text-center pb-2 border-b border-slate-200"
            data-oid="elaiii2"
          >
            <div
              className="text-sm font-semibold text-slate-900"
              data-oid="edv5-b5"
            >
              {months[selectedMonth]} {selectedYear}
            </div>
          </div>

          {/* Month and Year Grid Selection */}
          <div className="flex gap-4" data-oid="ik7ej-p">
            {/* Years Column */}
            <div className="flex-1" data-oid="t_8ex_s">
              <div
                className="text-sm text-center font-medium text-slate-700 mb-2"
                data-oid="u:ylpk1"
              >
                Year
              </div>
              <div
                className="grid grid-cols-1 gap-1 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
                data-oid="c8yx_2k"
              >
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-2 rounded-md text-xs transition-colors ${
                      selectedYear === year
                        ? "bg-[#B40101] hover:bg-[#9D0101] font-bold text-white"
                        : "text-[#666666] hover:bg-[#F8F9FA]"
                    }`}
                    data-oid="m026voo"
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Months Column */}
            <div className="flex-1" data-oid="0j4-t1a">
              <div
                className="text-sm text-center font-medium text-slate-700 mb-2"
                data-oid="4wgnh8l"
              >
                Month
              </div>
              <div className="grid grid-cols-2 gap-1" data-oid="9.6r9oo">
                {months.map((month, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMonth(index)}
                    className={`px-3 py-2 rounded-md text-xs transition-colors ${
                      selectedMonth === index
                        ? "bg-[#B40101] hover:bg-[#9D0101] font-bold text-white"
                        : "text-[#666666] hover:bg-[#F8F9FA]"
                    }`}
                    data-oid="k.z8w78"
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex justify-between gap-2 pt-2 border-t border-[#CCCCCC]"
            data-oid="ma01x99"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="border-[#999999] text-[#666666] font-medium hover:bg-[#F8F9FA]"
              data-oid="rx6auks"
            >
              Clear
            </Button>
            <Button 
              size="sm" 
              onClick={handleApply} 
              className="bg-[#B40101] hover:bg-[#9D0101] text-white font-bold"
              data-oid="9xz1-n_"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function CommissionRateSelector({
  value,
  onChange,
  className,
}: {
  value: CommissionRate;
  onChange: (value: CommissionRate) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const getDisplayText = (rate: CommissionRate) => {
    switch (rate) {
      case "0.5":
        return "0.5 Months Rent";
      case "1":
        return "1 Month Rent";
      case "1.5":
        return "1.5 Months Rent";
      case "2":
        return "2 Months Rent";
      case "none":
        return "No Comm Payable";
      case "other":
        return "Others";

      default:
        return "Select Comm Rate";
    }
  };

  // Show placeholder text when no commission rate is selected
  const getButtonText = (rate: CommissionRate) => {
    if (!rate || rate === "" as CommissionRate) {
      return "Select Comm Rate";
    }
    return getDisplayText(rate);
  };

  const options: CommissionRate[] = ["0.5", "1", "1.5", "2", "none", "other", ""] as CommissionRate[];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} data-oid="owvwtb9">
      <PopoverTrigger asChild data-oid="8kk34mo">
        <Button
          variant="outline"
          className={`h-9 w-40 justify-between text-left font-normal px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className || ""}`}
          data-oid="qgxtfuy"
        >
          <span
            className={`truncate ${!value || value === "" as CommissionRate ? "text-slate-500" : "text-black"}`}
            data-oid="nknc5vx"
          >
            {getButtonText(value)}
          </span>
          <ChevronDownIcon
            className="h-3 w-3 ml-1 flex-shrink-0"
            data-oid="0xjpd3c"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2 z-[10]" data-oid="2h73z6g">
        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[#CCCCCC] scrollbar-track-transparent" data-oid="x1:boam">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 rounded-md text-xs transition-colors text-left ${
                value === option
                  ? "bg-[#B40101] hover:bg-[#9D0101] font-bold text-white"
                  : "text-[#666666] hover:bg-[#F8F9FA]"
              }`}
              data-oid="ehug2vs"
            >
              {getDisplayText(option)}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function SalesCommissionRateSelector({
  value,
  onChange,
  className,
}: {
  value: SalesCommissionRate;
  onChange: (value: SalesCommissionRate) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const getDisplayText = (rate: SalesCommissionRate) => {
    switch (rate) {
      case "0.50":
        return "0.50%";
      case "0.75":
        return "0.75%";
      case "1.00":
        return "1.00%";
      case "1.25":
        return "1.25%";
      case "1.50":
        return "1.50%";
      case "1.75":
        return "1.75%";
      case "2.00":
        return "2.00%";
      case "2.50":
        return "2.50%";
      case "3.00":
        return "3.00%";
      case "3.50":
        return "3.50%";
      case "none":
        return "No Comm Payable";
      case "other":
        return "Others";

      default:
        return "Select Comm Rate";
    }
  };

  // Show placeholder text when no commission rate is selected
  const getButtonText = (rate: SalesCommissionRate) => {
    if (!rate || rate === "" as SalesCommissionRate) {
      return "Select Comm Rate";
    }
    return getDisplayText(rate);
  };

  const options: SalesCommissionRate[] = ["0.50", "0.75", "1.00", "1.25", "1.50", "1.75", "2.00", "2.50", "3.00", "3.50", "none", "other", ""] as SalesCommissionRate[];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`h-9 w-40 justify-between text-left font-normal px-2 py-1 text-xs border border-[#CCCCCC] rounded focus:outline-none focus:ring-2 focus:ring-[#999999] focus:border-[#999999] ${className || ""}`}
        >
          <span
            className={`truncate ${!value || value === "" as SalesCommissionRate ? "text-[#999999]" : "text-[#000000]"}`}
          >
            {getButtonText(value)}
          </span>
          <ChevronDownIcon
            className="h-3 w-3 ml-1 flex-shrink-0"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2 z-[10]">
        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[#CCCCCC] scrollbar-track-transparent">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 rounded-md text-xs transition-colors text-left ${
                value === option
                  ? "bg-[#B40101] hover:bg-[#9D0101] font-bold text-white"
                  : "text-[#666666] hover:bg-[#F8F9FA]"
              }`}
            >
              {getDisplayText(option)}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function InfoIcon({ className }: { className?: string }) {
  return (
    <Info
      className={`h-4 w-4 text-[#999999] ${className || ""}`}
      data-oid="x.dw4-x"
    />
  );
}

export function TooltipLabel({
  label,
  tooltip,
  className = "",
}: {
  label: string;
  tooltip: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`} data-oid="m0eo4g-">
      <span data-oid="k7ewjna">{label}</span>
      <Tooltip data-oid="l-xhyzg">
        <TooltipTrigger asChild data-oid="j189w6a">
          <div 
            className="cursor-default hover:text-[#666666] transition-colors"
            data-oid="nmr1vh4"
          >
            <Info className="h-3 w-3 text-[#999999]" />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          className="z-[100] bg-[#F8F9FA] text-[#000000] border border-[#CCCCCC] shadow-md px-3 py-2 rounded-md max-w-54 pointer-events-none [&_[data-radix-tooltip-arrow]]:hidden"
          side="right"
          sideOffset={5}
          align="start"
          data-oid="lk9o2zu"
        >
          <p className="text-xs leading-5 text-[#000000]" data-oid="c2w8xd_">
            {tooltip}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
