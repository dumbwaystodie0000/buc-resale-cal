"use client"

import { useState } from "react"
import { X, Edit2, Save, Folder } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Property, Mode, SavedProperty, PropertyType } from "./types"
import { TAX_BRACKETS, defaultPropertyBase, mockFolders } from "./constants"
import { calculateValues } from "./calculations"
import { fmtCurrency, fmtRate } from "./utils"
import { PropertyTypeBadge, CurrencyInput, LabeledCurrency, LabeledNumber, DualCell, ValueText, ClearableNumberInput } from "./ui-components"
import { SectionRow, DataRow, MaybeNADataRow } from "./table-components"
import PropertySummary from "./property-summary"
import SelectPropertyButton from "./select-property-button"

interface PropertyTableProps {
  properties: Property[]
  mode: Mode
  taxBracket: number
  vacancyMonth: number
  selectedTaxId: string | undefined
  setSelectedTaxId: (id: string) => void
  setTaxBracket: (rate: number) => void
  setVacancyMonth: (months: number) => void
  removeProperty: (id: string) => void
  updateProperty: (id: string, field: keyof Property, value: any) => void
  onSelectSavedProperty: (property: SavedProperty) => void
  onCreateNewProperty: (name: string, type: PropertyType, folder?: string) => void
  onCreateFolder: (name: string) => void
  onSaveExistingProperty: (property: Property, folder?: string) => void
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
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  
  // State for create folder dialog
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [propertyToSave, setPropertyToSave] = useState<Property | null>(null)

  // Selected tax option (for rendering the trigger with left/right text)
  const selectedTax = selectedTaxId ? TAX_BRACKETS.find((o) => o.id === selectedTaxId) : undefined

  // Use the actual properties array - when showThirdColumn is true, properties should already have 3 items
  const displayProperties = properties

  // Handle starting to edit a property name
  const handleStartEdit = (property: Property) => {
    setEditingPropertyId(property.id)
    setEditingName(property.name)
  }

  // Handle saving the edited property name
  const handleSaveEdit = (propertyId: string) => {
    if (editingName.trim()) {
      updateProperty(propertyId, "name", editingName.trim())
    }
    setEditingPropertyId(null)
    setEditingName("")
  }

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setEditingPropertyId(null)
    setEditingName("")
  }

  // Check if a property has meaningful data (not just default values)
  const hasPropertyData = (property: Property) => {
    return property.purchasePrice > 0 || 
           property.loanTenure !== 30 || 
           property.interestRate !== 2.00 || 
           property.ltv !== 75 ||
           property.annualGrowth > 0 || 
           property.monthlyRental > 0 || 
           property.monthlyMaintenance > 0 || 
           property.propertyTax > 0 || 
           property.minorRenovation > 0 || 
           property.furnitureFittings > 0 ||
           (property.name && property.name !== `Property #${properties.findIndex(p => p.id === property.id) + 1}`)
  }

  // Handle opening create folder dialog
  const handleOpenCreateFolderDialog = (property: Property) => {
    setPropertyToSave(property)
    setNewFolderName("")
    setIsCreateFolderDialogOpen(true)
  }

  // Handle creating new folder and saving property
  const handleCreateFolderAndSave = () => {
    if (newFolderName.trim() && propertyToSave) {
      // First create the folder
      onCreateFolder(newFolderName.trim())
      // Then save the property to the new folder
      onSaveExistingProperty(propertyToSave, newFolderName.trim())
      // Close dialog and reset state
      setIsCreateFolderDialogOpen(false)
      setNewFolderName("")
      setPropertyToSave(null)
    }
  }

  // Handle canceling create folder dialog
  const handleCancelCreateFolder = () => {
    setIsCreateFolderDialogOpen(false)
    setNewFolderName("")
    setPropertyToSave(null)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <table className="w-full border-collapse">
        <colgroup>
          <col className="w-[360px]" />
          {displayProperties.map((p) => (
            <col key={p.id} className="w-[300px]" />
          ))}
        </colgroup>

        <thead className="text-sm">
          <tr className="sticky top-0 z-20 bg-white border-b border-slate-200">
            <th className="sticky left-0 z-30 bg-white px-4 py-3 text-left text-slate-700 font-medium border-r border-slate-200">
              {''}
            </th>
            {displayProperties.map((property, i) => (
              <th
                key={property.id}
                className="px-4 py-3 text-left font-medium text-slate-800 border-r border-slate-200 last:border-r-0"
              >
                <div className="relative flex flex-col items-center gap-2">
                  <PropertyTypeBadge type={property.type} />
                  <div className="text-slate-900 font-semibold">
                    {editingPropertyId === property.id ? (
                      // Inline editing mode
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-7 text-xs text-center"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveEdit(property.id)
                            } else if (e.key === 'Escape') {
                              handleCancelEdit()
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleSaveEdit(property.id)}
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : hasPropertyData(property) ? (
                      // Property has data - show editable name with save options
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="font-semibold text-slate-900">{property.name}</div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0"
                            onClick={() => handleStartEdit(property)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          {hasPropertyData(property) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => onSaveExistingProperty(property)}>
                                  <Folder className="h-3 w-3 mr-2" />
                                  Save to Default Folder
                                </DropdownMenuItem>
                                {mockFolders.map((folder) => (
                                  <DropdownMenuItem 
                                    key={folder}
                                    onClick={() => onSaveExistingProperty(property, folder)}
                                  >
                                    <Folder className="h-3 w-3 mr-2" />
                                    Save to {folder}
                                  </DropdownMenuItem>
                                ))}
                                                              <DropdownMenuItem onClick={() => handleOpenCreateFolderDialog(property)}>
                                <Folder className="h-3 w-3 mr-2" />
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
                      />
                    )}
                  </div>
                  {displayProperties.length > 1 && (
                    <button
                      onClick={() => removeProperty(property.id)}
                      aria-label="Remove property"
                      className="absolute top-0 right-0 rounded-full p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-sm">
          <DataRow
            label="Purchase Price"
            properties={displayProperties}
            render={(p) => (
              <CurrencyInput value={p.purchasePrice} onChange={(v) => updateProperty(p.id, "purchasePrice", v)} />
            )}
          />
          <DataRow
            label="Loan Tenure (Years)"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2">
                <ClearableNumberInput 
                  value={p.loanTenure || 30} 
                  onChange={(v: number) => updateProperty(p.id, "loanTenure", Math.min(Math.max(v, 1), 35))} 
                  step={1}
                  className="w-20"
                />
              </div>
            )}
          />
          <DataRow
            label="Interest Rate %"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2">
                <ClearableNumberInput 
                  value={p.interestRate || 2.00} 
                  onChange={(v: number) => updateProperty(p.id, "interestRate", Math.min(Math.max(v, 0.01), 5.00))} 
                  step={0.01}
                  className="w-20"
                />
              </div>
            )}
          />
          <DataRow
            label="LTV %"
            properties={displayProperties}
            render={(p) => (
              <div className="flex items-center gap-2">
                <ClearableNumberInput 
                  value={p.ltv || 75} 
                  onChange={(v: number) => updateProperty(p.id, "ltv", Math.min(Math.max(v, 1), 75))} 
                  step={1}
                  className="w-20"
                />
              </div>
              )}
          />
          <DataRow
            label="Bank Loan"
            properties={displayProperties}
            render={(p) => {
              const bankLoan = (p.purchasePrice * (p.ltv || 75)) / 100
              return (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-900">
                    {fmtCurrency(bankLoan)}
                  </div>
                </div>
              )
            }}
          />

          <tr className="h-4 bg-white">
            <td colSpan={displayProperties.length + 1} className="border-none"></td>
          </tr>
          <SectionRow title={mode === "own" ? "Growth" : "Rental & Growth"} colSpan={displayProperties.length + 1} icon="graph-up-arrow" />
          <DataRow
            label={`Projected Property Growth (4yrs)`}
            properties={displayProperties}
            render={(p) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth })
              return (
                <DualCell
                  left={<ValueText>{fmtCurrency(d.projectedGrowth)}</ValueText>}
                  right={
                    <LabeledNumber
                      label="Annual%"
                      value={p.annualGrowth}
                      step={0.1}
                      onChange={(v) => updateProperty(p.id, "annualGrowth", v)}
                    />
                  }
                />
              )
            }}
          />

          {mode === "investment" && (
            <>
              <MaybeNADataRow
                label={`Rental Income (4yrs)`}
                properties={displayProperties}
                fieldKey="monthlyRental" // Use monthlyRental as the key to check for N/A
                mode={mode}
                renderInput={(p) => {
                  const d = calculateValues(p, { mode, taxBracket, vacancyMonth })
                  return (
                    <DualCell
                      left={<ValueText>{fmtCurrency(d.rentalIncome)}</ValueText>}
                      right={
                        <LabeledCurrency
                          label="Monthly"
                          value={p.monthlyRental}
                          step={100}
                          onChange={(v) => updateProperty(p.id, "monthlyRental", v)}
                        />
                      }
                    />
                  )
                }}
              />

              <DataRow
                label={
                  <div className="flex items-center gap-3">
                    <div>
                      <div>Vacancy Month</div>
                    </div>
                    <div className="ml-auto">
                      <Select value={String(vacancyMonth)} onValueChange={(v: string) => setVacancyMonth(Number.parseInt(v))}>
                        <SelectTrigger className="h-8 w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          {Array.from({ length: 25 }, (_, i) => (
                            <SelectItem key={i} value={String(i)}>
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
                  const d = calculateValues(p, { mode, taxBracket, vacancyMonth })
                  // Check if property type is BUC to display N/A
                  if (p.type === "BUC") {
                    return <div className="text-xs text-slate-500">N/A</div>
                  }
                  // Show neutral text when no vacancy, red negative value when there is vacancy
                  if (d.vacancyDeduction === 0) {
                    return <div className="text-slate-600">$0</div>
                  }
                  // Display vacancy deduction as negative value in red text since it represents a loss
                  return <div className="text-red-600 font-medium">-{fmtCurrency(d.vacancyDeduction)}</div>
                }}
              />
            </>
          )}

          <tr className="bg-green-50 hover:bg-green-100">
            <td className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle">
              Est. Gross Profit
            </td>
            {displayProperties.map((p, i) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth })
              return (
                <td
                  key={p.id}
                  className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === displayProperties.length - 1 ? "last:border-r-0" : ""}`}
                >
                  <ValueText className="text-emerald-700 font-semibold">{fmtCurrency(d.grossProfit)}</ValueText>
                </td>
              )
            })}
          </tr>

          <tr className="h-4 bg-white">
            <td colSpan={displayProperties.length + 1} className="border-none"></td>
          </tr>
          <SectionRow title="Other Expenses" colSpan={displayProperties.length + 1} icon="piggy-bank" />

          {mode === "own" && (
            <DataRow
              label={`Rent while waiting for BUC (4yrs)`}
              properties={displayProperties}
              render={(p) => {
                const d = calculateValues(p, { mode, taxBracket, vacancyMonth })
                const isNA = p.type === "Resale"
                return isNA ? (
                  <div className="text-xs text-slate-500">N/A</div>
                ) : (
                  <DualCell
                    left={<ValueText>{fmtCurrency(d.rentWhileWaitingTotal)}</ValueText>}
                    right={
                      <LabeledCurrency
                        label="Monthly"
                        value={p.monthlyRentWhileWaiting}
                        step={100}
                        onChange={(v) => updateProperty(p.id, "monthlyRentWhileWaiting", v)}
                      />
                    }
                  />
                )
              }}
            />
          )}

          <MaybeNADataRow
            label={`Bank Interest (4yrs)`}
            properties={displayProperties}
            fieldKey="bankLoan" // Assuming bank loan is always applicable, but including for structure
            mode={mode}
            renderInput={(p) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth })
              return (
                <div className="space-y-1">
                  <div className="font-medium">{fmtCurrency(d.bankInterest)}</div>
                  <div className="text-[11px] text-slate-500">
                    {p.type === "Resale" 
                      ? "Resale Int: 1.94%" 
                      : "BUC Int: 1.94%"
                    }
                  </div>
                </div>
              )
            }}
          />
          <MaybeNADataRow
            label={`Maintenance Fee (4yrs)`}
            properties={displayProperties}
            fieldKey="maintenanceFee"
            mode={mode}
            renderInput={(p) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth })
              return (
                <DualCell
                  left={<ValueText>{fmtCurrency(d.maintenanceFeeTotal)}</ValueText>}
                  right={
                    <LabeledCurrency
                      label="Monthly"
                      value={p.monthlyMaintenance}
                      step={50}
                      onChange={(v) => updateProperty(p.id, "monthlyMaintenance", v)}
                    />
                  }
                />
              )
            }}
          />
          <MaybeNADataRow
            label={`Est. Property Tax (4yrs)`}
            properties={displayProperties}
            fieldKey="propertyTax"
            mode={mode}
            renderInput={(p) => (
              <CurrencyInput value={p.propertyTax} onChange={(v) => updateProperty(p.id, "propertyTax", v)} />
            )}
          />

          {mode === "investment" && (
            <DataRow
              label={
                <div className="flex items-center gap-3">
                  <span>Income Tax on Net Rental Received</span>
                  <div className="ml-auto flex flex-col items-start gap-1">
                    <Select
                      value={selectedTaxId}
                      onValueChange={(id: string) => {
                        const opt = TAX_BRACKETS.find((o) => o.id === id)!
                        setSelectedTaxId(id)
                        setTaxBracket(opt.rate)
                      }}
                    >
                      <SelectTrigger className="h-8 w-[210px]">
                        {selectedTax ? (
                          <div className="flex w-full items-center justify-between">
                            <span className="truncate pr-2">{selectedTax.range}</span>
                            <span className="text-right text-slate-600 tabular-nums">
                              ({fmtRate(selectedTax.rate)})
                            </span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Select Tax Bracket" />
                        )}
                      </SelectTrigger>
                      <SelectContent className="max-h-72 w-[200px]">
                        {TAX_BRACKETS.map((o) => (
                          <SelectItem
                            key={o.id}
                            value={o.id}
                            textValue={`${o.range} (${fmtRate(o.rate)})`}
                            className="relative pl-3 pr-20"
                          >
                            <span>{o.range}</span>
                            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-600">
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
                <div>{fmtCurrency(calculateValues(p, { mode, taxBracket, vacancyMonth }).taxOnRental)}</div>
              )}
            />
          )}

          <MaybeNADataRow
            label="Minor Renoration"
            properties={displayProperties}
            fieldKey="minorRenovation"
            mode={mode}
            renderInput={(p) => (
              <CurrencyInput value={p.minorRenovation} onChange={(v) => updateProperty(p.id, "minorRenovation", v)} />
            )}
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
              />
            )}
          />

          {mode === "investment" && (
            <MaybeNADataRow
              label="Rental Agent Commission (Incl. GST)"
              properties={displayProperties}
              fieldKey="agentCommission"
              mode={mode}
              renderInput={(p) => (
                <CurrencyInput value={p.agentCommission} onChange={(v) => updateProperty(p.id, "agentCommission", v)} />
              )}
            />
          )}

          <DataRow
            label="Other Expenses"
            properties={displayProperties}
            render={(p) => (
              <CurrencyInput value={p.otherExpenses} onChange={(v) => updateProperty(p.id, "otherExpenses", v)} />
            )}
          />

          <tr className="bg-red-50 hover:bg-red-100">
            <td className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle">
              Total Other Expenses
            </td>
            {displayProperties.map((p, i) => (
              <td
                key={p.id}
                className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === displayProperties.length - 1 ? "last:border-r-0" : ""}`}
              >
                <ValueText className="text-rose-700 font-semibold">
                  {fmtCurrency(calculateValues(p, { mode, taxBracket, vacancyMonth }).totalOtherExpenses)}
                </ValueText>
              </td>
            ))}
          </tr>

          <tr className="h-4 bg-white">
            <td colSpan={displayProperties.length + 1} className="border-none"></td>
          </tr>

          <PropertySummary properties={displayProperties} mode={mode} taxBracket={taxBracket} vacancyMonth={vacancyMonth} />
        </tbody>
      </table>
      
      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for the new folder and save your property to it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFolderAndSave()
                  }
                }}
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelCreateFolder}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateFolderAndSave}
                disabled={!newFolderName.trim()}
              >
                Create & Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
