import React from "react";
import type { Property, Mode, CommissionRate } from "./types";
import { isFieldNotApplicable } from "./utils";
import { CurrencyInput } from "./ui-components";
import { CommissionRateSelector } from "./ui-components";

export function SectionRow({
  title,
  colSpan,
  icon,
}: {
  title: string;
  colSpan: number;
  icon?: string;
}) {
  return (
    <tr className="bg-slate-50" data-oid="v3xvgj_">
      <td
        colSpan={colSpan}
        className="px-4 py-3 border-y border-slate-200 text-slate-800 font-semibold"
        data-oid="qxwoq2u"
      >
        <div className="flex items-center gap-2" data-oid=".z5h3mv">
          {icon && (
            <i
              className={`bi bi-${icon} text-slate-600 text-lg`}
              data-oid="--w-qt_"
            ></i>
          )}
          <span data-oid="6wsp5e4">{title}</span>
        </div>
      </td>
    </tr>
  );
}

export function DataRow({
  label,
  properties,
  render,
}: {
  label: React.ReactNode;
  properties: Property[];
  render: (p: Property) => React.ReactNode;
}) {
  return (
    <tr className="hover:bg-slate-100" data-oid="_s:lo4i">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="jei:uma"
      >
        {label}
      </td>
      {properties.map((p, i) => (
        <td
          key={p.id}
          className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
          data-oid="mn0:zbi"
        >
          {render(p)}
        </td>
      ))}
    </tr>
  );
}

export function MaybeNADataRow({
  label,
  properties,
  fieldKey,
  renderInput,
  mode,
}: {
  label: React.ReactNode;
  properties: Property[];
  fieldKey: keyof Property;
  renderInput: (p: Property) => React.ReactNode;
  mode: Mode;
}) {
  return (
    <tr className="hover:bg-slate-100" data-oid="nqv9mum">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="07epqgz"
      >
        {label}
      </td>
      {properties.map((p, i) => {
        const isNA = isFieldNotApplicable(p, fieldKey, mode);
        return (
          <td
            key={p.id}
            className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
            data-oid="hz_yc7e"
          >
            {isNA ? (
              <div className="text-xs text-slate-500" data-oid="fgioo-u">
                N/A
              </div>
            ) : (
              renderInput(p)
            )}
          </td>
        );
      })}
    </tr>
  );
}

export function ConditionalBUCDataRow({
  label,
  properties,
  fieldKey,
  renderInput,
  mode,
  balanceMonthsMap,
}: {
  label: React.ReactNode;
  properties: Property[];
  fieldKey: keyof Property;
  renderInput: (p: Property) => React.ReactNode;
  mode: Mode;
  balanceMonthsMap: Map<string, number>;
}) {
  return (
    <tr className="hover:bg-slate-100" data-oid="ifl4wdv">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="vb9i5vx"
      >
        {label}
      </td>
      {properties.map((p, i) => {
        // For BUC properties, check if balance months after TOP > 0
        if (p.type === "BUC") {
          const balanceMonths = balanceMonthsMap.get(p.id) || 0;
          if (balanceMonths > 0) {
            // Enable the field for BUC when balance months > 0
            return (
              <td
                key={p.id}
                className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
                data-oid="1ku23_8"
              >
                {renderInput(p)}
              </td>
            );
          } else {
            // Show N/A when balance months = 0
            return (
              <td
                key={p.id}
                className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
                data-oid="a7-w0o-"
              >
                <div className="text-xs text-slate-500" data-oid="c40svp.">
                  N/A
                </div>
              </td>
            );
          }
        }

        // For non-BUC properties, use the standard logic
        const isNA = isFieldNotApplicable(p, fieldKey, mode);
        return (
          <td
            key={p.id}
            className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
            data-oid="e2tlq0g"
          >
            {isNA ? (
              <div className="text-xs text-slate-500" data-oid="1tnp_t1">
                N/A
              </div>
            ) : (
              renderInput(p)
            )}
          </td>
        );
      })}
    </tr>
  );
}

export function IconRow({
  label,
  icon: Icon,
  properties,
  renderValue,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  properties: Property[];
  renderValue: (p: Property) => string;
}) {
  return (
    <tr className="hover:bg-slate-100" data-oid="sxvv-et">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="z0.4b8-"
      >
        <div className="flex items-center gap-2" data-oid="itx8yac">
          <Icon className="h-4 w-4 text-slate-600" data-oid="q.do1so" />
          <span data-oid="sagl26a">{label}</span>
        </div>
      </td>
      {properties.map((p, i) => (
        <td
          key={p.id}
          className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
          data-oid="ncr3nhq"
        >
          <div className="text-slate-900 font-semibold" data-oid=":28_piw">
            {renderValue(p)}
          </div>
        </td>
      ))}
    </tr>
  );
}

export function CommissionRateDataRow({
  label,
  properties,
  mode,
  balanceMonthsMap,
  onCommissionRateChange,
  onAgentCommissionChange,
}: {
  label: React.ReactNode;
  properties: Property[];
  mode: Mode;
  balanceMonthsMap: Map<string, number>;
  onCommissionRateChange: (propertyId: string, rate: CommissionRate) => void;
  onAgentCommissionChange: (propertyId: string, value: number) => void;
}) {
  const inputRefs = React.useRef<{ [key: string]: HTMLInputElement | null }>(
    {},
  );

  const handleCommissionRateChange = (
    propertyId: string,
    rate: CommissionRate,
  ) => {
    onCommissionRateChange(propertyId, rate);

    // Auto-focus the input field when "Other" is selected
    if (rate === "other") {
      setTimeout(() => {
        const inputRef = inputRefs.current[propertyId];
        if (inputRef) {
          inputRef.focus();
        }
      }, 0);
    }
  };
  return (
    <tr className="hover:bg-slate-100" data-oid=":7oj0y6">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="6ki_s0g"
      >
        {label}
      </td>
      {properties.map((p, i) => {
        // For BUC properties, check if balance months after TOP > 0
        if (p.type === "BUC") {
          const balanceMonths = balanceMonthsMap.get(p.id) || 0;
          if (balanceMonths > 0) {
            // Enable the field for BUC when balance months > 0
            return (
              <td
                key={p.id}
                className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
                data-oid="3:6y6wl"
              >
                <div className="flex gap-2" data-oid="2xvam09">
                  <div className="flex-1" data-oid=":.flldb">
                    <CurrencyInput
                      value={p.agentCommission}
                      onChange={(v) => onAgentCommissionChange(p.id, v)}
                      disabled={p.commissionRate !== "other"}
                      data-oid="commission-input"
                      ref={(el) => {
                        inputRefs.current[p.id] = el;
                      }}
                    />
                  </div>
                  <CommissionRateSelector
                    value={p.commissionRate}
                    onChange={(rate) => handleCommissionRateChange(p.id, rate)}
                    data-oid="m4:a4:_"
                  />
                </div>
              </td>
            );
          } else {
            // Show N/A when balance months = 0
            return (
              <td
                key={p.id}
                className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
                data-oid="pkvxqjk"
              >
                <div className="text-xs text-slate-500" data-oid="og35z_3">
                  N/A
                </div>
              </td>
            );
          }
        }

        // For non-BUC properties, use the standard logic
        const isNA = isFieldNotApplicable(p, "agentCommission", mode);
        return (
          <td
            key={p.id}
            className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
            data-oid="b0h:owm"
          >
            {isNA ? (
              <div className="text-xs text-slate-500" data-oid="37.yn:s">
                N/A
              </div>
            ) : (
              <div className="flex gap-2" data-oid="ktnvwxl">
                <div className="flex-1" data-oid="9v5xsga">
                  <CurrencyInput
                    value={p.agentCommission}
                    onChange={(v) => onAgentCommissionChange(p.id, v)}
                    disabled={p.commissionRate !== "other"}
                    data-oid="aqhupzb"
                    ref={(el) => {
                      inputRefs.current[p.id] = el;
                    }}
                  />
                </div>
                <CommissionRateSelector
                  value={p.commissionRate}
                  onChange={(rate) => handleCommissionRateChange(p.id, rate)}
                  data-oid="2d--:2a"
                />
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
}
