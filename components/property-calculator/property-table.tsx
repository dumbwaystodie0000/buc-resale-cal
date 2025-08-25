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
      data-oid="-_svy0r"
    >
      <table className="w-full border-collapse" data-oid="o77feh4">
        <colgroup data-oid="isttev_">
          <col className="w-[360px]" data-oid="keodtc4" />
          {displayProperties.map((p) => (
            <col key={p.id} className="w-[300px]" data-oid="d3wwnf0" />
          ))}
        </colgroup>

        <thead className="text-sm" data-oid="m7e_6id">
          <tr
            className="sticky top-0 z-20 bg-white border-b border-slate-200"
            data-oid="k_kgzj-"
          >
            <th
              className="sticky left-0 z-30 bg-white px-4 py-3 text-left text-slate-700 font-medium border-r border-slate-200"
              data-oid="uhubl7n"
            >
              {""}
            </th>
            {displayProperties.map((property, i) => (
              <th
                key={property.id}
                className="px-4 py-3 text-left font-medium text-slate-800 border-r border-slate-200 last:border-r-0"
                data-oid="4gapzq9"
              >
                <div
                  className="relative flex flex-col items-center gap-2"
                  data-oid="tro9ko_"
                >
                  <PropertyTypeBadge type={property.type} data-oid="_aoghj8" />
                  <div
                    className="text-slate-900 font-semibold"
                    data-oid="3j_0eg0"
                  >
                    {editingPropertyId === property.id ? (
                      // Inline editing mode
                      <div
                        className="flex items-center gap-2"
                        data-oid="qiyxi:l"
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
                          data-oid="1rtn-xj"
                        />

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleSaveEdit(property.id)}
                          data-oid="bkdtan7"
                        >
                          <Save className="h-3 w-3" data-oid="n2ol1.6" />
                        </Button>
                      </div>
                    ) : hasPropertyData(property) ? (
                      // Property has data - show editable name with save options
                      <div className="text-center" data-oid="0:z.6:6">
                        <div
                          className="flex items-center justify-center gap-2"
                          data-oid="usf0.x6"
                        >
                          <div
                            className="font-semibold text-slate-900"
                            data-oid="7lu04uw"
                          >
                            {property.name}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0"
                            onClick={() => handleStartEdit(property)}
                            data-oid="mu15ed_"
                          >
                            <Edit2 className="h-3 w-3" data-oid="_k21dof" />
                          </Button>
                          {hasPropertyData(property) && (
                            <DropdownMenu data-oid="g-bx3ch">
                              <DropdownMenuTrigger asChild data-oid="gy2_yj8">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0"
                                  data-oid="c.:m:9-"
                                >
                                  <Save
                                    className="h-3 w-3"
                                    data-oid="8ydybki"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent data-oid="dvl3h_j">
                                <DropdownMenuItem
                                  onClick={() =>
                                    onSaveExistingProperty(property)
                                  }
                                  data-oid="m913wjw"
                                >
                                  <Folder
                                    className="h-3 w-3 mr-2"
                                    data-oid="o35rel."
                                  />
                                  Save to Default Folder
                                </DropdownMenuItem>
                                {mockFolders.map((folder) => (
                                  <DropdownMenuItem
                                    key={folder}
                                    onClick={() =>
                                      onSaveExistingProperty(property, folder)
                                    }
                                    data-oid="fi.8pqo"
                                  >
                                    <Folder
                                      className="h-3 w-3 mr-2"
                                      data-oid="skps59w"
                                    />
                                    Save to {folder}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleOpenCreateFolderDialog(property)
                                  }
                                  data-oid="9cwdj9s"
                                >
                                  <Folder
                                    className="h-3 w-3 mr-2"
                                    data-oid="nzjvn.x"
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
                        data-oid="i-n1:zy"
                      />
                    )}
                  </div>
                  {displayProperties.length > 1 && (
                    <button
                      onClick={() => removeProperty(property.id)}
                      aria-label="Remove property"
                      className="absolute top-0 right-0 rounded-full p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      data-oid="dv_l8px"
                    >
                      <X className="h-4 w-4" data-oid="eoa04bz" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-sm" data-oid="4agn7p-">
          <DataRow
            label="Purchase Price"
            properties={displayProperties}
            render={(p) => (
              <CurrencyInput
                value={p.purchasePrice}
                onChange={(v) => updateProperty(p.id, "purchasePrice", v)}
                data-oid=":h:ziwb"
              />
            )}
            data-oid="-rp93sg"
          />

          <DataRow
            label="Loan Tenure (Years)"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2" data-oid=".dd00o0">
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
                  data-oid="xlkgqzh"
                />
              </div>
            )}
            data-oid="_jewuhw"
          />

          <DataRow
            label="Interest Rate %"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2" data-oid="_80k-0g">
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
                  data-oid="rmvcag_"
                />
              </div>
            )}
            data-oid="ej4:0u6"
          />

          <DataRow
            label="LTV %"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2" data-oid="cwvdq3e">
                <ClearableNumberInput
                  value={p.ltv || 75}
                  onChange={(v: number) =>
                    updateProperty(p.id, "ltv", Math.min(Math.max(v, 1), 75))
                  }
                  step={1}
                  className="w-20"
                  data-oid=".n_m1:a"
                />
              </div>
            )}
            data-oid="f10jxh4"
          />

          <DataRow
            label="Bank Loan"
            properties={displayProperties}
            render={(p) => {
              const bankLoan = (p.purchasePrice * (p.ltv || 75)) / 100;
              return (
                <div className="space-y-1" data-oid="jckm_m.">
                  <div
                    className="text-sm font-medium text-slate-900"
                    data-oid="q96kf9q"
                  >
                    {fmtCurrency(bankLoan)}
                  </div>
                </div>
              );
            }}
            data-oid="j1ew8-s"
          />

          <DataRow
            label="Est. TOP (Month-Year)"
            properties={displayProperties}
            render={(p) => (
              <MonthYearPicker
                value={p.estTOP}
                onChange={(date) => updateProperty(p.id, "estTOP", date)}
                disabled={p.type === "Resale"}
                data-oid="dbkiefh"
              />
            )}
            data-oid="k4y.loq"
          />

          <DataRow
            label="Balance Month Aft. TOP (months)"
            properties={displayProperties}
            render={(p) => {
              if (p.type === "Resale") {
                return (
                  <div
                    className="text-sm font-medium text-slate-900"
                    data-oid="09j7oe4"
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
                  data-oid="y37d2ec"
                >
                  {balanceMonths}
                </div>
              );
            }}
            data-oid="6xsz:w_"
          />

          <tr className="h-4 bg-white" data-oid="nkkuh_z">
            <td
              colSpan={displayProperties.length + 1}
              className="border-none"
              data-oid="4egl7x9"
            ></td>
          </tr>
          <SectionRow
            title={mode === "own" ? "Growth" : "Rental & Growth"}
            colSpan={displayProperties.length + 1}
            icon="graph-up-arrow"
            data-oid="m_pqtan"
          />

          <DataRow
            label={`Projected Property Growth`}
            properties={displayProperties}
            render={(p) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth });
              return (
                <DualCell
                  left={
                    <ValueText data-oid="j5u2tn1">
                      {fmtCurrency(d.projectedGrowth)}
                    </ValueText>
                  }
                  right={
                    <LabeledNumber
                      label="Annual%"
                      value={p.annualGrowth}
                      step={0.1}
                      onChange={(v) => updateProperty(p.id, "annualGrowth", v)}
                      data-oid="beewmn:"
                    />
                  }
                  data-oid="mn3td2f"
                />
              );
            }}
            data-oid="mfddvet"
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
                        <ValueText data-oid="g26nw_f">
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
                          data-oid="e6zz_j-"
                        />
                      }
                      data-oid="nepi8ka"
                    />
                  );
                }}
                data-oid="5ojcgj-"
              />

              <DataRow
                label={
                  <div className="flex items-center gap-3" data-oid="bq-kcp_">
                    <div data-oid="opl_aer">
                      <div data-oid="7svzo_y">Vacancy Month</div>
                    </div>
                    <div className="ml-auto" data-oid="f99e7:t">
                      <Select
                        value={String(vacancyMonth)}
                        onValueChange={(v: string) =>
                          setVacancyMonth(Number.parseInt(v))
                        }
                        data-oid="g4hprvw"
                      >
                        <SelectTrigger
                          className="h-8 w-[140px]"
                          data-oid="_:76vus"
                        >
                          <SelectValue data-oid="gg8.al:" />
                        </SelectTrigger>
                        <SelectContent className="max-h-64" data-oid="uj7.:o:">
                          {Array.from({ length: 25 }, (_, i) => (
                            <SelectItem
                              key={i}
                              value={String(i)}
                              data-oid="z1l2c47"
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
                        data-oid="b48by1u"
                      >
                        N/A
                      </div>
                    );
                  }
                  // Show neutral text when no vacancy, red negative value when there is vacancy
                  if (d.vacancyDeduction === 0) {
                    return (
                      <div className="text-slate-600" data-oid="kyl7_ng">
                        $0
                      </div>
                    );
                  }
                  // Display vacancy deduction as negative value in red text since it represents a loss
                  return (
                    <div
                      className="text-red-600 font-medium"
                      data-oid="nhawny8"
                    >
                      -{fmtCurrency(d.vacancyDeduction)}
                    </div>
                  );
                }}
                data-oid="1s-bkth"
              />
            </>
          )}

          <tr className="bg-green-50 hover:bg-green-100" data-oid="dm.kxg2">
            <td
              className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
              data-oid="ze1kw:x"
            >
              Est. Gross Profit
            </td>
            {displayProperties.map((p, i) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth });
              return (
                <td
                  key={p.id}
                  className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === displayProperties.length - 1 ? "last:border-r-0" : ""}`}
                  data-oid="v-b6xha"
                >
                  <ValueText
                    className="text-emerald-700 font-semibold"
                    data-oid="czz4klb"
                  >
                    {fmtCurrency(d.grossProfit)}
                  </ValueText>
                </td>
              );
            })}
          </tr>

          <tr className="h-4 bg-white" data-oid="6.wpvfc">
            <td
              colSpan={displayProperties.length + 1}
              className="border-none"
              data-oid="2onq0p0"
            ></td>
          </tr>
          <SectionRow
            title="Other Expenses"
            colSpan={displayProperties.length + 1}
            icon="piggy-bank"
            data-oid="edxce_2"
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
                  <div className="text-xs text-slate-500" data-oid="7o17g96">
                    N/A
                  </div>
                ) : (
                  <DualCell
                    left={
                      <ValueText data-oid="9y-hdk5">
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
                        data-oid="_:jkb8:"
                      />
                    }
                    data-oid="f0nl8yg"
                  />
                );
              }}
              data-oid="grz9lox"
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
                <div className="space-y-1" data-oid="l--q::q">
                  <div className="font-medium" data-oid=".7olp_r">
                    {fmtCurrency(d.bankInterest)}
                  </div>
                  <div
                    className="text-[11px] text-slate-500"
                    data-oid="ignvw2:"
                  >
                    {p.type === "Resale"
                      ? `Resale Int: ${(p.interestRate || 2.0).toFixed(2)}%`
                      : `BUC Int: ${(p.interestRate || 2.0).toFixed(2)}%`}
                  </div>
                </div>
              );
            }}
            data-oid="flb4lgg"
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
                    <ValueText data-oid="ld:_m:d">
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
                      data-oid="o.5xw8f"
                    />
                  }
                  data-oid="_:27s3z"
                />
              );
            }}
            data-oid="nmo7we2"
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
                data-oid="8wzt97j"
              />
            )}
            data-oid="2tsk_p7"
          />

          {mode === "investment" && (
            <DataRow
              label={
                <div className="flex items-center gap-3" data-oid="h.hsk_-">
                  <span data-oid="rvdz_qp">
                    Income Tax on Net Rental Received
                  </span>
                  <div
                    className="ml-auto flex flex-col items-start gap-1"
                    data-oid="d4a8r2d"
                  >
                    <Select
                      value={selectedTaxId}
                      onValueChange={(id: string) => {
                        const opt = TAX_BRACKETS.find((o) => o.id === id)!;
                        setSelectedTaxId(id);
                        setTaxBracket(opt.rate);
                      }}
                      data-oid="d6eynr_"
                    >
                      <SelectTrigger
                        className="h-8 w-[210px]"
                        data-oid="epwsso5"
                      >
                        {selectedTax ? (
                          <div
                            className="flex w-full items-center justify-between"
                            data-oid="2se1046"
                          >
                            <span className="truncate pr-2" data-oid="y-77d76">
                              {selectedTax.range}
                            </span>
                            <span
                              className="text-right text-slate-600 tabular-nums"
                              data-oid="1wlb7sa"
                            >
                              ({fmtRate(selectedTax.rate)})
                            </span>
                          </div>
                        ) : (
                          <SelectValue
                            placeholder="Select Tax Bracket"
                            data-oid="9f9zt7j"
                          />
                        )}
                      </SelectTrigger>
                      <SelectContent
                        className="max-h-72 w-[200px]"
                        data-oid="cemf4kl"
                      >
                        {TAX_BRACKETS.map((o) => (
                          <SelectItem
                            key={o.id}
                            value={o.id}
                            textValue={`${o.range} (${fmtRate(o.rate)})`}
                            className="relative pl-3 pr-20"
                            data-oid="xcfnmrj"
                          >
                            <span data-oid="hywdsnb">{o.range}</span>
                            <span
                              className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-600"
                              data-oid="5-u4o-w"
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
                <div data-oid="v704kpt">
                  {fmtCurrency(
                    calculateValues(p, { mode, taxBracket, vacancyMonth })
                      .taxOnRental,
                  )}
                </div>
              )}
              data-oid="jiigo4b"
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
                data-oid="v4:-o33"
              />
            )}
            data-oid="xo7v2un"
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
                data-oid="eco5hcw"
              />
            )}
            data-oid="1o5dy33"
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
                  data-oid="o.j.ple"
                />
              )}
              data-oid="jqt1duz"
            />
          )}

          <DataRow
            label="Other Expenses"
            properties={displayProperties}
            render={(p) => (
              <CurrencyInput
                value={p.otherExpenses}
                onChange={(v) => updateProperty(p.id, "otherExpenses", v)}
                data-oid="kaisfg2"
              />
            )}
            data-oid="2645tb-"
          />

          <tr className="bg-red-50 hover:bg-red-100" data-oid="1vhqa3m">
            <td
              className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
              data-oid="4cc-f50"
            >
              Total Other Expenses
            </td>
            {displayProperties.map((p, i) => (
              <td
                key={p.id}
                className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === displayProperties.length - 1 ? "last:border-r-0" : ""}`}
                data-oid="j-fx7r8"
              >
                <ValueText
                  className="text-rose-700 font-semibold"
                  data-oid="7xf9b0n"
                >
                  {fmtCurrency(
                    calculateValues(p, { mode, taxBracket, vacancyMonth })
                      .totalOtherExpenses,
                  )}
                </ValueText>
              </td>
            ))}
          </tr>

          <tr className="h-4 bg-white" data-oid="1:lcc4w">
            <td
              colSpan={displayProperties.length + 1}
              className="border-none"
              data-oid="f-vhc8x"
            ></td>
          </tr>

          <PropertySummary
            properties={displayProperties}
            mode={mode}
            taxBracket={taxBracket}
            vacancyMonth={vacancyMonth}
            data-oid="-2889g_"
          />
        </tbody>
      </table>

      {/* Create Folder Dialog */}
      <Dialog
        open={isCreateFolderDialogOpen}
        onOpenChange={setIsCreateFolderDialogOpen}
        data-oid="mqi9inl"
      >
        <DialogContent className="sm:max-w-md" data-oid=":7p8807">
          <DialogHeader data-oid="1.0:-37">
            <DialogTitle data-oid="pw3fk2:">Create New Folder</DialogTitle>
            <DialogDescription data-oid="-lufz4d">
              Enter a name for the new folder and save your property to it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4" data-oid="3g9.g6g">
            <div className="space-y-2" data-oid="t8hr4u4">
              <Label htmlFor="folder-name" data-oid="c19auro">
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
                data-oid="j0hz-5e"
              />
            </div>
            <div className="flex justify-end space-x-2" data-oid="h26tgf8">
              <Button
                variant="outline"
                onClick={handleCancelCreateFolder}
                data-oid="c2q7nt-"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolderAndSave}
                disabled={!newFolderName.trim()}
                data-oid="v6gy:l0"
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
