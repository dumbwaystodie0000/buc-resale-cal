"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
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
import type { PropertyType } from "./types";
import { fmtCurrency } from "./utils";

export function ClearableNumberInput({
  value,
  onChange,
  step = 1000,
  placeholder,
  className = "",
  showCurrency = false,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  placeholder?: string;
  className?: string;
  showCurrency?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
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
    <div className={`relative ${className}`} data-oid="2d1.9j.">
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
        onWheel={handleWheel}
        className="h-9 text-left pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        data-oid="hmqulcv"
      />

      <button
        type="button"
        aria-label="Clear input"
        title="Clear"
        onClick={() => {
          onChange(0);
          setInputValue("0");
          setIsEditing(true); // Keep in editing mode to show the cleared "0"
          setTimeout(() => {
            if (ref.current) {
              ref.current.focus();
              ref.current.select();
            }
          }, 0);
        }}
        className="absolute right-2 top-1.5 rounded p-0.5 text-slate-400 hover:text-slate-600"
        data-oid="r1d86sg"
      >
        <X className="h-3.5 w-3.5" data-oid=".epuyn-" />
      </button>
    </div>
  );
}

export function PropertyTypeBadge({ type }: { type: PropertyType }) {
  return (
    <div
      className="inline-flex items-center rounded-md px-2 py-1"
      data-oid="ux2:ro9"
    >
      <div
        className={`w-2 h-2 rounded-full mr-2 ${type === "BUC" ? "bg-orange-500" : "bg-emerald-600"}`}
        data-oid="67xypk7"
      />

      <span
        className={`text-xs font-medium ${type === "BUC" ? "text-orange-700" : "text-emerald-700"}`}
        data-oid="e0qdk_v"
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
      className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-colors flex flex-col items-center justify-center gap-2 text-slate-600"
      data-oid="o:9o:fp"
    >
      <div className="text-sm font-medium" data-oid="7_ouhyb">
        Select / Create New Entry
      </div>
      <div className="text-xs text-slate-500" data-oid="nx:n19c">
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
        data-oid="t9x6k__"
      />
    );
  }

  return <>{children}</>;
}

export function CurrencyInput({
  value,
  onChange,
  step = 1000,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <ClearableNumberInput
      value={value}
      onChange={onChange}
      step={step}
      showCurrency={true}
      data-oid="gzbrk9x"
    />
  );
}

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
    <div className="flex items-center gap-2" data-oid="6_4i-dr">
      <div className="text-[11px] text-slate-600" data-oid="jfewakj">
        {label}
      </div>
      <ClearableNumberInput
        value={value}
        onChange={onChange}
        step={step}
        className="w-24"
        showCurrency={true}
        data-oid=".ns8-:o"
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
    <div className="flex items-center gap-2" data-oid="v63ocex">
      <div className="text-[11px] text-slate-600" data-oid="1..u_05">
        {label}
      </div>
      <ClearableNumberInput
        value={value}
        onChange={onChange}
        step={step}
        className="w-24"
        data-oid="xe5p7g."
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
    <div className="flex items-center justify-between gap-4" data-oid=":n.gsps">
      <div className="flex-1" data-oid="gs6tefd">
        {left}
      </div>
      <div className="flex-shrink-0" data-oid="4nl5c4q">
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
    <div className={`text-sm ${className}`} data-oid="vzjigxp">
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
      <div className="text-xs text-slate-500" data-oid="au5z0dx">
        N/A
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} data-oid="ipnj6fo">
      <PopoverTrigger asChild data-oid="8mjpjdf">
        <Button
          variant="outline"
          className="h-9 w-32 justify-start text-left font-normal"
          data-oid="nivvbmn"
        >
          <Calendar className="mr-2 h-4 w-4" data-oid="cp-m.0q" />
          {value ? formatDate(value) : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" data-oid="n8ccbvu">
        <div className="space-y-4" data-oid="fog:7fx">
          <div className="space-y-2" data-oid="g4dti2v">
            <label className="text-sm font-medium" data-oid="w-sen06">
              Month
            </label>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(v) => setSelectedMonth(parseInt(v))}
              data-oid="4k1w2q5"
            >
              <SelectTrigger data-oid="wr2vff:">
                <SelectValue data-oid="2ybutqg" />
              </SelectTrigger>
              <SelectContent data-oid="mw:hbfe">
                {months.map((month, index) => (
                  <SelectItem
                    key={index}
                    value={index.toString()}
                    data-oid="xs..wlk"
                  >
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2" data-oid="d1fnk.9">
            <label className="text-sm font-medium" data-oid="pmhfdfl">
              Year
            </label>
            <Select
              value={selectedYear.toString()}
              onValueChange={(v) => setSelectedYear(parseInt(v))}
              data-oid="aqsaf:a"
            >
              <SelectTrigger data-oid="0nvjle_">
                <SelectValue data-oid="skcjue1" />
              </SelectTrigger>
              <SelectContent data-oid="r:u3q6:">
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    data-oid="pn6_et4"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between gap-2" data-oid="00pp98p">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              data-oid="nc7_08y"
            >
              Clear
            </Button>
            <Button size="sm" onClick={handleApply} data-oid="wpr:700">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
