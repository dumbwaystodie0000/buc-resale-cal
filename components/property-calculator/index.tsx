"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Property, Mode, PropertyType } from "@/components/property-calculator/types"
import { defaultPropertyBase } from "@/components/property-calculator/constants"
import PropertyTable from "@/components/property-calculator/property-table"
import AddPropertyDropdown from "@/components/property-calculator/add-property-dropdown"
import CreatePropertyDialog from "@/components/property-calculator/create-property-dialog"

export default function PropertyCalculator() {
  const [selectedTaxId, setSelectedTaxId] = useState<string | undefined>(undefined)
  const [taxBracket, setTaxBracket] = useState<number>(0)
  const [vacancyMonth, setVacancyMonth] = useState<number>(0)
  const [properties, setProperties] = useState<Property[]>([
    { ...defaultPropertyBase, id: Date.now().toString(), name: "Property #1", type: "BUC" },
    { ...defaultPropertyBase, id: (Date.now() + 1).toString(), name: "Property #2", type: "Resale" }
  ])
  const [mode, setMode] = useState<Mode>("own")
  const [folders, setFolders] = useState<string[]>(["Singapore Properties", "Investment Portfolio"])
  
  // Dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [pendingPropertyType, setPendingPropertyType] = useState<PropertyType>("BUC")

  const addProperty = (type: PropertyType, name: string, folder?: string) => {
    if (properties.length < 3) {
      const newProperty: Property = { 
        ...defaultPropertyBase, 
        id: Date.now().toString(), 
        name: name, 
        type: type 
      }
      setProperties((prev) => [...prev, newProperty])
    }
  }

  const handleAddProperty = (type: PropertyType, name: string, folder?: string) => {
    // If folder is provided, we could store it with the property
    // For now, we'll just add the property
    addProperty(type, name, folder)
  }

  const handleCreateNewEntry = (type: PropertyType) => {
    setPendingPropertyType(type)
    setIsCreateDialogOpen(true)
  }

  const handleCreatePropertyFromDialog = (name: string, folder?: string) => {
    addProperty(pendingPropertyType, name, folder)
  }

  const createFolder = (name: string) => {
    if (!folders.includes(name)) {
      setFolders(prev => [...prev, name])
    }
  }

  const removeProperty = (id: string) => {
    if (properties.length > 1) {
      setProperties((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const updateProperty = (id: string, field: keyof Property, value: any) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  return (
    <div className="font-sans">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Property Comparison Calculator</h1>
        <p className="text-sm text-slate-600">
          Compare up to 3 properties side by side
          {properties.length < 3 && (
            <span className="ml-2 text-emerald-600 font-medium">
              ({3 - properties.length} slot{3 - properties.length !== 1 ? 's' : ''} available)
            </span>
          )}
        </p>
      </div>

      <div className="mb-3">
        <Tabs value={mode} onValueChange={(v: string) => setMode(v as Mode)} className="mb-0">
          <TabsList className="h-11 md:h-12 p-1">
            <TabsTrigger value="own" className="px-5 md:px-6 py-2.5 md:py-3 text-[13px] md:text-[14px] font-semibold">
              Own Stay Analysis
            </TabsTrigger>
            <TabsTrigger
              value="investment"
              className="px-5 md:px-6 py-2.5 md:py-3 text-[13px] md:text-[14px] font-semibold"
            >
              Investment Analysis
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mb-4 flex justify-end relative overflow-visible z-10">
        <AddPropertyDropdown
          onAddProperty={handleAddProperty}
          onCreateNewEntry={handleCreateNewEntry}
          folders={folders}
          onCreateFolder={createFolder}
          disabled={properties.length >= 3}
        />
      </div>

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
      />

      <CreatePropertyDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onConfirm={handleCreatePropertyFromDialog}
        propertyType={pendingPropertyType}
        folders={folders}
        onCreateFolder={createFolder}
      />
    </div>
  )
}
