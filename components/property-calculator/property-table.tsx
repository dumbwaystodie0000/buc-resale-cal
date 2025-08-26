"use client";

import { useState, useEffect } from "react";
import { X, Edit2, Save, Folder } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  Property,
  Mode,
  SavedProperty,
  PropertyType,
  CommissionRate,
} from "./types";
import { TAX_BRACKETS, defaultPropertyBase, mockFolders } from "./constants";
import { calculateValues } from "./calculations";
import { fmtCurrency, fmtRate, calculateBalanceMonthAftTOP } from "./utils";
import {
  PropertyTypeBadge,
  CurrencyInput,
  LabeledCurrency,
  LabeledNumber,
  DualCell,
  ValueText,
  ClearableNumberInput,
  MonthYearPicker,
  CommissionRateSelector,
} from "./ui-components";
import {
  SectionRow,
  DataRow,
  MaybeNADataRow,
  ConditionalBUCDataRow,
  CommissionRateDataRow,
} from "./table-components";
import PropertySummary from "./property-summary";
import SelectPropertyButton from "./select-property-button";

interface PropertyTableProps {
  properties: Property[];
  mode: Mode;
  taxBracket: number;
  monthlyRental: number;
  selectedTaxId: string | undefined;
  setSelectedTaxId: (id: string) => void;
  setTaxBracket: (rate: number) => void;
  setMonthlyRental: (value: number) => void;
  removeProperty: (id: string) => void;
  updateProperty: (id: string, field: keyof Property, value: any) => void;
  onSelectSavedProperty: (property: SavedProperty) => void;
  onCreateNewProperty: (
    name: string,
    type: PropertyType,
    folder?: string,
  ) => void;
  onCreateFolder: (name: string) => void;
  onSaveExistingProperty: (property: Property, folder?: string) => void;
}

export default function PropertyTable({
  properties,
  mode,
  taxBracket,
  monthlyRental,
  selectedTaxId,
  setSelectedTaxId,
  setTaxBracket,
  setMonthlyRental,
  removeProperty,
  updateProperty,
  onSelectSavedProperty,
  onCreateNewProperty,
  onCreateFolder,
  onSaveExistingProperty,
}: PropertyTableProps) {
  // Global commission rate state
  const [globalCommissionRate, setGlobalCommissionRate] =
    useState<CommissionRate>(""); // Default to empty string to show "Select Comm Rate"

  // Initialize global commission rate from first property (only if it has a meaningful value)
  useEffect(() => {
    if (properties.length > 0 && !globalCommissionRate) {
      const firstProperty = properties[0];
      if (
        firstProperty.commissionRate &&
        firstProperty.commissionRate !== "" &&
        firstProperty.commissionRate !== undefined
      ) {
        setGlobalCommissionRate(firstProperty.commissionRate);
      }
    }
  }, [properties, globalCommissionRate]);

  // State for inline editing of property names
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(
    null,
  );
  const [editingName, setEditingName] = useState("");

  // State for create folder dialog
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] =
    useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [propertyToSave, setPropertyToSave] = useState<Property | null>(null);

  // Selected tax option (for rendering the trigger with left/right text)
  const selectedTax = selectedTaxId
    ? TAX_BRACKETS.find((o) => o.id === selectedTaxId)
    : undefined;

  // Use the actual properties array - when showThirdColumn is true, properties should already have 3 items
  const displayProperties = properties;

  // Calculate balance months after TOP for each property (for BUC conditional field enabling)
  const [balanceMonthsMap, setBalanceMonthsMap] = useState<Map<string, number>>(
    new Map(),
  );

  useEffect(() => {
    const newBalanceMonthsMap = new Map<string, number>();
    displayProperties.forEach((p) => {
      if (p.type === "BUC") {
        const balanceMonths = calculateBalanceMonthAftTOP(
          p.estTOP,
          displayProperties[0]?.holdingPeriod || 4,
        );
        newBalanceMonthsMap.set(p.id, balanceMonths);
      }
    });
    setBalanceMonthsMap(newBalanceMonthsMap);
  }, [displayProperties]);

  // State for holding period input
  const [holdingPeriodInput, setHoldingPeriodInput] = useState<string>(
    String(displayProperties[0]?.holdingPeriod || 4),
  );
  const [isHoldingPeriodEditing, setIsHoldingPeriodEditing] = useState(false);

  // Sync holding period input when properties change (only when not editing)
  useEffect(() => {
    if (!isHoldingPeriodEditing && properties.length > 0) {
      const newHoldingPeriod = properties[0]?.holdingPeriod || 4;
      setHoldingPeriodInput(String(newHoldingPeriod));
    }
  }, [properties, isHoldingPeriodEditing]);

  // Handle starting to edit a property name
  const handleStartEdit = (property: Property) => {
    setEditingPropertyId(property.id);
    setEditingName(property.name);
  };

  // Handle saving the edited property name
  const handleSaveEdit = (propertyId: string) => {
    if (editingName.trim()) {
      updateProperty(propertyId, "name", editingName.trim());
    }
    setEditingPropertyId(null);
    setEditingName("");
  };

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setEditingPropertyId(null);
    setEditingName("");
  };

  // Check if a property has meaningful data (not just default values)
  const hasPropertyData = (property: Property) => {
    return (
      property.purchasePrice > 0 ||
      property.loanTenure !== 30 ||
      property.interestRate !== 2.0 ||
      property.ltv !== 75 ||
      property.annualGrowth > 0 ||
      property.monthlyRental > 0 ||
      property.monthlyMaintenance > 0 ||
      property.propertyTax > 0 ||
      property.minorRenovation > 0 ||
      property.furnitureFittings > 0 ||
      (property.name &&
        property.name !==
          `Property #${properties.findIndex((p) => p.id === property.id) + 1}`)
    );
  };

  // Handle opening create folder dialog
  const handleOpenCreateFolderDialog = (property: Property) => {
    setPropertyToSave(property);
    setNewFolderName("");
    setIsCreateFolderDialogOpen(true);
  };

  // Handle creating new folder and saving property
  const handleCreateFolderAndSave = () => {
    if (newFolderName.trim() && propertyToSave) {
      // First create the folder
      onCreateFolder(newFolderName.trim());
      // Then save the property to the new folder
      onSaveExistingProperty(propertyToSave, newFolderName.trim());
      // Close dialog and reset state
      setIsCreateFolderDialogOpen(false);
      setNewFolderName("");
      setPropertyToSave(null);
    }
  };

  // Handle canceling create folder dialog
  const handleCancelCreateFolder = () => {
    setIsCreateFolderDialogOpen(false);
    setNewFolderName("");
    setPropertyToSave(null);
  };

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white"
      data-oid="kp:lj4k"
    >
      <table className="w-full border-collapse" data-oid=".uyzrs8">
        <colgroup data-oid="fxzhj18">
          <col className="w-[360px]" data-oid="7ck0wf9" />
          {displayProperties.map((p) => (
            <col key={p.id} className="w-[300px]" data-oid="02zo48x" />
          ))}
        </colgroup>

        <thead className="text-sm" data-oid="_xrqq5c">
          <tr
            className="sticky top-0 z-20 bg-white border-b border-slate-200"
            data-oid="1j2aof_"
          >
            <th
              className="sticky left-0 z-30 bg-white px-4 py-3 text-left text-slate-700 font-medium border-r border-slate-200"
              data-oid="ymt:040"
            >
              <div className="flex items-center gap-2" data-oid="8_gke8k">
                <label
                  className="text-sm font-medium text-slate-700"
                  data-oid="4wt-yb2"
                >
                  Holding Period:
                </label>
                <div className="relative" data-oid="xagvsfl">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={
                      isHoldingPeriodEditing
                        ? holdingPeriodInput
                        : displayProperties[0]?.holdingPeriod || 4
                    }
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setHoldingPeriodInput(newValue);
                      // Only update properties if we have a valid number
                      if (newValue && !isNaN(parseFloat(newValue))) {
                        const numValue = parseFloat(newValue);
                        displayProperties.forEach((p) =>
                          updateProperty(p.id, "holdingPeriod", numValue),
                        );
                      }
                    }}
                    onFocus={() => {
                      setIsHoldingPeriodEditing(true);
                      // Start with current value or empty string if it's the default
                      const currentValue =
                        displayProperties[0]?.holdingPeriod || 4;
                      setHoldingPeriodInput(String(currentValue));
                    }}
                    onBlur={() => {
                      setIsHoldingPeriodEditing(false);
                      // If input is empty or invalid, revert to default
                      if (
                        !holdingPeriodInput ||
                        isNaN(parseFloat(holdingPeriodInput))
                      ) {
                        const defaultValue =
                          displayProperties[0]?.holdingPeriod || 4;
                        setHoldingPeriodInput(String(defaultValue));
                        displayProperties.forEach((p) =>
                          updateProperty(p.id, "holdingPeriod", defaultValue),
                        );
                      }
                    }}
                    className="w-16 px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-oid="holding-period-header-input"
                  />
                </div>

                <span className="text-sm text-slate-600" data-oid="-nffip1">
                  Year(s)
                </span>
              </div>
            </th>
            {displayProperties.map((property, i) => (
              <th
                key={property.id}
                className="px-4 py-3 text-left font-medium text-slate-800 border-r border-slate-200 last:border-r-0"
                data-oid="rex0cwa"
              >
                <div
                  className="relative flex flex-col items-center gap-2"
                  data-oid="7boliu7"
                >
                  <PropertyTypeBadge type={property.type} data-oid="vf3f9rw" />
                  <div
                    className="text-slate-900 font-semibold"
                    data-oid="gr08yoe"
                  >
                    {editingPropertyId === property.id ? (
                      // Inline editing mode
                      <div
                        className="flex items-center gap-2"
                        data-oid="_zdgta7"
                      >
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-7 text-xs text-center"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit(property.id);
                            } else if (e.key === "Escape") {
                              handleCancelEdit();
                            }
                          }}
                          autoFocus
                          data-oid="mx1z2gq"
                        />

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleSaveEdit(property.id)}
                          data-oid="tobbo37"
                        >
                          <Save className="h-3 w-3" data-oid="3e-rnc5" />
                        </Button>
                      </div>
                    ) : hasPropertyData(property) ? (
                      // Property has data - show editable name with save options
                      <div className="text-center" data-oid="kowvdeg">
                        <div
                          className="flex items-center justify-center gap-2"
                          data-oid="0qgw7m3"
                        >
                          <div
                            className="font-semibold text-slate-900"
                            data-oid="irg:a3h"
                          >
                            {property.name}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0"
                            onClick={() => handleStartEdit(property)}
                            data-oid="fmz9rqg"
                          >
                            <Edit2 className="h-3 w-3" data-oid="8a4v8d3" />
                          </Button>
                          {hasPropertyData(property) && (
                            <DropdownMenu data-oid="h7x3qvr">
                              <DropdownMenuTrigger asChild data-oid="01-o634">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0"
                                  data-oid="gb1b3nx"
                                >
                                  <Save
                                    className="h-3 w-3"
                                    data-oid="q-ip_5o"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent data-oid="hik6q.l">
                                <DropdownMenuItem
                                  onClick={() =>
                                    onSaveExistingProperty(property)
                                  }
                                  data-oid="e3agub2"
                                >
                                  <Folder
                                    className="h-3 w-3 mr-2"
                                    data-oid="96l48qh"
                                  />
                                  Save to Default Folder
                                </DropdownMenuItem>
                                {mockFolders.map((folder) => (
                                  <DropdownMenuItem
                                    key={folder}
                                    onClick={() =>
                                      onSaveExistingProperty(property, folder)
                                    }
                                    data-oid="1ez7uq7"
                                  >
                                    <Folder
                                      className="h-3 w-3 mr-2"
                                      data-oid="25m0490"
                                    />
                                    Save to {folder}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleOpenCreateFolderDialog(property)
                                  }
                                  data-oid="it0k_z_"
                                >
                                  <Folder
                                    className="h-3 w-3 mr-2"
                                    data-oid="dn1e0o2"
                                  />
                                  Create New Folder
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Property has no data - show SelectPropertyButton
                      <SelectPropertyButton
                        columnId={property.id}
                        propertyType={property.type}
                        onSelectSavedProperty={onSelectSavedProperty}
                        onCreateNewProperty={onCreateNewProperty}
                        onCreateFolder={onCreateFolder}
                        data-oid="-ba5i5q"
                      />
                    )}
                  </div>
                  {displayProperties.length > 1 && (
                    <button
                      onClick={() => removeProperty(property.id)}
                      aria-label="Remove property"
                      className="absolute top-0 right-0 rounded-full p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      data-oid="51esp0c"
                    >
                      <X className="h-4 w-4" data-oid="hn3bveo" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-sm" data-oid="2yap7tx">
          <DataRow
            label="Purchase Price"
            properties={displayProperties}
            render={(p) => (
              <CurrencyInput
                value={p.purchasePrice}
                onChange={(v) => updateProperty(p.id, "purchasePrice", v)}
                data-oid="h1l.-c5"
              />
            )}
            data-oid="wqcq-wm"
          />

          <DataRow
            label="Loan Tenure (Years)"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2" data-oid="a_6x:c_">
                <ClearableNumberInput
                  value={p.loanTenure || 30}
                  onChange={(v: number) =>
                    updateProperty(
                      p.id,
                      "loanTenure",
                      Math.min(Math.max(v, 1), 35),
                    )
                  }
                  step={1}
                  className="w-20"
                  data-oid="vb5ncp7"
                />
              </div>
            )}
            data-oid="x623shh"
          />

          <DataRow
            label="Interest Rate %"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2" data-oid="zi2c678">
                <ClearableNumberInput
                  value={p.interestRate || 2.0}
                  onChange={(v: number) =>
                    updateProperty(
                      p.id,
                      "interestRate",
                      Math.min(Math.max(v, 0.01), 5.0),
                    )
                  }
                  step={0.01}
                  className="w-20"
                  data-oid="i1idv0g"
                />
              </div>
            )}
            data-oid=":05djn_"
          />

          <DataRow
            label="LTV %"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2" data-oid="cw04q3p">
                <ClearableNumberInput
                  value={p.ltv || 75}
                  onChange={(v: number) =>
                    updateProperty(p.id, "ltv", Math.min(Math.max(v, 1), 75))
                  }
                  step={1}
                  className="w-20"
                  data-oid="hdpbtdz"
                />
              </div>
            )}
            data-oid="ir25mmn"
          />

          <DataRow
            label="Bank Loan"
            properties={displayProperties}
            render={(p) => {
              const bankLoan = (p.purchasePrice * (p.ltv || 75)) / 100;
              return (
                <div className="space-y-1" data-oid="k_r_m:8">
                  <div
                    className="text-sm font-medium text-slate-900"
                    data-oid="6jtli.z"
                  >
                    {fmtCurrency(bankLoan)}
                  </div>
                </div>
              );
            }}
            data-oid="qy.8ldf"
          />

          <DataRow
            label="Est. TOP (Month-Year)"
            properties={displayProperties}
            render={(p) => {
              if (p.type === "Resale") {
                return (
                  <span className="text-slate-500" data-oid="zrebu4-">
                    N/A
                  </span>
                );
              }

              const balanceMonths = calculateBalanceMonthAftTOP(
                p.estTOP,
                displayProperties[0]?.holdingPeriod || 4,
              );

              return (
                <DualCell
                  left={
                    <MonthYearPicker
                      value={p.estTOP}
                      onChange={(date) => updateProperty(p.id, "estTOP", date)}
                      disabled={false}
                      data-oid="3aw3zvj"
                    />
                  }
                  right={
                    <div
                      className="text-xs text-slate-600 whitespace-normal leading-tight max-w-[120px] break-words"
                      data-oid="qmn1kbg"
                    >
                      {balanceMonths} months to end Holding Period
                    </div>
                  }
                  data-oid="._sl344"
                />
              );
            }}
            data-oid="_6hez8h"
          />

          <tr className="h-4 bg-white" data-oid="hy076ue">
            <td
              colSpan={displayProperties.length + 1}
              className="border-none"
              data-oid="y5-bfqc"
            ></td>
          </tr>
          <SectionRow
            title={mode === "own" ? "Growth" : "Rental & Growth"}
            colSpan={displayProperties.length + 1}
            icon="graph-up-arrow"
            data-oid="4s:9l_g"
          />

          <DataRow
            label={`Projected Property Growth`}
            properties={displayProperties}
            render={(p) => {
              const d = calculateValues(p, {
                mode,
                taxBracket,
                vacancyMonth: p.vacancyMonth,
                monthlyRental,
              });
              return (
                <DualCell
                  left={
                    <ValueText data-oid=":nx7-ue">
                      {fmtCurrency(d.projectedGrowth)}
                    </ValueText>
                  }
                  right={
                    <LabeledNumber
                      label="Annual%"
                      value={p.annualGrowth}
                      step={0.1}
                      onChange={(v) => updateProperty(p.id, "annualGrowth", v)}
                      data-oid="rfuuneh"
                    />
                  }
                  data-oid=":9ya9sw"
                />
              );
            }}
            data-oid="6ms7x1x"
          />

          {mode === "investment" && (
            <>
              <ConditionalBUCDataRow
                label={
                  <div className="flex items-center gap-3" data-oid="0ycg6n6">
                    <div data-oid="zx6q267">
                      <div data-oid="-o85emd">Rental Income</div>
                    </div>
                    <div className="ml-auto" data-oid="2higym_">
                      <LabeledCurrency
                        label="Monthly"
                        value={monthlyRental}
                        step={100}
                        onChange={(v) => setMonthlyRental(v)}
                        data-oid="47oo:hu"
                      />
                    </div>
                  </div>
                }
                properties={displayProperties}
                fieldKey="monthlyRental"
                mode={mode}
                balanceMonthsMap={balanceMonthsMap}
                renderInput={(p) => {
                  const d = calculateValues(p, {
                    mode,
                    taxBracket,
                    vacancyMonth: p.vacancyMonth,
                    monthlyRental,
                  });
                  return (
                    <ValueText data-oid="uge03nr">
                      {fmtCurrency(d.rentalIncome)}
                    </ValueText>
                  );
                }}
                data-oid="ka0-27u"
              />

              <DataRow
                label="Vacancy Month"
                properties={displayProperties}
                render={(p) => {
                  // For BUC properties, check if balance months after TOP > 0
                  if (p.type === "BUC") {
                    const balanceMonths = balanceMonthsMap.get(p.id) || 0;
                    if (balanceMonths === 0) {
                      return (
                        <div
                          className="text-xs text-slate-500"
                          data-oid="v2exb7q"
                        >
                          N/A
                        </div>
                      );
                    }
                  }

                  return (
                    <DualCell
                      left={
                        <div
                          className="text-red-600 font-medium"
                          data-oid="ppgd6av"
                        >
                          {(() => {
                            const d = calculateValues(p, {
                              mode,
                              taxBracket,
                              vacancyMonth: p.vacancyMonth,
                              monthlyRental,
                            });
                            return d.vacancyDeduction === 0
                              ? "$0"
                              : `-${fmtCurrency(d.vacancyDeduction)}`;
                          })()}
                        </div>
                      }
                      right={
                        <Select
                          value={String(p.vacancyMonth)}
                          onValueChange={(v: string) =>
                            updateProperty(
                              p.id,
                              "vacancyMonth",
                              Number.parseInt(v),
                            )
                          }
                          data-oid="ktrb-8j"
                        >
                          <SelectTrigger
                            className="h-9 w-24 border border-slate-200 rounded text-xs"
                            data-oid="v4d9juz"
                          >
                            <SelectValue data-oid="xl4thsl" />
                          </SelectTrigger>
                          <SelectContent
                            className="max-h-64 text-xs text-slate-600"
                            data-oid=":6.j8-4"
                          >
                            {Array.from({ length: 25 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={String(i)}
                                className="text-xs text-slate-500"
                                data-oid="2nxe593"
                              >
                                {i} {i === 1 ? "month" : "months"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      }
                      data-oid="7p36tue"
                    />
                  );
                }}
                data-oid="ipb8w0m"
              />
            </>
          )}

          <tr className="bg-green-50 hover:bg-green-100" data-oid="6dvdlmt">
            <td
              className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
              data-oid="tntwb4t"
            >
              Est. Gross Profit
            </td>
            {displayProperties.map((p, i) => {
              const d = calculateValues(p, {
                mode,
                taxBracket,
                vacancyMonth: p.vacancyMonth,
                monthlyRental,
              });
              return (
                <td
                  key={p.id}
                  className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === displayProperties.length - 1 ? "last:border-r-0" : ""}`}
                  data-oid="7ft5rds"
                >
                  <ValueText
                    className="text-emerald-700 font-semibold"
                    data-oid="h10t9sn"
                  >
                    {fmtCurrency(d.grossProfit)}
                  </ValueText>
                </td>
              );
            })}
          </tr>

          <tr className="h-4 bg-white" data-oid="v7fryot">
            <td
              colSpan={displayProperties.length + 1}
              className="border-none"
              data-oid="6yalf6p"
            ></td>
          </tr>
          <SectionRow
            title="Other Expenses"
            colSpan={displayProperties.length + 1}
            icon="piggy-bank"
            data-oid="ym380ma"
          />

          {mode === "own" && (
            <DataRow
              label={`Rent while waiting for BUC`}
              properties={displayProperties}
              render={(p) => {
                const d = calculateValues(p, {
                  mode,
                  taxBracket,
                  vacancyMonth: p.vacancyMonth,
                  monthlyRental,
                });
                const isNA = p.type === "Resale";
                return isNA ? (
                  <div className="text-xs text-slate-500" data-oid="2vlm3wt">
                    N/A
                  </div>
                ) : (
                  <DualCell
                    left={
                      <ValueText data-oid="z:2pv:k">
                        {fmtCurrency(d.rentWhileWaitingTotal)}
                      </ValueText>
                    }
                    right={
                      <LabeledCurrency
                        label="Monthly"
                        value={p.monthlyRentWhileWaiting}
                        step={100}
                        onChange={(v) =>
                          updateProperty(p.id, "monthlyRentWhileWaiting", v)
                        }
                        data-oid="biazmlu"
                      />
                    }
                    data-oid="740spah"
                  />
                );
              }}
              data-oid="ym.jsfr"
            />
          )}

          <MaybeNADataRow
            label={`Total Interest Payable (Bank Loan)`}
            properties={displayProperties}
            fieldKey="bankLoan" // Assuming bank loan is always applicable, but including for structure
            mode={mode}
            renderInput={(p) => {
              const d = calculateValues(p, {
                mode,
                taxBracket,
                vacancyMonth: p.vacancyMonth,
                monthlyRental,
              });
              return (
                <div className="space-y-1" data-oid="-7d-b-g">
                  <div className="font-medium" data-oid="c7wxgk-">
                    {fmtCurrency(d.bankInterest)}
                  </div>
                  <div
                    className="text-[11px] text-slate-500"
                    data-oid="24sjmdz"
                  >
                    {p.type === "Resale"
                      ? `Resale Int: ${(p.interestRate || 2.0).toFixed(2)}%`
                      : `BUC Int: ${(p.interestRate || 2.0).toFixed(2)}%`}
                  </div>
                </div>
              );
            }}
            data-oid="7fauewu"
          />

          <ConditionalBUCDataRow
            label={`Maintenance Fee`}
            properties={displayProperties}
            fieldKey="maintenanceFee"
            mode={mode}
            balanceMonthsMap={balanceMonthsMap}
            renderInput={(p) => {
              const d = calculateValues(p, {
                mode,
                taxBracket,
                vacancyMonth: p.vacancyMonth,
                monthlyRental,
              });
              return (
                <DualCell
                  left={
                    <ValueText data-oid="xm42tqa">
                      {fmtCurrency(d.maintenanceFeeTotal)}
                    </ValueText>
                  }
                  right={
                    <LabeledCurrency
                      label="Monthly"
                      value={p.monthlyMaintenance}
                      step={50}
                      onChange={(v) =>
                        updateProperty(p.id, "monthlyMaintenance", v)
                      }
                      data-oid="irmyoza"
                    />
                  }
                  data-oid="i_xs:6f"
                />
              );
            }}
            data-oid="dldzsso"
          />

          {/* SSD Payable - only show if holding period is less than 4 years (selling in 4th year or earlier) */}
          {displayProperties[0]?.holdingPeriod < 4 && (
            <DataRow
              label="SSD Payable"
              properties={displayProperties}
              render={(p) => {
                const d = calculateValues(p, {
                  mode,
                  taxBracket,
                  vacancyMonth: p.vacancyMonth,
                  monthlyRental,
                });

                // The holding period represents minimum time held, selling happens in the next year
                const sellingYear = p.holdingPeriod + 1;
                let rateText = "";

                if (sellingYear === 1) {
                  rateText = "16%";
                } else if (sellingYear === 2) {
                  rateText = "12%";
                } else if (sellingYear === 3) {
                  rateText = "8%";
                } else if (sellingYear === 4) {
                  rateText = "4%";
                }

                return (
                  <DualCell
                    left={
                      <ValueText data-oid="7:n890i">
                        {fmtCurrency(d.ssdPayable)}
                      </ValueText>
                    }
                    right={
                      <div
                        className="text-xs text-slate-600 text-center"
                        data-oid="c6pisv3"
                      >
                        {rateText}
                      </div>
                    }
                    data-oid=":9p9.4y"
                  />
                );
              }}
              data-oid="zubdv:_"
            />
          )}

          <ConditionalBUCDataRow
            label={`Est. Property Tax`}
            properties={displayProperties}
            fieldKey="propertyTax"
            mode={mode}
            balanceMonthsMap={balanceMonthsMap}
            renderInput={(p) => (
              <CurrencyInput
                value={p.propertyTax}
                onChange={(v) => updateProperty(p.id, "propertyTax", v)}
                data-oid="rz3_sh1"
              />
            )}
            data-oid="vrd3r-5"
          />

          {mode === "investment" && (
            <DataRow
              label={
                <div className="flex items-center gap-3" data-oid="sp:h-fv">
                  <span data-oid="lh78fvy">
                    Income Tax on Net Rental Received
                  </span>
                  <div
                    className="ml-auto flex flex-col items-start gap-1"
                    data-oid="rt6v13k"
                  >
                    <Select
                      value={selectedTaxId}
                      onValueChange={(id: string) => {
                        const opt = TAX_BRACKETS.find((o) => o.id === id)!;
                        setSelectedTaxId(id);
                        setTaxBracket(opt.rate);
                      }}
                      data-oid="cbjcu:q"
                    >
                      <SelectTrigger
                        className="h-8 w-[180px] text-xs text-slate-500 border border-slate-200 rounded"
                        data-oid="l5fpyx:"
                      >
                        {selectedTax ? (
                          <div
                            className="flex w-full items-center justify-between text-xs text-slate-500"
                            data-oid="hvjnyhy"
                          >
                            <span className="truncate pr-2" data-oid="nohf4a1">
                              {selectedTax.range}
                            </span>
                            <span
                              className="text-right tabular-nums"
                              data-oid="xe7p9j3"
                            >
                              ({fmtRate(selectedTax.rate)})
                            </span>
                          </div>
                        ) : (
                          <SelectValue
                            placeholder="Select Tax Bracket"
                            data-oid="_mafn8h"
                          />
                        )}
                      </SelectTrigger>
                      <SelectContent
                        className="max-h-72 w-[180px] text-xs text-slate-600"
                        data-oid="om6b01w"
                      >
                        {TAX_BRACKETS.map((o) => (
                          <SelectItem
                            key={o.id}
                            value={o.id}
                            textValue={`${o.range} (${fmtRate(o.rate)})`}
                            className="relative pl-3 pr-3 text-xs text-slate-500"
                            data-oid="jyeswp3"
                          >
                            <span data-oid="j.q1uwu">{o.range}</span>
                            <span
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                              data-oid="tuiyzrg"
                            >
                              ({fmtRate(o.rate)})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              }
              properties={displayProperties}
              render={(p) => (
                <div data-oid=":-hi83f">
                  {fmtCurrency(
                    calculateValues(p, {
                      mode,
                      taxBracket,
                      vacancyMonth: p.vacancyMonth,
                      monthlyRental,
                    }).taxOnRental,
                  )}
                </div>
              )}
              data-oid="xlr-dn-"
            />
          )}

          <ConditionalBUCDataRow
            label="Minor Renovation"
            properties={displayProperties}
            fieldKey="minorRenovation"
            mode={mode}
            balanceMonthsMap={balanceMonthsMap}
            renderInput={(p) => (
              <CurrencyInput
                value={p.minorRenovation}
                onChange={(v) => updateProperty(p.id, "minorRenovation", v)}
                data-oid="dlutitt"
              />
            )}
            data-oid="br_g77-"
          />

          <ConditionalBUCDataRow
            label="Furniture & Fittings"
            properties={displayProperties}
            fieldKey="furnitureFittings"
            mode={mode}
            balanceMonthsMap={balanceMonthsMap}
            renderInput={(p) => (
              <CurrencyInput
                value={p.furnitureFittings}
                onChange={(v) => updateProperty(p.id, "furnitureFittings", v)}
                data-oid="59.8l7m"
              />
            )}
            data-oid="k7trcca"
          />

          {mode === "investment" && (
            <CommissionRateDataRow
              label={
                <div className="flex items-center gap-3" data-oid="14:db0a">
                  <span data-oid="8nuz85-">Rental Agent Commission</span>
                  <div
                    className="ml-auto flex flex-col items-start gap-1"
                    data-oid="iydun8b"
                  >
                    <CommissionRateSelector
                      value={globalCommissionRate}
                      onChange={(rate) => {
                        setGlobalCommissionRate(rate);
                        // Apply the global rate to all properties
                        displayProperties.forEach((property) => {
                          updateProperty(property.id, "commissionRate", rate);
                          // Clear the commission amount when "none" is selected
                          if (rate === "none") {
                            updateProperty(property.id, "agentCommission", 0);
                          }
                          // Clear the commission amount when "other" is selected so user can enter their own value
                          if (rate === "other") {
                            updateProperty(property.id, "agentCommission", 0);
                          }
                        });
                      }}
                      data-oid="m_:f1z_"
                    />
                  </div>
                </div>
              }
              properties={displayProperties}
              mode={mode}
              balanceMonthsMap={balanceMonthsMap}
              globalCommissionRate={globalCommissionRate}
              onCommissionRateChange={(propertyId, rate) => {
                updateProperty(propertyId, "commissionRate", rate);
                // Clear the commission amount when "none" is selected
                if (rate === "none") {
                  updateProperty(propertyId, "agentCommission", 0);
                }
                // Clear the commission amount when "other" is selected so user can enter their own value
                if (rate === "other") {
                  updateProperty(propertyId, "agentCommission", 0);
                }
                // For predefined rates, let the updateProperty function handle the automatic calculation
              }}
              onAgentCommissionChange={(propertyId, value) =>
                updateProperty(propertyId, "agentCommission", value)
              }
              data-oid="0rkaj-k"
            />
          )}

          <DataRow
            label="Other Expenses"
            properties={displayProperties}
            render={(p) => (
              <CurrencyInput
                value={p.otherExpenses}
                onChange={(v) => updateProperty(p.id, "otherExpenses", v)}
                data-oid="jmcay1v"
              />
            )}
            data-oid="ulzi-wi"
          />

          <tr className="bg-red-50 hover:bg-red-100" data-oid="badd4nv">
            <td
              className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
              data-oid="7n2wnkr"
            >
              Total Expenses
            </td>
            {displayProperties.map((p, i) => (
              <td
                key={p.id}
                className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === displayProperties.length - 1 ? "last:border-r-0" : ""}`}
                data-oid="bja:u_1"
              >
                <ValueText
                  className="text-rose-700 font-semibold"
                  data-oid="48yoklx"
                >
                  {fmtCurrency(
                    calculateValues(p, {
                      mode,
                      taxBracket,
                      vacancyMonth: p.vacancyMonth,
                      monthlyRental,
                    }).totalOtherExpenses,
                  )}
                </ValueText>
              </td>
            ))}
          </tr>

          <tr className="h-4 bg-white" data-oid="j2h9yc1">
            <td
              colSpan={displayProperties.length + 1}
              className="border-none"
              data-oid="0vu0sdt"
            ></td>
          </tr>

          <PropertySummary
            properties={displayProperties}
            mode={mode}
            taxBracket={taxBracket}
            monthlyRental={monthlyRental}
            data-oid="6l1mavg"
          />
        </tbody>
      </table>

      {/* Create Folder Dialog */}
      <Dialog
        open={isCreateFolderDialogOpen}
        onOpenChange={setIsCreateFolderDialogOpen}
        data-oid="cm5h2us"
      >
        <DialogContent className="sm:max-w-md" data-oid="_hy0.zs">
          <DialogHeader data-oid="_zkkgav">
            <DialogTitle data-oid="qlo82qm">Create New Folder</DialogTitle>
            <DialogDescription data-oid="fialefy">
              Enter a name for the new folder and save your property to it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4" data-oid="jhiq8-d">
            <div className="space-y-2" data-oid="8c6-u0e">
              <Label htmlFor="folder-name" data-oid="alncqnn">
                Folder Name
              </Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateFolderAndSave();
                  }
                }}
                autoFocus
                data-oid="gb5:9z3"
              />
            </div>
            <div className="flex justify-end space-x-2" data-oid="51y95vj">
              <Button
                variant="outline"
                onClick={handleCancelCreateFolder}
                data-oid="j0ey85f"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolderAndSave}
                disabled={!newFolderName.trim()}
                data-oid="rb.skbe"
              >
                Create & Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
