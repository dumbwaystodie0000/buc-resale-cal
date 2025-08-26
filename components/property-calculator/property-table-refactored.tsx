"use client";

import { useState, useEffect } from "react";
import type {
  Property,
  Mode,
  SavedProperty,
  PropertyType,
  CommissionRate,
} from "./types";
import { calculateBalanceMonthAftTOP } from "./utils";
import PropertySummary from "./property-summary";
import TableHeader from "./table-header";
import BasicPropertyData from "./basic-property-data";
import GrowthRentalSection from "./growth-rental-section";
import ExpensesSection from "./expenses-section";
import CreateFolderDialog from "./create-folder-dialog";

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

export default function PropertyTableRefactored({
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
    useState<CommissionRate>("");

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

  // Handle holding period change
  const handleHoldingPeriodChange = (newValue: string) => {
    setHoldingPeriodInput(newValue);
    if (newValue && !isNaN(parseFloat(newValue))) {
      const numValue = parseFloat(newValue);
      displayProperties.forEach((p) =>
        updateProperty(p.id, "holdingPeriod", numValue),
      );
    }
  };

  // Handle holding period blur
  const handleHoldingPeriodBlur = () => {
    // If input is empty or invalid, revert to default
    if (!holdingPeriodInput || isNaN(parseFloat(holdingPeriodInput))) {
      const defaultValue = displayProperties[0]?.holdingPeriod || 4;
      setHoldingPeriodInput(String(defaultValue));
      displayProperties.forEach((p) =>
        updateProperty(p.id, "holdingPeriod", defaultValue),
      );
    }
  };

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white"
      data-oid="9.st7bg"
    >
      <table className="w-full border-collapse" data-oid="8:xg92g">
        <colgroup data-oid="-dbby1f">
          <col className="w-[360px]" data-oid="mav2lse" />
          {displayProperties.map((p) => (
            <col key={p.id} className="w-[300px]" data-oid="v0d2006" />
          ))}
        </colgroup>

        <TableHeader
          properties={displayProperties}
          editingPropertyId={editingPropertyId}
          editingName={editingName}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onEditingNameChange={setEditingName}
          onRemoveProperty={removeProperty}
          onSaveExistingProperty={onSaveExistingProperty}
          onCreateFolder={onCreateFolder}
          onSelectSavedProperty={onSelectSavedProperty}
          onCreateNewProperty={onCreateNewProperty}
          hasPropertyData={hasPropertyData}
          onHoldingPeriodChange={handleHoldingPeriodChange}
          onHoldingPeriodBlur={handleHoldingPeriodBlur}
          onOpenCreateFolderDialog={handleOpenCreateFolderDialog}
          data-oid="1:5trv."
        />

        <tbody className="text-sm" data-oid="zcao8fy">
          <BasicPropertyData
            properties={displayProperties}
            mode={mode}
            updateProperty={updateProperty}
            data-oid="ikk95e."
          />

          <GrowthRentalSection
            properties={displayProperties}
            mode={mode}
            taxBracket={taxBracket}
            monthlyRental={monthlyRental}
            balanceMonthsMap={balanceMonthsMap}
            setMonthlyRental={setMonthlyRental}
            updateProperty={updateProperty}
            data-oid="6r8.9n2"
          />

          <ExpensesSection
            properties={displayProperties}
            mode={mode}
            taxBracket={taxBracket}
            monthlyRental={monthlyRental}
            selectedTaxId={selectedTaxId}
            balanceMonthsMap={balanceMonthsMap}
            globalCommissionRate={globalCommissionRate}
            setSelectedTaxId={setSelectedTaxId}
            setTaxBracket={setTaxBracket}
            updateProperty={updateProperty}
            setGlobalCommissionRate={setGlobalCommissionRate}
            data-oid="77big_:"
          />

          <PropertySummary
            properties={displayProperties}
            mode={mode}
            taxBracket={taxBracket}
            monthlyRental={monthlyRental}
            data-oid="6dp7pn:"
          />
        </tbody>
      </table>

      <CreateFolderDialog
        isOpen={isCreateFolderDialogOpen}
        onOpenChange={setIsCreateFolderDialogOpen}
        newFolderName={newFolderName}
        onNewFolderNameChange={setNewFolderName}
        onCreateFolderAndSave={handleCreateFolderAndSave}
        onCancel={handleCancelCreateFolder}
        data-oid="rvn5l6l"
      />
    </div>
  );
}
