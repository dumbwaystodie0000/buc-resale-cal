export type PropertyType = "BUC" | "Resale"
export type Mode = "investment" | "own"

export type CommissionRate = "0.5" | "1" | "1.5" | "2" | "other" | "none" | ""
export type SalesCommissionRate = "0.50" | "0.75" | "1.00" | "1.25" | "1.50" | "1.75" | "2.00" | "2.50" | "3.00" | "3.50" | "other" | "none" | ""

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
  loanTenure: number
  interestRate: number
  ltv: number
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
  commissionRate: CommissionRate
  rentalGstEnabled: boolean
  salesCommission: number
  salesCommissionRate: SalesCommissionRate
  salesGstEnabled: boolean
  otherExpenses: number
  monthlyRentWhileWaiting: number
  estTOP: Date | null
  balanceMonthAftTOP: number
  holdingPeriod: number
  ssdPayable: number
  absdCitizenship: "SC" | "PR" | "Foreigner" | "Company" // Company represents Entities
  absdPropertyCount: number
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
  ssdPayable: number
  bsd: number
  absd: number
  salesCommission: number
  agentCommission: number
}

export interface TaxBracket {
  id: string
  range: string
  rate: number
}
