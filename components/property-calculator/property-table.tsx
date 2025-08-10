"use client"

import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Property, Mode } from "./types"
import { TAX_BRACKETS } from "./constants"
import { calculateValues } from "./calculations"
import { fmtCurrency, fmtRate } from "./utils"
import { PropertyTypeBadge, CurrencyInput, LabeledCurrency, LabeledNumber, DualCell, ValueText } from "./ui-components"
import { SectionRow, DataRow, MaybeNADataRow } from "./table-components"
import PropertySummary from "./property-summary"

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
}: PropertyTableProps) {
  // Selected tax option (for rendering the trigger with left/right text)
  const selectedTax = selectedTaxId ? TAX_BRACKETS.find((o) => o.id === selectedTaxId) : undefined

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <table className="w-full border-collapse">
        <colgroup>
          <col className="w-[360px]" />
          {properties.map((p) => (
            <col key={p.id} className="w-[300px]" />
          ))}
        </colgroup>

        <thead className="text-sm">
          <tr className="sticky top-0 z-20 bg-white border-b border-slate-200">
            <th className="sticky left-0 z-30 bg-white px-4 py-3 text-left text-slate-700 font-medium border-r border-slate-200">
              {''}
            </th>
            {properties.map((property, i) => (
              <th
                key={property.id}
                className="px-4 py-3 text-left font-medium text-slate-800 border-r border-slate-200 last:border-r-0"
              >
                <div className="relative flex flex-col items-center gap-2">
                  <PropertyTypeBadge type={property.type} />
                  <div className="text-slate-900 font-semibold">
                    <input
                      type="text"
                      value={property.name}
                      onChange={(e) => updateProperty(property.id, "name", e.target.value)}
                      placeholder={`Property #${i + 1}`}
                      className="bg-transparent text-center border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1 min-w-0 w-full hover:bg-slate-50 transition-colors"
                      style={{ minWidth: '260px' }}
                    />
                  </div>
                  {properties.length > 1 && (
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
            properties={properties}
            render={(p) => (
              <CurrencyInput value={p.purchasePrice} onChange={(v) => updateProperty(p.id, "purchasePrice", v)} />
            )}
          />
          <DataRow
            label="Bank Loan (75%, 30yrs)"
            properties={properties}
            render={(p) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth })
              return (
                <div className="space-y-1">
                  <CurrencyInput value={p.bankLoan} onChange={(v) => updateProperty(p.id, "bankLoan", v)} />
                </div>
              )
            }}
          />

          <tr className="h-4 bg-white">
            <td colSpan={properties.length + 1} className="border-none"></td>
          </tr>
          <SectionRow title={mode === "own" ? "Growth" : "Rental & Growth"} colSpan={properties.length + 1} icon="graph-up-arrow" />
          <DataRow
            label={`Projected Property Growth (4yrs)`}
            properties={properties}
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
                properties={properties}
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
                properties={properties}
                render={(p) => {
                  const d = calculateValues(p, { mode, taxBracket, vacancyMonth })
                  // Check if property type is BUC to display N/A
                  if (p.type === "BUC") {
                    return <div className="text-xs text-slate-500">N/A</div>
                  }
                  return <div>{fmtCurrency(d.vacancyDeduction)}</div>
                }}
              />
            </>
          )}

          <tr className="bg-green-50 hover:bg-green-100">
            <td className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle">
              Est. Gross Profit
            </td>
            {properties.map((p, i) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth })
              return (
                <td
                  key={p.id}
                  className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
                >
                  <ValueText className="text-emerald-700 font-semibold">{fmtCurrency(d.grossProfit)}</ValueText>
                </td>
              )
            })}
          </tr>

          <tr className="h-4 bg-white">
            <td colSpan={properties.length + 1} className="border-none"></td>
          </tr>
          <SectionRow title="Other Expenses" colSpan={properties.length + 1} icon="piggy-bank" />

          {mode === "own" && (
            <DataRow
              label={`Rent while waiting for BUC (4yrs)`}
              properties={properties}
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
            properties={properties}
            fieldKey="bankLoan" // Assuming bank loan is always applicable, but including for structure
            mode={mode}
            renderInput={(p) => {
              const d = calculateValues(p, { mode, taxBracket, vacancyMonth })
              return (
                <div className="space-y-1">
                  <div className="font-medium">{fmtCurrency(d.bankInterest)}</div>
                  <div className="text-[11px] text-slate-500">{p.type} Interest: 2.84%</div>
                </div>
              )
            }}
          />
          <MaybeNADataRow
            label={`Maintenance Fee (4yrs)`}
            properties={properties}
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
            properties={properties}
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
              properties={properties}
              render={(p) => (
                <div>{fmtCurrency(calculateValues(p, { mode, taxBracket, vacancyMonth }).taxOnRental)}</div>
              )}
            />
          )}

          <MaybeNADataRow
            label="Minor Renoration"
            properties={properties}
            fieldKey="minorRenovation"
            mode={mode}
            renderInput={(p) => (
              <CurrencyInput value={p.minorRenovation} onChange={(v) => updateProperty(p.id, "minorRenovation", v)} />
            )}
          />
          <MaybeNADataRow
            label="Furniture & Fittings"
            properties={properties}
            fieldKey="furnitureFittings"
            mode={mode}
            renderInput={(p) => (
              <CurrencyInput
                value={p.furnitureFittings}
                onChange={(v) => updateProperty(p.id, "furnitureFittings", v)}
              />
            )}
          />
          <MaybeNADataRow
            label="Rental Agent Commission (Incl. GST)"
            properties={properties}
            fieldKey="agentCommission"
            mode={mode}
            renderInput={(p) => (
              <CurrencyInput value={p.agentCommission} onChange={(v) => updateProperty(p.id, "agentCommission", v)} />
            )}
          />

          {mode === "investment" && (
            <DataRow
              label="Other Expenses"
              properties={properties}
              render={(p) => (
                <CurrencyInput value={p.otherExpenses} onChange={(v) => updateProperty(p.id, "otherExpenses", v)} />
              )}
            />
          )}

          <tr className="bg-red-50 hover:bg-red-100">
            <td className="sticky left-0 z-10 px-4 py-3 border-b border-r border-slate-200 text-slate-900 font-medium align-middle">
              Total Other Expenses
            </td>
            {properties.map((p, i) => (
              <td
                key={p.id}
                className={`px-4 py-3 border-b border-r border-slate-200 align-middle ${i === properties.length - 1 ? "last:border-r-0" : ""}`}
              >
                <ValueText className="text-rose-700 font-semibold">
                  {fmtCurrency(calculateValues(p, { mode, taxBracket, vacancyMonth }).totalOtherExpenses)}
                </ValueText>
              </td>
            ))}
          </tr>

          <tr className="h-4 bg-white">
            <td colSpan={properties.length + 1} className="border-none"></td>
          </tr>

          <PropertySummary properties={properties} mode={mode} taxBracket={taxBracket} vacancyMonth={vacancyMonth} />
        </tbody>
      </table>
    </div>
  )
}
