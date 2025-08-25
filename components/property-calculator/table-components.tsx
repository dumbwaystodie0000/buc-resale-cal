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
    <tr className="bg-slate-50" data-oid="bpxnah1">
      <td
        colSpan={colSpan}
        className="px-4 py-3 border-y border-slate-200 text-slate-800 font-semibold"
        data-oid="gj7rwjj"
      >
        <div className="flex items-center gap-2" data-oid="cuj92ji">
          {icon && (
            <i
              className={`bi bi-${icon} text-slate-600 text-lg`}
              data-oid="ph24p.8"
            ></i>
          )}
          <span data-oid="jk5aavd">{title}</span>
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
    <tr className="hover:bg-slate-100" data-oid="l9s23zy">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="m-bmn2."
      >
        {label}
      </td>
      {properties.map((p, i) => (
        <td
          key={p.id}
          className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
          data-oid="snialbk"
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
    <tr className="hover:bg-slate-100" data-oid="5gts_hh">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="qjncwaw"
      >
        {label}
      </td>
      {properties.map((p, i) => {
        const isNA = isFieldNotApplicable(p, fieldKey, mode);
        return (
          <td
            key={p.id}
            className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
            data-oid=":_zh5-5"
          >
            {isNA ? (
              <div className="text-xs text-slate-500" data-oid="ceq:hbd">
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
    <tr className="hover:bg-slate-100" data-oid="lfnzkdb">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="7.bsm:i"
      >
        <div className="flex items-center gap-2" data-oid="vej13v2">
          <Icon className="h-4 w-4 text-slate-600" data-oid="8th1ji1" />
          <span data-oid="ywcrpb2">{label}</span>
        </div>
      </td>
      {properties.map((p, i) => (
        <td
          key={p.id}
          className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
          data-oid="30j-1m8"
        >
          <div className="text-slate-900 font-semibold" data-oid="7445btl">
            {renderValue(p)}
          </div>
        </td>
      ))}
    </tr>
  );
}
