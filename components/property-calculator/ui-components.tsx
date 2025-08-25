"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className={`relative ${className}`} data-oid="x2w-o36">
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
        data-oid="wd9c_80"
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
        data-oid="xsn1-8g"
      >
        <X className="h-3.5 w-3.5" data-oid="xgv:e3v" />
      </button>
    </div>
  );
}

export function PropertyTypeBadge({ type }: { type: PropertyType }) {
  return (
    <div
      className="inline-flex items-center rounded-md px-2 py-1"
      data-oid="j1rf3ya"
    >
      <div
        className={`w-2 h-2 rounded-full mr-2 ${type === "BUC" ? "bg-orange-500" : "bg-emerald-600"}`}
        data-oid="02ab:_y"
      />
      <span
        className={`text-xs font-medium ${type === "BUC" ? "text-orange-700" : "text-emerald-700"}`}
        data-oid="iuxtfkk"
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
      data-oid="c1oa4mt"
    >
      <div className="text-sm font-medium" data-oid="c.oq5sg">
        Select / Create New Entry
      </div>
      <div className="text-xs text-slate-500" data-oid="g07hlr-">
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
        data-oid=":uu4vyo"
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
      data-oid="_t5kp-1"
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
    <div className="flex items-center gap-2" data-oid="fiil34w">
      <div className="text-[11px] text-slate-600" data-oid="84pp_0s">
        {label}
      </div>
      <ClearableNumberInput
        value={value}
        onChange={onChange}
        step={step}
        className="w-24"
        showCurrency={true}
        data-oid="-9.uvg."
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
    <div className="flex items-center gap-2" data-oid="9vnbrb7">
      <div className="text-[11px] text-slate-600" data-oid="69kh717">
        {label}
      </div>
      <ClearableNumberInput
        value={value}
        onChange={onChange}
        step={step}
        className="w-24"
        data-oid="9ef0v2e"
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
    <div className="flex items-center justify-between gap-4" data-oid=".7.2r87">
      <div className="flex-1" data-oid="bwizg-i">
        {left}
      </div>
      <div className="flex-shrink-0" data-oid="fe31jur">
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
    <div className={`text-sm ${className}`} data-oid="7ed8vgb">
      {children}
    </div>
  );
}
