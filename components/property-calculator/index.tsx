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
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
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
    <div className="font-sans" data-oid="daxgv1o">
      <div className="mb-4" data-oid="_ifhiz2">
        <h1
          className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight"
          data-oid="rxz_kp6"
        >
          Property Comparison Calculator
        </h1>
        <p className="text-sm text-slate-600" data-oid="18qp4-9">
          Compare up to 3 properties side by side
        </p>
      </div>

      <div className="mb-3" data-oid="6mfv47.">
        <Tabs
          value={mode}
          onValueChange={(v: string) => setMode(v as Mode)}
          className="mb-0"
          data-oid="-a9.t:u"
        >
          <TabsList className="h-11 md:h-12 p-1" data-oid="qx62sta">
            <TabsTrigger
              value="own"
              className="px-5 md:px-6 py-2.5 md:py-3 text-[13px] md:text-[14px] font-semibold"
              data-oid="7dd0_ex"
            >
              Own Stay Analysis
            </TabsTrigger>
            <TabsTrigger
              value="investment"
              className="px-5 md:px-6 py-2.5 md:py-3 text-[13px] md:text-[14px] font-semibold"
              data-oid="xkk10ka"
            >
              Investment Analysis
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex gap-6" data-oid="66l-z90">
        <div className="flex-1" data-oid="jls5a7r">
          <PropertyTable
            properties={properties}
            mode={mode}
            taxBracket={taxBracket}
            vacancyMonth={vacancyMonth}
            selectedTaxId={selectedTaxId}
            setSelectedTaxId={setSelectedTaxId}
            setTaxBracket={setTaxBracket}
            setVacancyMonth={setVacancyMonth}
            removeProperty={removeProperty}
            updateProperty={updateProperty}
            onSelectSavedProperty={handleSelectSavedProperty}
            onCreateNewProperty={handleCreateNewProperty}
            onCreateFolder={createFolder}
            onSaveExistingProperty={handleSaveExistingProperty}
            // showThirdColumn={showThirdColumn} // This line is removed
            data-oid="maerta5"
          />
        </div>

        {properties.length < 3 && (
          <div
            className="w-80 flex flex-col items-center justify-start p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50"
            data-oid="h0i-3h0"
          >
            <div className="text-center mb-6" data-oid="rxbieso">
              <div
                className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto"
                data-oid="2ff6zho"
              >
                <Plus className="h-6 w-6 text-emerald-600" data-oid="az5dr3z" />
              </div>
              <AddPropertyDropdown
                onAddProperty={handleAddProperty}
                onCreateNewEntry={handleCreateNewEntry}
                folders={folders}
                onCreateFolder={createFolder}
                disabled={false}
                data-oid=".n0s-8z"
              />

              <p className="text-sm text-slate-600 mt-4" data-oid="a0wd5pb">
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
        data-oid="h5m7d_p"
      />

      {/* Remove Property Confirmation Dialog */}
      <Dialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
        data-oid="m3f42d4"
      >
        <DialogContent className="sm:max-w-md" data-oid="0gdfv8_">
          <DialogHeader data-oid="-_faxlw">
            <DialogTitle data-oid="dcda_4i">Remove Property</DialogTitle>
            <DialogDescription data-oid="ifdq4jb">
              Are you sure you want to remove{" "}
              {propertyToRemove?.name || `Property #${propertyToRemove?.id}`}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4" data-oid="6a7w9zd">
            <Button
              variant="outline"
              onClick={() => setIsRemoveDialogOpen(false)}
              data-oid="3fxqvv_"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemoveProperty}
              data-oid=".8tk5vk"
            >
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
