"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Property, Mode } from "@/components/property-calculator/types"
import { defaultPropertyBase } from "@/components/property-calculator/constants"
import PropertyTable from "@/components/property-calculator/property-table"

export default function PropertyCalculator() {
  const [selectedTaxId, setSelectedTaxId] = useState<string | undefined>(undefined)
  const [taxBracket, setTaxBracket] = useState<number>(0)
  const [vacancyMonth, setVacancyMonth] = useState<number>(0)
  const [properties, setProperties] = useState<Property[]>([
    { ...defaultPropertyBase, id: Date.now().toString(), name: "Property #1", type: "BUC" },
    { ...defaultPropertyBase, id: (Date.now() + 1).toString(), name: "Property #2", type: "Resale" }
  ])
  const [mode, setMode] = useState<Mode>("own")

  const addProperty = () => {
    if (properties.length < 3) {
      const newProperty: Property = { ...defaultPropertyBase, id: Date.now().toString(), name: `Property #${properties.length + 1}`, type: "BUC" }
      setProperties((prev) => [...prev, newProperty])
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
        <p className="text-sm text-slate-600">Compare up to 3 properties side by side</p>
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

      <div className="mb-4 flex justify-end">
        <Button
          size="sm"
          onClick={addProperty}
          disabled={properties.length >= 3}
          className="h-8 md:h-9 gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
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
    </div>
  )
}
