import type { Property, Mode, CalculationResult } from "./types"
import { YEARS, INTEREST_RATE_PCT } from "./constants"

export function calculateValues(
  property: Property,
  ctx: { mode: Mode; taxBracket?: number; vacancyMonth?: number },
): CalculationResult {
  const loanPercentage = (property.bankLoan / Math.max(1, property.purchasePrice)) * 100
  const projectedGrowth = property.purchasePrice * Math.pow(1 + (property.annualGrowth / 100), YEARS) - property.purchasePrice

  // Determine if rental income is applicable based on mode and property type
  const isRentalApplicable = ctx.mode === "investment" && property.type !== "BUC"

  const rentalIncome = isRentalApplicable ? property.monthlyRental * 12 * YEARS : 0
  const vacancyDeduction = isRentalApplicable ? (ctx.vacancyMonth || 0) * property.monthlyRental : 0
  const grossProfit = projectedGrowth + rentalIncome - vacancyDeduction

  const bankInterest = property.bankLoan * (INTEREST_RATE_PCT / 100) * YEARS
  const maintenanceFeeTotal = property.monthlyMaintenance * 12 * YEARS
  const taxOnRental = isRentalApplicable ? rentalIncome * ((ctx.taxBracket || 0) / 100) : 0 // Tax on rental also depends on rental applicability

  const rentWhileWaitingTotal =
    ctx.mode === "own" && property.type === "BUC" ? property.monthlyRentWhileWaiting * 12 * YEARS : 0

  const totalOtherExpenses =
    bankInterest +
    maintenanceFeeTotal +
    property.propertyTax +
    taxOnRental +
    rentWhileWaitingTotal +
    property.minorRenovation +
    property.furnitureFittings +
    property.agentCommission +
    property.otherExpenses

  const projectedValuation = property.purchasePrice + projectedGrowth
  const netProfit = grossProfit - totalOtherExpenses
  const equity = property.purchasePrice - property.bankLoan
  const roe = equity > 0 ? (netProfit / equity) * 100 : 0
  const totalCashReturn = netProfit + (projectedValuation - property.bankLoan)

  return {
    loanPercentage,
    projectedGrowth,
    rentalIncome,
    vacancyDeduction,
    grossProfit,
    bankInterest,
    maintenanceFeeTotal,
    taxOnRental,
    rentWhileWaitingTotal,
    totalOtherExpenses,
    projectedValuation,
    netProfit,
    roe,
    totalCashReturn,
  }
}
