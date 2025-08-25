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
    <tr className="bg-slate-50" data-oid="ykt1.m:">
      <td
        colSpan={colSpan}
        className="px-4 py-3 border-y border-slate-200 text-slate-800 font-semibold"
        data-oid="_wme1v3"
      >
        <div className="flex items-center gap-2" data-oid="0:pevg2">
          {icon && (
            <i
              className={`bi bi-${icon} text-slate-600 text-lg`}
              data-oid="9hri8tc"
            ></i>
          )}
          <span data-oid="x7mo2_-">{title}</span>
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
    <tr className="hover:bg-slate-100" data-oid="p4h3-5q">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="8ja0hq-"
      >
        {label}
      </td>
      {properties.map((p, i) => (
        <td
          key={p.id}
          className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
          data-oid="1y1qu_9"
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
    <tr className="hover:bg-slate-100" data-oid="r2h99kj">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="xmswcfe"
      >
        {label}
      </td>
      {properties.map((p, i) => {
        const isNA = isFieldNotApplicable(p, fieldKey, mode);
        return (
          <td
            key={p.id}
            className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
            data-oid="aefl1xp"
          >
            {isNA ? (
              <div className="text-xs text-slate-500" data-oid=":dn.r5v">
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
    <tr className="hover:bg-slate-100" data-oid="c8n0jok">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="09v81pu"
      >
        <div className="flex items-center gap-2" data-oid="qe1kof.">
          <Icon className="h-4 w-4 text-slate-600" data-oid="1vaa86l" />
          <span data-oid="w9qz74p">{label}</span>
        </div>
      </td>
      {properties.map((p, i) => (
        <td
          key={p.id}
          className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
          data-oid="vye71ql"
        >
          <div className="text-slate-900 font-semibold" data-oid="lz21jo1">
            {renderValue(p)}
          </div>
        </td>
      ))}
    </tr>
  );
}
