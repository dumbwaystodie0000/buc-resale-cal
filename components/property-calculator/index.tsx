"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Property,
  Mode,
  PropertyType,
  SavedProperty,
} from "@/components/property-calculator/types";
import { defaultPropertyBase } from "@/components/property-calculator/constants";
import PropertyTable from "@/components/property-calculator/property-table";
import AddPropertyDropdown from "@/components/property-calculator/add-property-dropdown";
import CreatePropertyDialog from "@/components/property-calculator/create-property-dialog";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function PropertyCalculator() {
  const [selectedTaxId, setSelectedTaxId] = useState<string | undefined>(
    undefined,
  );
  const [taxBracket, setTaxBracket] = useState<number>(0);
  const [vacancyMonth, setVacancyMonth] = useState<number>(0);
  const [monthlyRental, setMonthlyRental] = useState<number>(0);
  const [properties, setProperties] = useState<Property[]>([
    {
      ...defaultPropertyBase,
      id: Date.now().toString(),
      name: "Property #1",
      type: "BUC",
    },
    {
      ...defaultPropertyBase,
      id: (Date.now() + 1).toString(),
      name: "Property #2",
      type: "Resale",
    },
  ]);
  const [mode, setMode] = useState<Mode>("own");
  const [folders, setFolders] = useState<string[]>([
    "Singapore Properties",
    "Investment Portfolio",
  ]);

  // Dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [pendingPropertyType, setPendingPropertyType] =
    useState<PropertyType>("BUC");

  // Remove confirmation dialog state
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [propertyToRemove, setPropertyToRemove] = useState<Property | null>(
    null,
  );

  const addProperty = (type: PropertyType, name: string, folder?: string) => {
    if (properties.length < 3) {
      const newProperty: Property = {
        ...defaultPropertyBase,
        id: Date.now().toString(),
        name: name,
        type: type,
      };
      setProperties((prev) => [...prev, newProperty]);
    }
  };

  const handleAddProperty = (
    type: PropertyType,
    name: string,
    folder?: string,
  ) => {
    // If folder is provided, we could store it with the property
    // For now, we'll just add the property
    addProperty(type, name, folder);
  };

  const handleCreateNewEntry = (type: PropertyType) => {
    setPendingPropertyType(type);
    setIsCreateDialogOpen(true);
  };

  const handleCreatePropertyFromDialog = (name: string, folder?: string) => {
    addProperty(pendingPropertyType, name, folder);
  };

  const createFolder = (name: string) => {
    if (!folders.includes(name)) {
      setFolders((prev) => [...prev, name]);
    }
  };

  const removeProperty = (id: string) => {
    if (properties.length > 1) {
      const property = properties.find((p) => p.id === id);
      if (property) {
        setPropertyToRemove(property);
        setIsRemoveDialogOpen(true);
      }
    }
  };

  const confirmRemoveProperty = () => {
    if (propertyToRemove && properties.length > 1) {
      setProperties((prev) => prev.filter((p) => p.id !== propertyToRemove.id));
      setIsRemoveDialogOpen(false);
      setPropertyToRemove(null);
    }
  };

  const updateProperty = (id: string, field: keyof Property, value: any) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updatedProperty = { ...p, [field]: value };

          // Auto-calculate agent commission when commission rate, monthly rental, estTOP, holding period, or property type changes
          if (
            (field === "commissionRate" ||
              field === "monthlyRental" ||
              field === "estTOP" ||
              field === "holdingPeriod" ||
              field === "type") &&
            (field === "commissionRate" ? value : p.commissionRate) !==
              "other" &&
            (field === "commissionRate" ? value : p.commissionRate) !== ""
          ) {
            // Handle "none" option or empty string - clear the commission
            if (
              (field === "commissionRate" ? value : p.commissionRate) ===
                "none" ||
              (field === "commissionRate" ? value : p.commissionRate) === ""
            ) {
              updatedProperty.agentCommission = 0;
            } else {
              const rateMultiplier = parseFloat(
                field === "commissionRate" ? value : p.commissionRate,
              );
              const monthlyRent =
                field === "monthlyRental" ? value : p.monthlyRental;

              const propertyType = field === "type" ? value : p.type;

              if (propertyType === "BUC") {
                // For BUC properties, calculate based on balance months after TOP
                const currentDate = new Date();
                const topDate = field === "estTOP" ? value : p.estTOP;
                if (topDate) {
                  const monthsToTOP =
                    (topDate.getFullYear() - currentDate.getFullYear()) * 12 +
                    (topDate.getMonth() - currentDate.getMonth());
                  const holdingPeriodMonths =
                    (field === "holdingPeriod" ? value : p.holdingPeriod) * 12;
                  const balanceMonths = Math.max(
                    0,
                    holdingPeriodMonths - monthsToTOP,
                  );

                  if (balanceMonths > 0) {
                    const annualCommission = monthlyRent * rateMultiplier;
                    const totalCommission =
                      annualCommission * (balanceMonths / 12);
                    updatedProperty.agentCommission =
                      Math.round(totalCommission);
                  }
                }
              } else {
                // For Resale properties, calculate for full holding period
                const annualCommission = monthlyRent * rateMultiplier;
                const holdingPeriod =
                  field === "holdingPeriod" ? value : p.holdingPeriod;
                updatedProperty.agentCommission = Math.round(
                  annualCommission * holdingPeriod,
                );
              }
            }
          }

          return updatedProperty;
        }
        return p;
      }),
    );
  };

  const handleSelectSavedProperty = (property: SavedProperty) => {
    // First, try to find an existing property column with the same type to update
    const existingPropertyIndex = properties.findIndex(
      (p) => p.type === property.type,
    );

    if (existingPropertyIndex !== -1) {
      // Update existing property column
      setProperties((prev) =>
        prev.map((p, index) => {
          if (index === existingPropertyIndex) {
            return {
              ...p,
              name: property.name,
              type: property.type,
              purchasePrice: property.purchasePrice,
            };
          }
          return p;
        }),
      );
    } else if (properties.length < 3) {
      // Add a new property if we have less than 3 and no matching type exists
      const newProperty: Property = {
        ...defaultPropertyBase,
        id: `new-${Date.now()}`,
        name: property.name,
        type: property.type,
        purchasePrice: property.purchasePrice,
      };
      setProperties((prev) => [...prev, newProperty]);
    }
    // If we have 3 properties and no matching type, don't add anything
  };

  const handleCreateNewProperty = (
    name: string,
    type: PropertyType,
    folder?: string,
  ) => {
    // Check if this is for the third column (new property)
    if (properties.length === 2) {
      // Add a new property for the third column
      const newProperty: Property = {
        ...defaultPropertyBase,
        id: `third-${Date.now()}`, // Use a unique ID for the third property
        name: name,
        type: type,
      };
      setProperties((prev) => [...prev, newProperty]);
    } else {
      // Update existing property
      setProperties((prev) =>
        prev.map((p) => {
          if (p.type === type) {
            return {
              ...p,
              name: name,
              type: type,
            };
          }
          return p;
        }),
      );
    }
  };

  const handleSaveExistingProperty = (property: Property, folder?: string) => {
    // Convert the current property to a SavedProperty format
    const savedProperty: SavedProperty = {
      id: Date.now().toString(),
      name: property.name,
      type: property.type,
      purchasePrice: property.purchasePrice,
      folder: folder || "Default",
    };

    // In a real app, you would save this to your backend/database
    console.log("Saving property to folder:", savedProperty);

    // Optionally, you could add it to a local state of saved properties
    // setSavedProperties(prev => [...prev, savedProperty])
  };

  return (
    <div className="font-sans" data-oid="x3r6umr">
      <div className="mb-4" data-oid="588w6pn">
        <h1
          className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight"
          data-oid="fc.bukb"
        >
          Property Comparison Calculator
        </h1>
        <p className="text-sm text-slate-600" data-oid="w-mmxjy">
          Compare up to 3 properties side by side
        </p>
      </div>

      <div className="mb-3" data-oid=":_8m9dt">
        <Tabs
          value={mode}
          onValueChange={(v: string) => setMode(v as Mode)}
          className="mb-0"
          data-oid="9kjdmhr"
        >
          <TabsList className="h-11 md:h-12 p-1" data-oid="nrd7983">
            <TabsTrigger
              value="own"
              className="px-5 md:px-6 py-2.5 md:py-3 text-[13px] md:text-[14px] font-semibold"
              data-oid="3x03xdo"
            >
              Own Stay Analysis
            </TabsTrigger>
            <TabsTrigger
              value="investment"
              className="px-5 md:px-6 py-2.5 md:py-3 text-[13px] md:text-[14px] font-semibold"
              data-oid="oxuwpg9"
            >
              Investment Analysis
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex gap-6" data-oid="71kkejq">
        <div className="flex-1" data-oid="uwk2o7u">
          <PropertyTable
            properties={properties}
            mode={mode}
            taxBracket={taxBracket}
            vacancyMonth={vacancyMonth}
            monthlyRental={monthlyRental}
            selectedTaxId={selectedTaxId}
            setSelectedTaxId={setSelectedTaxId}
            setTaxBracket={setTaxBracket}
            setVacancyMonth={setVacancyMonth}
            setMonthlyRental={setMonthlyRental}
            removeProperty={removeProperty}
            updateProperty={updateProperty}
            onSelectSavedProperty={handleSelectSavedProperty}
            onCreateNewProperty={handleCreateNewProperty}
            onCreateFolder={createFolder}
            onSaveExistingProperty={handleSaveExistingProperty}
            // showThirdColumn={showThirdColumn} // This line is removed
            data-oid="gan.n74"
          />
        </div>

        {properties.length < 3 && (
          <div
            className="w-80 flex flex-col items-center justify-start p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50"
            data-oid="oi17ms_"
          >
            <div className="text-center mb-6" data-oid="lvkb2pa">
              <div
                className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto"
                data-oid="gzl5c2i"
              >
                <Plus className="h-6 w-6 text-emerald-600" data-oid="tp13qsh" />
              </div>
              <AddPropertyDropdown
                onAddProperty={handleAddProperty}
                onCreateNewEntry={handleCreateNewEntry}
                folders={folders}
                onCreateFolder={createFolder}
                disabled={false}
                data-oid="94-ikgd"
              />

              <p className="text-sm text-slate-600 mt-4" data-oid="tarm-ra">
                Click here to add a New Project
              </p>
            </div>
          </div>
        )}
      </div>

      <CreatePropertyDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onConfirm={handleCreatePropertyFromDialog}
        propertyType={pendingPropertyType}
        folders={folders}
        onCreateFolder={createFolder}
        data-oid="08vljv3"
      />

      {/* Remove Property Confirmation Dialog */}
      <Dialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
        data-oid=".0guh:k"
      >
        <DialogContent className="sm:max-w-md" data-oid="oyuvgez">
          <DialogHeader data-oid="b6vxrmo">
            <DialogTitle data-oid="55ot_6l">Remove Property</DialogTitle>
            <DialogDescription data-oid="dd2g3c-">
              Are you sure you want to remove{" "}
              {propertyToRemove?.name || `Property #${propertyToRemove?.id}`}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4" data-oid="hm8yjbq">
            <Button
              variant="outline"
              onClick={() => setIsRemoveDialogOpen(false)}
              data-oid="vkpsr2u"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemoveProperty}
              data-oid="eolbpz4"
            >
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
