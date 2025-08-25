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
        onWheel={handleWheel}
        className="h-9 text-left pr-8 px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        data-oid="4udbg:w"
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
        data-oid="u1-sry3"
      >
        <X className="h-3.5 w-3.5" data-oid="t0erz_a" />
      </button>
    </div>
  );
}

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
        className={`text-xs font-bold ${type === "BUC" ? "text-orange-700" : "text-emerald-700"}`}
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
      className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-colors flex flex-col items-center justify-center gap-2 text-slate-600"
      data-oid="41q9x8y"
    >
      <div className="text-sm font-medium" data-oid="y48h4ra">
        Select / Create New Entry
      </div>
      <div className="text-xs text-slate-500" data-oid="7qxuk6o">
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
      data-oid="rslxlri"
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
    <div className="flex items-center gap-2" data-oid="cwxrusp">
      <div className="text-[11px] text-slate-600" data-oid=".smgj9u">
        {label}
      </div>
      <ClearableNumberInput
        value={value}
        onChange={onChange}
        step={step}
        className="w-24"
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
        className="w-24"
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
          className="h-9 w-28 justify-start text-left font-normal px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-oid="ka:49am"
        >
          <Calendar className="mr-1 h-2 w-2" data-oid="i8vhk.m" />
          {value ? formatDate(value) : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3 z-[10]" data-oid="v1omtcq">
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
                        ? "bg-slate-200 font-semibold text-slate-900"
                        : "text-slate-600 hover:bg-slate-100"
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
                        ? "bg-slate-200 font-semibold text-slate-900"
                        : "text-slate-600 hover:bg-slate-100"
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
            className="flex justify-between gap-2 pt-2 border-t border-slate-200"
            data-oid="ma01x99"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              data-oid="rx6auks"
            >
              Clear
            </Button>
            <Button size="sm" onClick={handleApply} data-oid="9xz1-n_">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
