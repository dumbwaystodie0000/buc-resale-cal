import type React from "react";
import type { Property, Mode } from "./types";
import { isFieldNotApplicable } from "./utils";

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
    <tr className="hover:bg-slate-100" data-oid="nqv9mum">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="07epqgz"
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
                data-oid="hz_yc7e"
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
                data-oid="hz_yc7e"
              >
                <div className="text-xs text-slate-500" data-oid="fgioo-u">
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
