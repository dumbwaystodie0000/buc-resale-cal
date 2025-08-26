import type { Property, Mode, CalculationResult } from "./types"
import { INTEREST_RATE_PCT, SSD_RATES } from "./constants"
import { fmtCurrency, fmtRate, calculateBalanceMonthAftTOP, calculateMonthsToTOP } from "./utils";

// Function to calculate SSD (Seller's Stamp Duty) based on holding period
function calculateSSD(purchasePrice: number, holdingPeriod: number, projectedGrowth: number): number {
  // The holding period represents minimum time held, selling happens in the next year
  // So if you hold for 3 years, you sell in the 4th year (37-48 months)
  const sellingYear = holdingPeriod + 1;
  
  // Calculate the selling price (purchase price + projected growth)
  const sellingPrice = purchasePrice + projectedGrowth;
  
  if (sellingYear === 1) {
    // Sell in 1st year (0-12 months): 16%
    return sellingPrice * SSD_RATES.UP_TO_1_YEAR;
  } else if (sellingYear === 2) {
    // Sell in 2nd year (13-24 months): 12%
    return sellingPrice * SSD_RATES.UP_TO_2_YEARS;
  } else if (sellingYear === 3) {
    // Sell in 3rd year (25-36 months): 8%
    return sellingPrice * SSD_RATES.UP_TO_3_YEARS;
  } else if (sellingYear === 4) {
    // Sell in 4th year (37-48 months): 4%
    return sellingPrice * SSD_RATES.UP_TO_4_YEARS;
  } else {
    // Sell after 4th year (>48 months): No SSD payable
    return 0;
  }
}

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
// For resale properties, we calculate interest on the full loan amount for the holding period
function calculateResaleBankInterest(loanAmount: number, annualInterestRate: number, holdingPeriod: number): number {
  const monthlyRate = annualInterestRate / 100 / 12
  const months = holdingPeriod * 12 // Use dynamic holding period
  
  // Simple interest calculation: Principal × Rate × Time
  // For resale properties, the full loan amount is disbursed immediately
  const totalInterest = loanAmount * monthlyRate * months
  
  return Math.round(totalInterest)
}

function calculateAgentCommission(property: Property, YEARS: number, monthlyRental: number): number {
  if (property.commissionRate === "other") {
    return property.agentCommission;
  }
  
  if (property.commissionRate === "none" || property.commissionRate === "") {
    return 0;
  }

  const monthlyRent = monthlyRental;
  const rateMultiplier = parseFloat(property.commissionRate);
  
  if (property.type === "BUC") {
    // For BUC properties, calculate based on balance months after TOP
    const balanceMonths = calculateBalanceMonthAftTOP(property.estTOP, YEARS);
    if (balanceMonths <= 0) return 0;
    
    // Calculate annual commission: monthly rent * rate multiplier
    const annualCommission = monthlyRent * rateMultiplier;
    // Calculate total commission for balance months: annual commission * (balance months / 12)
    return annualCommission * (balanceMonths / 12);
  } else {
    // For Resale properties, calculate for full holding period
    const annualCommission = monthlyRent * rateMultiplier;
    return annualCommission * YEARS;
  }
}

export function calculateValues(
  property: Property,
  ctx: { mode: Mode; taxBracket: number; vacancyMonth: number; monthlyRental: number },
): CalculationResult {
  const YEARS = property.holdingPeriod || 4; // Use actual holding period from property
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
      rentalIncome = ctx.monthlyRental * balanceMonths
      vacancyDeduction = (ctx.vacancyMonth || 0) * ctx.monthlyRental
    } else {
      // For Resale properties, rental income applies for full holding period
      rentalIncome = ctx.monthlyRental * 12 * YEARS
      vacancyDeduction = (ctx.vacancyMonth || 0) * ctx.monthlyRental
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
    bankInterest = calculateResaleBankInterest(actualLoanAmount, property.interestRate || INTEREST_RATE_PCT, YEARS)
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

  const agentCommission = calculateAgentCommission(property, YEARS, ctx.monthlyRental);

  // Calculate SSD based on holding period
  const ssdPayable = calculateSSD(property.purchasePrice, YEARS, projectedGrowth);

  const totalOtherExpenses =
    bankInterest +
    maintenanceFeeTotal +
    property.propertyTax +
    taxOnRental +
    rentWhileWaitingTotal +
    property.minorRenovation +
    property.furnitureFittings +
    agentCommission +
    ssdPayable +
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
    ssdPayable,
  }
}
