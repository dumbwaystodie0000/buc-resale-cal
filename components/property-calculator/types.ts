export type PropertyType = "BUC" | "Resale"
export type Mode = "investment" | "own"

export interface SavedProperty {
  id: string
  name: string
  type: PropertyType
  purchasePrice: number
  folder?: string
}

export interface Property {
  id: string
  name: string
  type: PropertyType
  purchasePrice: number
  bankLoan: number
  projectedGrowth: number
  annualGrowth: number
  rentalIncome: number
  monthlyRental: number
  vacancyMonth: number
  maintenanceFee: number
  monthlyMaintenance: number
  propertyTax: number
  taxBracket: number
  minorRenovation: number
  furnitureFittings: number
  agentCommission: number
  otherExpenses: number
  monthlyRentWhileWaiting: number
}

export interface CalculationResult {
  loanPercentage: number
  projectedGrowth: number
  rentalIncome: number
  vacancyDeduction: number
  grossProfit: number
  bankInterest: number
  maintenanceFeeTotal: number
  taxOnRental: number
  rentWhileWaitingTotal: number
  totalOtherExpenses: number
  projectedValuation: number
  netProfit: number
  roe: number
  totalCashReturn: number
}

export interface TaxBracket {
  id: string
  range: string
  rate: number
}
