import type { Property, Mode, CalculationResult } from "./types"
import { YEARS, INTEREST_RATE_PCT } from "./constants"

// Function to calculate bank interest for BUC properties based on phased loan disbursement
// This follows the construction phases where loan amounts are disbursed progressively based on purchase price
function calculateBUCBankInterest(loanAmount: number, purchasePrice: number, annualInterestRate: number): number {
  const monthlyRate = annualInterestRate / 100 / 12
  
  // Construction phases with loan disbursement percentages of purchase price
  // Based on the BUC loan guide from The Loan Connection
  const constructionPhases = [
    { percentage: 0.05, months: 6, startMonth: 1 },      // Foundation Works (5% of purchase price)
    { percentage: 0.10, months: 6, startMonth: 7 },     // Reinforcement Concrete Works (10% of purchase price)
    { percentage: 0.05, months: 3, startMonth: 13 },    // Brick Walls (5% of purchase price)
    { percentage: 0.05, months: 3, startMonth: 16 },    // Roofing/Ceiling (5% of purchase price)
    { percentage: 0.05, months: 3, startMonth: 19 },    // Door Frames, Window Frames, Electrical Wiring (5% of purchase price)
    { percentage: 0.05, months: 3, startMonth: 22 },    // Car park, Roads, Drains (5% of purchase price)
    { percentage: 0.25, months: 12, startMonth: 25 },   // Temporary Occupation Permit (TOP) (25% of purchase price)
    { percentage: 0.15, months: 12, startMonth: 37 }    // Certificate of Statutory Completion (CSC) (15% of purchase price)
  ]
  
  let totalInterest = 0
  let cumulativeDisbursed = 0
  
  // Calculate interest for each construction phase
  constructionPhases.forEach(phase => {
    // Add this phase's disbursement to cumulative total
    const phaseDisbursement = purchasePrice * phase.percentage
    cumulativeDisbursed += phaseDisbursement
    
    // Calculate monthly interest on the cumulative disbursed amount
    // Interest = Principal × Rate × Time
    // Monthly interest = Cumulative Disbursed × Monthly Rate × Number of months
    const monthlyInterest = cumulativeDisbursed * monthlyRate
    const phaseInterest = monthlyInterest * phase.months
    
    totalInterest += phaseInterest
  })
  
  return Math.round(totalInterest)
}

// Function to calculate bank interest for resale properties using the specific formula
// SUM(ARRAYFORMULA(IPMT(INTEREST RATE in decimal/12, ROW(1:48), 30*12, -LOAN AMT)))
function calculateResaleBankInterest(loanAmount: number, annualInterestRate: number): number {
  const monthlyRate = annualInterestRate / 100 / 12
  const totalMonths = 30 * 12 // 30 years * 12 months
  let totalInterest = 0
  
  // Calculate monthly payment (PMT) first
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
  
  // Calculate interest for each of the 48 months (4 years)
  for (let month = 1; month <= 48; month++) {
    // IPMT formula: IPMT = PMT * (1 - (1 + rate)^(per - nper - 1))
    // For month 1: IPMT = PMT * (1 - (1 + rate)^(1 - 360 - 1)) = PMT * (1 - (1 + rate)^(-360))
    // For month 2: IPMT = PMT * (1 - (1 + rate)^(2 - 360 - 1)) = PMT * (1 - (1 + rate)^(-359))
    // And so on...
    
    const interestPayment = monthlyPayment * (1 - Math.pow(1 + monthlyRate, month - totalMonths - 1))
    totalInterest += interestPayment
  }
  
  return Math.round(totalInterest)
}

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

  // Calculate bank interest differently for BUC vs Resale properties
  let bankInterest: number
  if (property.type === "BUC") {
    // Use phased disbursement calculation for BUC properties
    bankInterest = calculateBUCBankInterest(property.bankLoan, property.purchasePrice, INTEREST_RATE_PCT)
  } else {
    // Use the specific formula for resale properties
    bankInterest = calculateResaleBankInterest(property.bankLoan, INTEREST_RATE_PCT)
  }
  
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
