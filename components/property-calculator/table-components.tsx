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
    <tr className="bg-slate-50" data-oid="oda37jp">
      <td
        colSpan={colSpan}
        className="px-4 py-3 border-y border-slate-200 text-slate-800 font-semibold"
        data-oid="7bjnz0o"
      >
        <div className="flex items-center gap-2" data-oid="tvf4tew">
          {icon && (
            <i
              className={`bi bi-${icon} text-slate-600 text-lg`}
              data-oid="2mrvur9"
            ></i>
          )}
          <span data-oid="2i118aa">{title}</span>
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
    <tr className="hover:bg-slate-100" data-oid="18m-8d3">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="1zhw:aq"
      >
        {label}
      </td>
      {properties.map((p, i) => (
        <td
          key={p.id}
          className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
          data-oid="l2zptmi"
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
    <tr className="hover:bg-slate-100" data-oid="33b.1:w">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="v2sd-yi"
      >
        {label}
      </td>
      {properties.map((p, i) => {
        const isNA = isFieldNotApplicable(p, fieldKey, mode);
        return (
          <td
            key={p.id}
            className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
            data-oid="qvrqwav"
          >
            {isNA ? (
              <div className="text-xs text-slate-500" data-oid="txzji5n">
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
    <tr className="hover:bg-slate-100" data-oid="xgifmo4">
      <td
        className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
        data-oid="zzxggi0"
      >
        <div className="flex items-center gap-2" data-oid="_civ0jf">
          <Icon className="h-4 w-4 text-slate-600" data-oid="i::o0vs" />
          <span data-oid="xmwwzp:">{label}</span>
        </div>
      </td>
      {properties.map((p, i) => (
        <td
          key={p.id}
          className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
          data-oid="9tmlk93"
        >
          <div className="text-slate-900 font-semibold" data-oid=".lm4a8_">
            {renderValue(p)}
          </div>
        </td>
      ))}
    </tr>
  );
}
