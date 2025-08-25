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
      data-oid="9s:b1yg"
    >
      <table className="w-full border-collapse" data-oid="vt77i48">
        <colgroup data-oid="5_d4qj8">
          <col className="w-[360px]" data-oid="h:60_c-" />
          {displayProperties.map((p) => (
            <col key={p.id} className="w-[300px]" data-oid="nh_4:a7" />
          ))}
        </colgroup>

        <thead className="text-sm" data-oid="l8178o4">
          <tr
            className="sticky top-0 z-20 bg-white border-b border-slate-200"
            data-oid="o:n1mxy"
          >
            <th
              className="sticky left-0 z-30 bg-white px-4 py-3 text-left text-slate-700 font-medium border-r border-slate-200"
              data-oid="el9tdl6"
            >
              {""}
            </th>
            {displayProperties.map((property, i) => (
              <th
                key={property.id}
                className="px-4 py-3 text-left font-medium text-slate-800 border-r border-slate-200 last:border-r-0"
                data-oid="htxuh5o"
              >
                <div
                  className="relative flex flex-col items-center gap-2"
                  data-oid="2g9asx:"
                >
                  <PropertyTypeBadge type={property.type} data-oid="87fj-j3" />
                  <div
                    className="text-slate-900 font-semibold"
                    data-oid="gkd50-9"
                  >
                    {editingPropertyId === property.id ? (
                      // Inline editing mode
                      <div
                        className="flex items-center gap-2"
                        data-oid="ferdka1"
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
                          data-oid="-p1p58t"
                        />

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleSaveEdit(property.id)}
                          data-oid="txoushe"
                        >
                          <Save className="h-3 w-3" data-oid="-ilj0-f" />
                        </Button>
                      </div>
                    ) : hasPropertyData(property) ? (
                      // Property has data - show editable name with save options
                      <div className="text-center" data-oid="x-7ui5y">
                        <div
                          className="flex items-center justify-center gap-2"
                          data-oid="g4d6_qz"
                        >
                          <div
                            className="font-semibold text-slate-900"
                            data-oid="1dgouwo"
                          >
                            {property.name}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0"
                            onClick={() => handleStartEdit(property)}
                            data-oid="4ep.537"
                          >
                            <Edit2 className="h-3 w-3" data-oid=".tiggqe" />
                          </Button>
                          {hasPropertyData(property) && (
                            <DropdownMenu data-oid="je.hvhd">
                              <DropdownMenuTrigger asChild data-oid="11yd2fh">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0"
                                  data-oid="_f3k1ie"
                                >
                                  <Save
                                    className="h-3 w-3"
                                    data-oid=".i_34lh"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent data-oid="o0ddjl2">
                                <DropdownMenuItem
                                  onClick={() =>
                                    onSaveExistingProperty(property)
                                  }
                                  data-oid="6:0jdt6"
                                >
                                  <Folder
                                    className="h-3 w-3 mr-2"
                                    data-oid="rwyc8om"
                                  />
                                  Save to Default Folder
                                </DropdownMenuItem>
                                {mockFolders.map((folder) => (
                                  <DropdownMenuItem
                                    key={folder}
                                    onClick={() =>
                                      onSaveExistingProperty(property, folder)
                                    }
                                    data-oid="9a9866c"
                                  >
                                    <Folder
                                      className="h-3 w-3 mr-2"
                                      data-oid="-f46afg"
                                    />
                                    Save to {folder}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleOpenCreateFolderDialog(property)
                                  }
                                  data-oid="s137gru"
                                >
                                  <Folder
                                    className="h-3 w-3 mr-2"
                                    data-oid="6-y:mro"
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
                        data-oid="s4g1ss8"
                      />
                    )}
                  </div>
                  {displayProperties.length > 1 && (
                    <button
                      onClick={() => removeProperty(property.id)}
                      aria-label="Remove property"
                      className="absolute top-0 right-0 rounded-full p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      data-oid="1ibhd0z"
                    >
                      <X className="h-4 w-4" data-oid="ycl69o:" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-sm" data-oid="uj6ig:5">
          <DataRow
            label="Purchase Price"
            properties={displayProperties}
            render={(p) => (
              <CurrencyInput
                value={p.purchasePrice}
                onChange={(v) => updateProperty(p.id, "purchasePrice", v)}
                data-oid="jkwbdu0"
              />
            )}
            data-oid="0716_1o"
          />

          <DataRow
            label="Loan Tenure (Years)"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2" data-oid="erlilh_">
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
                  data-oid="c8y6:ut"
                />
              </div>
            )}
            data-oid="-jjawbs"
          />

          <DataRow
            label="Interest Rate %"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2" data-oid="s930mqk">
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
                  data-oid="tvrxz67"
                />
              </div>
            )}
            data-oid="aapspkm"
          />

          <DataRow
            label="LTV %"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2" data-oid="xl5pg2i">
                <ClearableNumberInput
                  value={p.ltv || 75}
                  onChange={(v: number) =>
                    updateProperty(p.id, "ltv", Math.min(Math.max(v, 1), 75))
                  }
                  step={1}
                  className="w-20"
                  data-oid="kix2mfj"
                />
              </div>
            )}
            data-oid="et4rhly"
          />

          <DataRow
            label="Bank Loan"
            properties={displayProperties}
            render={(p) => {
              const bankLoan = (p.purchasePrice * (p.ltv || 75)) / 100;
              return (
                <div className="space-y-1" data-oid="z67gt8:">
                  <div
                    className="text-sm font-medium text-slate-900"
                    data-oid="v5baorf"
                  >
                    {fmtCurrency(bankLoan)}
                  </div>
                </div>
              );
            }}
            data-oid="8g6osbt"
          />

          <DataRow
            label="Est. TOP (Month-Year)"
            properties={displayProperties}
            render={(p) => (
              <MonthYearPicker
                value={p.estTOP}
                onChange={(date) => updateProperty(p.id, "estTOP", date)}
                disabled={p.type === "Resale"}
                data-oid="est-top-picker"
              />
            )}
            data-oid="est-top-row"
          />

          <DataRow
            label="Balance Month Aft. TOP (months)"
            properties={displayProperties}
            render={(p) => {
              if (p.type === "Resale") {
                return (
                  <div
                    className="text-sm font-medium text-slate-900"
                    data-oid="resale-balance"
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
                  data-oid="buc-balance"
                >
                  {balanceMonths}
                </div>
              );
            }}
            data-oid="balance-month-row"
          />

          <tr className="h-4 bg-white" data-oid="c.1ahwu">
            <td
              colSpan={displayProperties.length + 1}
              className="border-none"
              data-oid="sfh7:nc"
            ></td>
          </tr>
          <SectionRow
            title={mode === "own" ? "Growth" : "Rental & Growth"}
            colSpan={displayProperties.length + 1}
            icon="graph-up-arrow"
            data-oid="c:f.5-f"
          />

          <DataRow
            label={`Projected Property Growth`}
            properties={displayProperties}
            render={(p) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth });
              return (
                <DualCell
                  left={
                    <ValueText data-oid="pbcbwuy">
                      {fmtCurrency(d.projectedGrowth)}
                    </ValueText>
                  }
                  right={
                    <LabeledNumber
                      label="Annual%"
                      value={p.annualGrowth}
                      step={0.1}
                      onChange={(v) => updateProperty(p.id, "annualGrowth", v)}
                      data-oid="fmd.kp9"
                    />
                  }
                  data-oid="..qncdc"
                />
              );
            }}
            data-oid="0qcvz6o"
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
                        <ValueText data-oid="b7pdrom">
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
                          data-oid="xdweg88"
                        />
                      }
                      data-oid="e5-jayy"
                    />
                  );
                }}
                data-oid="18kcs32"
              />

              <DataRow
                label={
                  <div className="flex items-center gap-3" data-oid="i-.q_ha">
                    <div data-oid="zd7tv7-">
                      <div data-oid="rp9zy71">Vacancy Month</div>
                    </div>
                    <div className="ml-auto" data-oid="b-.8axu">
                      <Select
                        value={String(vacancyMonth)}
                        onValueChange={(v: string) =>
                          setVacancyMonth(Number.parseInt(v))
                        }
                        data-oid=":iugaol"
                      >
                        <SelectTrigger
                          className="h-8 w-[140px]"
                          data-oid="bi18d_x"
                        >
                          <SelectValue data-oid="2qnmwkl" />
                        </SelectTrigger>
                        <SelectContent className="max-h-64" data-oid="bkg0p9p">
                          {Array.from({ length: 25 }, (_, i) => (
                            <SelectItem
                              key={i}
                              value={String(i)}
                              data-oid="b2cyjg6"
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
                        data-oid="aetwa0r"
                      >
                        N/A
                      </div>
                    );
                  }
                  // Show neutral text when no vacancy, red negative value when there is vacancy
                  if (d.vacancyDeduction === 0) {
                    return (
                      <div className="text-slate-600" data-oid="h2zcimm">
                        $0
                      </div>
                    );
                  }
                  // Display vacancy deduction as negative value in red text since it represents a loss
                  return (
                    <div
                      className="text-red-600 font-medium"
                      data-oid="8u:p1mt"
                    >
                      -{fmtCurrency(d.vacancyDeduction)}
                    </div>
                  );
                }}
                data-oid="un.38dc"
              />
            </>
          )}

          <tr className="bg-green-50 hover:bg-green-100" data-oid="5:bwm46">
            <td
              className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
              data-oid="e5818oj"
            >
              Est. Gross Profit
            </td>
            {displayProperties.map((p, i) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth });
              return (
                <td
                  key={p.id}
                  className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === displayProperties.length - 1 ? "last:border-r-0" : ""}`}
                  data-oid="o25:lov"
                >
                  <ValueText
                    className="text-emerald-700 font-semibold"
                    data-oid="0sqgf4w"
                  >
                    {fmtCurrency(d.grossProfit)}
                  </ValueText>
                </td>
              );
            })}
          </tr>

          <tr className="h-4 bg-white" data-oid="9-p5xsw">
            <td
              colSpan={displayProperties.length + 1}
              className="border-none"
              data-oid="0ao_.nm"
            ></td>
          </tr>
          <SectionRow
            title="Other Expenses"
            colSpan={displayProperties.length + 1}
            icon="piggy-bank"
            data-oid="f1kt5jd"
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
                  <div className="text-xs text-slate-500" data-oid="_yqo0pt">
                    N/A
                  </div>
                ) : (
                  <DualCell
                    left={
                      <ValueText data-oid="1t6:jnc">
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
                        data-oid="o-kw3te"
                      />
                    }
                    data-oid="acrlniu"
                  />
                );
              }}
              data-oid="c2qke0b"
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
                <div className="space-y-1" data-oid="ugnq_-_">
                  <div className="font-medium" data-oid="k4karc9">
                    {fmtCurrency(d.bankInterest)}
                  </div>
                  <div
                    className="text-[11px] text-slate-500"
                    data-oid="o9f0peh"
                  >
                    {p.type === "Resale"
                      ? `Resale Int: ${(p.interestRate || 2.0).toFixed(2)}%`
                      : `BUC Int: ${(p.interestRate || 2.0).toFixed(2)}%`}
                  </div>
                </div>
              );
            }}
            data-oid="y.4b358"
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
                    <ValueText data-oid="s_xnvpe">
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
                      data-oid="n77fyjx"
                    />
                  }
                  data-oid="zwvqrks"
                />
              );
            }}
            data-oid="7h_nl2t"
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
                data-oid="p571s_c"
              />
            )}
            data-oid=":6dtqq6"
          />

          {mode === "investment" && (
            <DataRow
              label={
                <div className="flex items-center gap-3" data-oid="e089ssu">
                  <span data-oid="_wuasz9">
                    Income Tax on Net Rental Received
                  </span>
                  <div
                    className="ml-auto flex flex-col items-start gap-1"
                    data-oid="syfiqk7"
                  >
                    <Select
                      value={selectedTaxId}
                      onValueChange={(id: string) => {
                        const opt = TAX_BRACKETS.find((o) => o.id === id)!;
                        setSelectedTaxId(id);
                        setTaxBracket(opt.rate);
                      }}
                      data-oid=":lf8wb5"
                    >
                      <SelectTrigger
                        className="h-8 w-[210px]"
                        data-oid="m::fcvz"
                      >
                        {selectedTax ? (
                          <div
                            className="flex w-full items-center justify-between"
                            data-oid="c6k6cwg"
                          >
                            <span className="truncate pr-2" data-oid="s99nps3">
                              {selectedTax.range}
                            </span>
                            <span
                              className="text-right text-slate-600 tabular-nums"
                              data-oid="l2kdumj"
                            >
                              ({fmtRate(selectedTax.rate)})
                            </span>
                          </div>
                        ) : (
                          <SelectValue
                            placeholder="Select Tax Bracket"
                            data-oid="kf8wdui"
                          />
                        )}
                      </SelectTrigger>
                      <SelectContent
                        className="max-h-72 w-[200px]"
                        data-oid="kskckzx"
                      >
                        {TAX_BRACKETS.map((o) => (
                          <SelectItem
                            key={o.id}
                            value={o.id}
                            textValue={`${o.range} (${fmtRate(o.rate)})`}
                            className="relative pl-3 pr-20"
                            data-oid="4z0mq:3"
                          >
                            <span data-oid="fq13.g2">{o.range}</span>
                            <span
                              className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-600"
                              data-oid="7ax025k"
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
                <div data-oid="wxd3_pc">
                  {fmtCurrency(
                    calculateValues(p, { mode, taxBracket, vacancyMonth })
                      .taxOnRental,
                  )}
                </div>
              )}
              data-oid="_.zd6-_"
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
                data-oid="ncd3ji9"
              />
            )}
            data-oid="jlw5ftm"
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
                data-oid="81e6njt"
              />
            )}
            data-oid="v111exi"
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
                  data-oid="lsf2ne6"
                />
              )}
              data-oid="erysc8w"
            />
          )}

          <DataRow
            label="Other Expenses"
            properties={displayProperties}
            render={(p) => (
              <CurrencyInput
                value={p.otherExpenses}
                onChange={(v) => updateProperty(p.id, "otherExpenses", v)}
                data-oid=":0a9eyw"
              />
            )}
            data-oid="15:7pbt"
          />

          <tr className="bg-red-50 hover:bg-red-100" data-oid="q.ztvsr">
            <td
              className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle"
              data-oid="sww8m01"
            >
              Total Other Expenses
            </td>
            {displayProperties.map((p, i) => (
              <td
                key={p.id}
                className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === displayProperties.length - 1 ? "last:border-r-0" : ""}`}
                data-oid="oq8v_.g"
              >
                <ValueText
                  className="text-rose-700 font-semibold"
                  data-oid="o:oor0w"
                >
                  {fmtCurrency(
                    calculateValues(p, { mode, taxBracket, vacancyMonth })
                      .totalOtherExpenses,
                  )}
                </ValueText>
              </td>
            ))}
          </tr>

          <tr className="h-4 bg-white" data-oid="pknl35h">
            <td
              colSpan={displayProperties.length + 1}
              className="border-none"
              data-oid="-fpia4:"
            ></td>
          </tr>

          <PropertySummary
            properties={displayProperties}
            mode={mode}
            taxBracket={taxBracket}
            vacancyMonth={vacancyMonth}
            data-oid="uzjhawc"
          />
        </tbody>
      </table>

      {/* Create Folder Dialog */}
      <Dialog
        open={isCreateFolderDialogOpen}
        onOpenChange={setIsCreateFolderDialogOpen}
        data-oid="kid0.up"
      >
        <DialogContent className="sm:max-w-md" data-oid="bk287di">
          <DialogHeader data-oid=":ho-0r1">
            <DialogTitle data-oid="ledvq4i">Create New Folder</DialogTitle>
            <DialogDescription data-oid="9p-djv1">
              Enter a name for the new folder and save your property to it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4" data-oid="k.3eak8">
            <div className="space-y-2" data-oid="k7rq533">
              <Label htmlFor="folder-name" data-oid="t44k0.3">
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
                data-oid="p5w:b25"
              />
            </div>
            <div className="flex justify-end space-x-2" data-oid="v1n5ajl">
              <Button
                variant="outline"
                onClick={handleCancelCreateFolder}
                data-oid="zsq10yv"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolderAndSave}
                disabled={!newFolderName.trim()}
                data-oid="wlsk37x"
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
