"use client";

import { useState } from "react";
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
import type { Property, Mode, SavedProperty, PropertyType } from "./types";
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
} from "./ui-components";
import { SectionRow, DataRow, MaybeNADataRow } from "./table-components";
import PropertySummary from "./property-summary";
import SelectPropertyButton from "./select-property-button";

interface PropertyTableProps {
  properties: Property[];
  mode: Mode;
  taxBracket: number;
  vacancyMonth: number;
  selectedTaxId: string | undefined;
  setSelectedTaxId: (id: string) => void;
  setTaxBracket: (rate: number) => void;
  setVacancyMonth: (months: number) => void;
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
  vacancyMonth,
  selectedTaxId,
  setSelectedTaxId,
  setTaxBracket,
  setVacancyMonth,
  removeProperty,
  updateProperty,
  onSelectSavedProperty,
  onCreateNewProperty,
  onCreateFolder,
  onSaveExistingProperty,
}: PropertyTableProps) {
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
      data-oid="t-ewwb3"
    >
      <table className="w-full border-collapse" data-oid="eu55j4c">
        <colgroup data-oid="eio3l5e">
          <col className="w-[360px]" data-oid="lul6i.d" />
          {displayProperties.map((p) => (
            <col key={p.id} className="w-[300px]" data-oid="2h9t16y" />
          ))}
        </colgroup>

        <thead className="text-sm" data-oid="39r8czu">
          <tr
            className="sticky top-0 z-20 bg-white border-b border-slate-200"
            data-oid="bckoc7:"
          >
            <th
              className="sticky left-0 z-30 bg-white px-4 py-3 text-left text-slate-700 font-medium border-r border-slate-200"
              data-oid="mlcfmce"
            >
              {""}
            </th>
            {displayProperties.map((property, i) => (
              <th
                key={property.id}
                className="px-4 py-3 text-left font-medium text-slate-800 border-r border-slate-200 last:border-r-0"
                data-oid="1owa3-7"
              >
                <div
                  className="relative flex flex-col items-center gap-2"
                  data-oid="-tnml4a"
                >
                  <PropertyTypeBadge type={property.type} data-oid="nx5w4_w" />
                  <div
                    className="text-slate-900 font-semibold"
                    data-oid=".o.d_3t"
                  >
                    {editingPropertyId === property.id ? (
                      // Inline editing mode
                      <div
                        className="flex items-center gap-2"
                        data-oid="d302wva"
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
                          data-oid="yt8i_g_"
                        />

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleSaveEdit(property.id)}
                          data-oid="p52lg6u"
                        >
                          <Save className="h-3 w-3" data-oid="4c9cgz9" />
                        </Button>
                      </div>
                    ) : hasPropertyData(property) ? (
                      // Property has data - show editable name with save options
                      <div className="text-center" data-oid="1ocxhvz">
                        <div
                          className="flex items-center justify-center gap-2"
                          data-oid="s:nbnm6"
                        >
                          <div
                            className="font-semibold text-slate-900"
                            data-oid="qw6-znh"
                          >
                            {property.name}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0"
                            onClick={() => handleStartEdit(property)}
                            data-oid="_-o6o-v"
                          >
                            <Edit2 className="h-3 w-3" data-oid="z0eppuy" />
                          </Button>
                          {hasPropertyData(property) && (
                            <DropdownMenu data-oid="ze2.yev">
                              <DropdownMenuTrigger asChild data-oid="l0p7_c3">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0"
                                  data-oid="bp1exme"
                                >
                                  <Save
                                    className="h-3 w-3"
                                    data-oid="lvaa0.g"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent data-oid="l4o6b72">
                                <DropdownMenuItem
                                  onClick={() =>
                                    onSaveExistingProperty(property)
                                  }
                                  data-oid="deugje9"
                                >
                                  <Folder
                                    className="h-3 w-3 mr-2"
                                    data-oid=":3qa.oa"
                                  />
                                  Save to Default Folder
                                </DropdownMenuItem>
                                {mockFolders.map((folder) => (
                                  <DropdownMenuItem
                                    key={folder}
                                    onClick={() =>
                                      onSaveExistingProperty(property, folder)
                                    }
                                    data-oid="7m0y-ga"
                                  >
                                    <Folder
                                      className="h-3 w-3 mr-2"
                                      data-oid="0lsehat"
                                    />
                                    Save to {folder}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleOpenCreateFolderDialog(property)
                                  }
                                  data-oid="1744x-u"
                                >
                                  <Folder
                                    className="h-3 w-3 mr-2"
                                    data-oid="69h.wds"
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
                        data-oid="w29l-dq"
                      />
                    )}
                  </div>
                  {displayProperties.length > 1 && (
                    <button
                      onClick={() => removeProperty(property.id)}
                      aria-label="Remove property"
                      className="absolute top-0 right-0 rounded-full p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      data-oid="3is16i1"
                    >
                      <X className="h-4 w-4" data-oid="ticqu8k" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-sm" data-oid="k7y29hb">
          <DataRow
            label="Purchase Price"
            properties={displayProperties}
            render={(p) => (
              <CurrencyInput
                value={p.purchasePrice}
                onChange={(v) => updateProperty(p.id, "purchasePrice", v)}
                data-oid="oqdao04"
              />
            )}
            data-oid="u39qwmf"
          />

          <DataRow
            label="Loan Tenure (Years)"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2" data-oid="eiha1ko">
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
                  data-oid="za72zt8"
                />
              </div>
            )}
            data-oid="es1dx1h"
          />

          <DataRow
            label="Interest Rate %"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2" data-oid="dl.m.al">
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
                  data-oid="w1yaonc"
                />
              </div>
            )}
            data-oid="v5g__po"
          />

          <DataRow
            label="LTV %"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2" data-oid="on5dtlx">
                <ClearableNumberInput
                  value={p.ltv || 75}
                  onChange={(v: number) =>
                    updateProperty(p.id, "ltv", Math.min(Math.max(v, 1), 75))
                  }
                  step={1}
                  className="w-20"
                  data-oid="g-oknvr"
                />
              </div>
            )}
            data-oid="58altt9"
          />

          <DataRow
            label="Bank Loan"
            properties={displayProperties}
            render={(p) => {
              const bankLoan = (p.purchasePrice * (p.ltv || 75)) / 100;
              return (
                <div className="space-y-1" data-oid="_lx6v-e">
                  <div
                    className="text-sm font-medium text-slate-900"
                    data-oid="dkzxz1j"
                  >
                    {fmtCurrency(bankLoan)}
                  </div>
                </div>
              );
            }}
            data-oid="ntgu:04"
          />

          <DataRow
            label="Est. TOP (Month-Year)"
            properties={displayProperties}
            render={(p) => (
              <MonthYearPicker
                value={p.estTOP}
                onChange={(date) => updateProperty(p.id, "estTOP", date)}
                disabled={p.type === "Resale"}
                data-oid=".cqnpob"
              />
            )}
            data-oid="svhz:az"
          />

          <DataRow
            label="Balance Month Aft. TOP (months)"
            properties={displayProperties}
            render={(p) => {
              if (p.type === "Resale") {
                return (
                  <div
                    className="text-sm font-medium text-slate-900"
                    data-oid="vy5gj6r"
                  >
                    48
                  </div>
                );
              }

              const balanceMonths = calculateBalanceMonthAftTOP(p.estTOP);
              // Update the property's balanceMonthAftTOP field when calculated
              if (p.balanceMonthAftTOP !== balanceMonths) {
                updateProperty(p.id, "balanceMonthAftTOP", balanceMonths);
              }

              return (
                <div
                  className="text-sm font-medium text-slate-900"
                  data-oid="vs5szuo"
                >
                  {balanceMonths}
                </div>
              );
            }}
            data-oid="-wqwvxt"
          />

          <tr className="h-4 bg-white" data-oid="m:abege">
            <td
              colSpan={displayProperties.length + 1}
              className="border-none"
              data-oid="y0lozay"
            ></td>
          </tr>
          <SectionRow
            title={mode === "own" ? "Growth" : "Rental & Growth"}
            colSpan={displayProperties.length + 1}
            icon="graph-up-arrow"
            data-oid="sp.evib"
          />

          <DataRow
            label={`Projected Property Growth`}
            properties={displayProperties}
            render={(p) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth });
              return (
                <DualCell
                  left={
                    <ValueText data-oid="5409pt3">
                      {fmtCurrency(d.projectedGrowth)}
                    </ValueText>
                  }
                  right={
                    <LabeledNumber
                      label="Annual%"
                      value={p.annualGrowth}
                      step={0.1}
                      onChange={(v) => updateProperty(p.id, "annualGrowth", v)}
                      data-oid="s6idh9q"
                    />
                  }
                  data-oid="vx-d3so"
                />
              );
            }}
            data-oid="v:bnhv7"
          />

          {mode === "investment" && (
            <>
              <MaybeNADataRow
                label={`Rental Income`}
                properties={displayProperties}
                fieldKey="monthlyRental" // Use monthlyRental as the key to check for N/A
                mode={mode}
                renderInput={(p) => {
                  const d = calculateValues(p, {
                    mode,
                    taxBracket,
                    vacancyMonth,
                  });
                  return (
                    <DualCell
                      left={
                        <ValueText data-oid="li69nz7">
                          {fmtCurrency(d.rentalIncome)}
                        </ValueText>
                      }
                      right={
                        <LabeledCurrency
                          label="Monthly"
                          value={p.monthlyRental}
                          step={100}
                          onChange={(v) =>
                            updateProperty(p.id, "monthlyRental", v)
                          }
                          data-oid="0-q0s_r"
                        />
                      }
                      data-oid="zwm_5fz"
                    />
                  );
                }}
                data-oid="o_x71nb"
              />

              <DataRow
                label={
                  <div className="flex items-center gap-3" data-oid="8kb2pim">
                    <div data-oid="k1jvii:">
                      <div data-oid="mi80_z:">Vacancy Month</div>
                    </div>
                    <div className="ml-auto" data-oid="-:epukm">
                      <Select
                        value={String(vacancyMonth)}
                        onValueChange={(v: string) =>
                          setVacancyMonth(Number.parseInt(v))
                        }
                        data-oid="gcy0v9_"
                      >
                        <SelectTrigger
                          className="h-8 w-[140px]"
                          data-oid="qdv:xrc"
                        >
                          <SelectValue data-oid="8fik1-e" />
                        </SelectTrigger>
                        <SelectContent className="max-h-64" data-oid="jm6vwzn">
                          {Array.from({ length: 25 }, (_, i) => (
                            <SelectItem
                              key={i}
                              value={String(i)}
                              data-oid="hbjvm3f"
                            >
                              {i} {i === 1 ? "month" : "months"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                }
                properties={displayProperties}
                render={(p) => {
                  const d = calculateValues(p, {
                    mode,
                    taxBracket,
                    vacancyMonth,
                  });
                  // Check if property type is BUC to display N/A
                  if (p.type === "BUC") {
                    return (
                      <div
                        className="text-xs text-slate-500"
                        data-oid="3di1d18"
                      >
                        N/A
                      </div>
                    );
                  }
                  // Show neutral text when no vacancy, red negative value when there is vacancy
                  if (d.vacancyDeduction === 0) {
                    return (
                      <div className="text-slate-600" data-oid="xqzzzgj">
                        $0
                      </div>
                    );
                  }
                  // Display vacancy deduction as negative value in red text since it represents a loss
                  return (
                    <div
                      className="text-red-600 font-medium"
                      data-oid="gcnh3h8"
                    >
                      -{fmtCurrency(d.vacancyDeduction)}
                    </div>
                  );
                }}
                data-oid=":ky:ihp"
              />
            </>
          )}

          <tr className="bg-green-50 hover:bg-green-100" data-oid="-qulo3u">
            <td
              className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
              data-oid="7o-.f7v"
            >
              Est. Gross Profit
            </td>
            {displayProperties.map((p, i) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth });
              return (
                <td
                  key={p.id}
                  className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === displayProperties.length - 1 ? "last:border-r-0" : ""}`}
                  data-oid="5jiak--"
                >
                  <ValueText
                    className="text-emerald-700 font-semibold"
                    data-oid="uf6g0fm"
                  >
                    {fmtCurrency(d.grossProfit)}
                  </ValueText>
                </td>
              );
            })}
          </tr>

          <tr className="h-4 bg-white" data-oid="tmvlq9:">
            <td
              colSpan={displayProperties.length + 1}
              className="border-none"
              data-oid="2z2iu-z"
            ></td>
          </tr>
          <SectionRow
            title="Other Expenses"
            colSpan={displayProperties.length + 1}
            icon="piggy-bank"
            data-oid="haz78ej"
          />

          {mode === "own" && (
            <DataRow
              label={`Rent while waiting for BUC`}
              properties={displayProperties}
              render={(p) => {
                const d = calculateValues(p, {
                  mode,
                  taxBracket,
                  vacancyMonth,
                });
                const isNA = p.type === "Resale";
                return isNA ? (
                  <div className="text-xs text-slate-500" data-oid="f9geok6">
                    N/A
                  </div>
                ) : (
                  <DualCell
                    left={
                      <ValueText data-oid="zn62v__">
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
                        data-oid="5ejeho7"
                      />
                    }
                    data-oid="5b4nck8"
                  />
                );
              }}
              data-oid="gkrweq-"
            />
          )}

          <MaybeNADataRow
            label={`Bank Interest`}
            properties={displayProperties}
            fieldKey="bankLoan" // Assuming bank loan is always applicable, but including for structure
            mode={mode}
            renderInput={(p) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth });
              return (
                <div className="space-y-1" data-oid="dcyk5p-">
                  <div className="font-medium" data-oid="fwtqoxc">
                    {fmtCurrency(d.bankInterest)}
                  </div>
                  <div
                    className="text-[11px] text-slate-500"
                    data-oid="f89jtor"
                  >
                    {p.type === "Resale"
                      ? `Resale Int: ${(p.interestRate || 2.0).toFixed(2)}%`
                      : `BUC Int: ${(p.interestRate || 2.0).toFixed(2)}%`}
                  </div>
                </div>
              );
            }}
            data-oid="wr09_88"
          />

          <MaybeNADataRow
            label={`Maintenance Fee`}
            properties={displayProperties}
            fieldKey="maintenanceFee"
            mode={mode}
            renderInput={(p) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth });
              return (
                <DualCell
                  left={
                    <ValueText data-oid="a7c8snt">
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
                      data-oid="7oxx_hp"
                    />
                  }
                  data-oid="k0e:mfv"
                />
              );
            }}
            data-oid="6bx99e4"
          />

          <MaybeNADataRow
            label={`Est. Property Tax`}
            properties={displayProperties}
            fieldKey="propertyTax"
            mode={mode}
            renderInput={(p) => (
              <CurrencyInput
                value={p.propertyTax}
                onChange={(v) => updateProperty(p.id, "propertyTax", v)}
                data-oid="if26cx9"
              />
            )}
            data-oid="ga2jb6j"
          />

          {mode === "investment" && (
            <DataRow
              label={
                <div className="flex items-center gap-3" data-oid="ogh4d1h">
                  <span data-oid="f6amr03">
                    Income Tax on Net Rental Received
                  </span>
                  <div
                    className="ml-auto flex flex-col items-start gap-1"
                    data-oid="4v:xsh6"
                  >
                    <Select
                      value={selectedTaxId}
                      onValueChange={(id: string) => {
                        const opt = TAX_BRACKETS.find((o) => o.id === id)!;
                        setSelectedTaxId(id);
                        setTaxBracket(opt.rate);
                      }}
                      data-oid="9r.-4ka"
                    >
                      <SelectTrigger
                        className="h-8 w-[210px]"
                        data-oid="nf0dao-"
                      >
                        {selectedTax ? (
                          <div
                            className="flex w-full items-center justify-between"
                            data-oid="a44bga6"
                          >
                            <span className="truncate pr-2" data-oid="1i.lowj">
                              {selectedTax.range}
                            </span>
                            <span
                              className="text-right text-slate-600 tabular-nums"
                              data-oid="cnwvjz3"
                            >
                              ({fmtRate(selectedTax.rate)})
                            </span>
                          </div>
                        ) : (
                          <SelectValue
                            placeholder="Select Tax Bracket"
                            data-oid="mrtchw5"
                          />
                        )}
                      </SelectTrigger>
                      <SelectContent
                        className="max-h-72 w-[200px]"
                        data-oid="p3dxw2w"
                      >
                        {TAX_BRACKETS.map((o) => (
                          <SelectItem
                            key={o.id}
                            value={o.id}
                            textValue={`${o.range} (${fmtRate(o.rate)})`}
                            className="relative pl-3 pr-20"
                            data-oid="uj5sp:5"
                          >
                            <span data-oid="5wb-ja0">{o.range}</span>
                            <span
                              className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-600"
                              data-oid="_2jbdv9"
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
                <div data-oid="y_-4610">
                  {fmtCurrency(
                    calculateValues(p, { mode, taxBracket, vacancyMonth })
                      .taxOnRental,
                  )}
                </div>
              )}
              data-oid="mq00igg"
            />
          )}

          <MaybeNADataRow
            label="Minor Renoration"
            properties={displayProperties}
            fieldKey="minorRenovation"
            mode={mode}
            renderInput={(p) => (
              <CurrencyInput
                value={p.minorRenovation}
                onChange={(v) => updateProperty(p.id, "minorRenovation", v)}
                data-oid="7oss8qi"
              />
            )}
            data-oid="jnk7au_"
          />

          <MaybeNADataRow
            label="Furniture & Fittings"
            properties={displayProperties}
            fieldKey="furnitureFittings"
            mode={mode}
            renderInput={(p) => (
              <CurrencyInput
                value={p.furnitureFittings}
                onChange={(v) => updateProperty(p.id, "furnitureFittings", v)}
                data-oid="99459eh"
              />
            )}
            data-oid="kha3wn8"
          />

          {mode === "investment" && (
            <MaybeNADataRow
              label="Rental Agent Commission (Incl. GST)"
              properties={displayProperties}
              fieldKey="agentCommission"
              mode={mode}
              renderInput={(p) => (
                <CurrencyInput
                  value={p.agentCommission}
                  onChange={(v) => updateProperty(p.id, "agentCommission", v)}
                  data-oid="_ilbzkx"
                />
              )}
              data-oid="zlb6sg_"
            />
          )}

          <DataRow
            label="Other Expenses"
            properties={displayProperties}
            render={(p) => (
              <CurrencyInput
                value={p.otherExpenses}
                onChange={(v) => updateProperty(p.id, "otherExpenses", v)}
                data-oid="ukv7pr5"
              />
            )}
            data-oid="xjk3scn"
          />

          <tr className="bg-red-50 hover:bg-red-100" data-oid="va2-1.7">
            <td
              className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
              data-oid="izvp9w-"
            >
              Total Other Expenses
            </td>
            {displayProperties.map((p, i) => (
              <td
                key={p.id}
                className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === displayProperties.length - 1 ? "last:border-r-0" : ""}`}
                data-oid="ye_.4dz"
              >
                <ValueText
                  className="text-rose-700 font-semibold"
                  data-oid="yhcso3e"
                >
                  {fmtCurrency(
                    calculateValues(p, { mode, taxBracket, vacancyMonth })
                      .totalOtherExpenses,
                  )}
                </ValueText>
              </td>
            ))}
          </tr>

          <tr className="h-4 bg-white" data-oid="b8hrtve">
            <td
              colSpan={displayProperties.length + 1}
              className="border-none"
              data-oid="4x4wc8s"
            ></td>
          </tr>

          <PropertySummary
            properties={displayProperties}
            mode={mode}
            taxBracket={taxBracket}
            vacancyMonth={vacancyMonth}
            data-oid="ypinpu6"
          />
        </tbody>
      </table>

      {/* Create Folder Dialog */}
      <Dialog
        open={isCreateFolderDialogOpen}
        onOpenChange={setIsCreateFolderDialogOpen}
        data-oid="l4qj4ze"
      >
        <DialogContent className="sm:max-w-md" data-oid="vmtfj-w">
          <DialogHeader data-oid="wfwcwww">
            <DialogTitle data-oid="n_fok3l">Create New Folder</DialogTitle>
            <DialogDescription data-oid="prf8jd0">
              Enter a name for the new folder and save your property to it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4" data-oid="f2npzg1">
            <div className="space-y-2" data-oid="qw.7z88">
              <Label htmlFor="folder-name" data-oid=".q4zb1s">
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
                data-oid="eyic-_y"
              />
            </div>
            <div className="flex justify-end space-x-2" data-oid="ha8r4yj">
              <Button
                variant="outline"
                onClick={handleCancelCreateFolder}
                data-oid="ijsp9n8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolderAndSave}
                disabled={!newFolderName.trim()}
                data-oid="fpf62qs"
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
