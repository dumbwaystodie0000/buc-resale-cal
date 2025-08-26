"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VacancyMonthSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VacancyMonthSelector({
  value,
  onChange,
}: VacancyMonthSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} data-oid="h806k-6">
      <SelectTrigger
        className="h-9 w-24 border border-slate-200 rounded text-xs"
        data-oid="tcstfxb"
      >
        <SelectValue data-oid=".2ipoj1" />
      </SelectTrigger>
      <SelectContent
        className="max-h-64 text-xs text-slate-600"
        data-oid="sk.a3wa"
      >
        {Array.from({ length: 25 }, (_, i) => (
          <SelectItem
            key={i}
            value={String(i)}
            className="text-xs text-slate-500"
            data-oid="22.jrku"
          >
            {i} {i === 1 ? "month" : "months"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
