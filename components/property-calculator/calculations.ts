import type { Property, Mode, CalculationResult } from "./types"
import { YEARS, INTEREST_RATE_PCT } from "./constants"
import { fmtCurrency, fmtRate, calculateBalanceMonthAftTOP, calculateMonthsToTOP } from "./utils";

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

// Function to calculate bank interest for resale properties
// For resale properties, we calculate interest on the full loan amount for 4 years
function calculateResaleBankInterest(loanAmount: number, annualInterestRate: number): number {
  const monthlyRate = annualInterestRate / 100 / 12
  const months = 48 // 4 years
  
  // Simple interest calculation: Principal × Rate × Time
  // For resale properties, the full loan amount is disbursed immediately
  const totalInterest = loanAmount * monthlyRate * months
  
  return Math.round(totalInterest)
}

export function calculateValues(
  property: Property,
  ctx: { mode: Mode; taxBracket?: number; vacancyMonth?: number },
): CalculationResult {
  const loanPercentage = (property.bankLoan / Math.max(1, property.purchasePrice)) * 100
  const projectedGrowth = property.purchasePrice * Math.pow(1 + (property.annualGrowth / 100), YEARS) - property.purchasePrice

  // Determine if rental income is applicable based on mode and property type
  // For BUC properties, rental income is applicable if there are balance months after TOP
  let isRentalApplicable = ctx.mode === "investment" && property.type !== "BUC"
  
  // For BUC properties, check if there are balance months after TOP
  if (ctx.mode === "investment" && property.type === "BUC") {
    const balanceMonths = calculateBalanceMonthAftTOP(property.estTOP, YEARS)
    isRentalApplicable = balanceMonths > 0
  }

  // Calculate rental income differently for BUC vs Resale properties
  let rentalIncome: number
  let vacancyDeduction: number
  
  if (isRentalApplicable) {
    if (property.type === "BUC") {
      // For BUC properties, rental income only applies for balance months after TOP
      const balanceMonths = calculateBalanceMonthAftTOP(property.estTOP, YEARS)
      rentalIncome = property.monthlyRental * balanceMonths
      vacancyDeduction = (ctx.vacancyMonth || 0) * property.monthlyRental
    } else {
      // For Resale properties, rental income applies for full holding period
      rentalIncome = property.monthlyRental * 12 * YEARS
      vacancyDeduction = (ctx.vacancyMonth || 0) * property.monthlyRental
    }
  } else {
    rentalIncome = 0
    vacancyDeduction = 0
  }
  const grossProfit = projectedGrowth + rentalIncome - vacancyDeduction

  // Calculate bank interest differently for BUC vs Resale properties
  let bankInterest: number
  
  // Calculate actual loan amount if it's 0 (using LTV and purchase price)
  const actualLoanAmount = property.bankLoan > 0 ? property.bankLoan : (property.purchasePrice * (property.ltv || 75) / 100)
  
  if (property.type === "BUC") {
    // Use phased disbursement calculation for BUC properties
    bankInterest = calculateBUCBankInterest(actualLoanAmount, property.purchasePrice, property.interestRate || INTEREST_RATE_PCT)
  } else {
    // Use the specific formula for resale properties
    bankInterest = calculateResaleBankInterest(actualLoanAmount, property.interestRate || INTEREST_RATE_PCT)
  }
  
  // Calculate maintenance fee total differently for BUC vs Resale properties
  let maintenanceFeeTotal: number
  if (property.type === "BUC") {
    // For BUC properties, calculate based on balance months after TOP
    const balanceMonths = calculateBalanceMonthAftTOP(property.estTOP, YEARS)
    maintenanceFeeTotal = property.monthlyMaintenance * balanceMonths
  } else {
    // For Resale properties, use the full holding period
    maintenanceFeeTotal = property.monthlyMaintenance * 12 * YEARS
  }
  const taxOnRental = isRentalApplicable ? rentalIncome * ((ctx.taxBracket || 0) / 100) : 0 // Tax on rental also depends on rental applicability

  const rentWhileWaitingTotal =
    ctx.mode === "own" && property.type === "BUC" 
      ? (() => {
          const monthsToTOP = calculateMonthsToTOP(property.estTOP);
          return monthsToTOP > 0 ? property.monthlyRentWhileWaiting * monthsToTOP : 0;
        })()
      : 0;

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
