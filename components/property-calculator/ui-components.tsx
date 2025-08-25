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
    <div className={`relative ${className}`} data-oid="a7r04:p">
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
        data-oid="0_0yg8g"
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
        data-oid="4.0ypsd"
      >
        <X className="h-3.5 w-3.5" data-oid="5q.ij1n" />
      </button>
    </div>
  );
}

export function PropertyTypeBadge({ type }: { type: PropertyType }) {
  return (
    <div
      className="inline-flex items-center rounded-md px-2 py-1"
      data-oid="r0xlju5"
    >
      <div
        className={`w-2 h-2 rounded-full mr-2 ${type === "BUC" ? "bg-orange-500" : "bg-emerald-600"}`}
        data-oid="m4p5d:q"
      />

      <span
        className={`text-xs font-medium ${type === "BUC" ? "text-orange-700" : "text-emerald-700"}`}
        data-oid="zv:.b7g"
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
      data-oid="jzg5jhv"
    >
      <div className="text-sm font-medium" data-oid="uu0inz6">
        Select / Create New Entry
      </div>
      <div className="text-xs text-slate-500" data-oid="voff5bv">
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
        data-oid="p:jwzwp"
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
      data-oid="43lp91k"
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
    <div className="flex items-center gap-2" data-oid="3cs1kw1">
      <div className="text-[11px] text-slate-600" data-oid="33g6orh">
        {label}
      </div>
      <ClearableNumberInput
        value={value}
        onChange={onChange}
        step={step}
        className="w-24"
        showCurrency={true}
        data-oid="yj7-6ca"
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
    <div className="flex items-center gap-2" data-oid="-ikzvcs">
      <div className="text-[11px] text-slate-600" data-oid="fj.tmfe">
        {label}
      </div>
      <ClearableNumberInput
        value={value}
        onChange={onChange}
        step={step}
        className="w-24"
        data-oid="f5u9edf"
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
    <div className="flex items-center justify-between gap-4" data-oid="td5gqql">
      <div className="flex-1" data-oid="b5zanjv">
        {left}
      </div>
      <div className="flex-shrink-0" data-oid="jzmq08l">
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
    <div className={`text-sm ${className}`} data-oid="j4k24fq">
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
      <div className="text-xs text-slate-500" data-oid="d.70z-k">
        N/A
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} data-oid="qi_7pbz">
      <PopoverTrigger asChild data-oid="j884m8i">
        <Button
          variant="outline"
          className="h-9 w-32 justify-start text-left font-normal"
          data-oid="3:9qi_7"
        >
          <Calendar className="mr-2 h-4 w-4" data-oid="44g.cps" />
          {value ? formatDate(value) : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" data-oid=":ynqnl4">
        <div className="space-y-4" data-oid="hbw4:n1">
          <div className="space-y-2" data-oid="7eradd1">
            <label className="text-sm font-medium" data-oid="98k9g6v">
              Month
            </label>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(v) => setSelectedMonth(parseInt(v))}
              data-oid="iaoaxwi"
            >
              <SelectTrigger data-oid="e0b.hq.">
                <SelectValue data-oid="mdxjaqg" />
              </SelectTrigger>
              <SelectContent data-oid="v_ct8vb">
                {months.map((month, index) => (
                  <SelectItem
                    key={index}
                    value={index.toString()}
                    data-oid="nwcj0:e"
                  >
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2" data-oid="51u-9rk">
            <label className="text-sm font-medium" data-oid="k9b8e8g">
              Year
            </label>
            <Select
              value={selectedYear.toString()}
              onValueChange={(v) => setSelectedYear(parseInt(v))}
              data-oid="7qfp8oz"
            >
              <SelectTrigger data-oid=".k42bwl">
                <SelectValue data-oid="pk7nelo" />
              </SelectTrigger>
              <SelectContent data-oid="hqoj6_u">
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    data-oid="jcfpx99"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between gap-2" data-oid="m8tmcrc">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              data-oid="3mjb6gw"
            >
              Clear
            </Button>
            <Button size="sm" onClick={handleApply} data-oid="pgjl:9p">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
