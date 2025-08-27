import type { Property, Mode, CalculationResult } from "./types"
import { INTEREST_RATE_PCT, SSD_RATES } from "./constants"
import { fmtCurrency, fmtRate, calculateBalanceMonthAftTOP, calculateMonthsToTOP } from "./utils";

// Function to calculate BSD (Buyer Stamp Duty) based on purchase price
// Updated to use the new 6-tier system:
// - First $180,000: 1%
// - Next $180,000: 2% 
// - Next $640,000: 3%
// - Next $500,000: 4%
// - Next $1,500,000: 5%
// - Remaining amount: 6%
// 
// Example: Property worth $4,500,100 should have BSD = $209,606
// - First $180k: $1,800 (1%)
// - Next $180k: $3,600 (2%)
// - Next $640k: $19,200 (3%)
// - Next $500k: $20,000 (4%)
// - Next $1.5M: $75,000 (5%)
// - Remaining $1,500,100: $90,006 (6%)
// Total: $209,606
function calculateBSD(purchasePrice: number): number {
  // Return $0 if no purchase price or invalid amount
  if (purchasePrice <= 0) {
    return 0;
  }

  let bsd = 0;
  let remainingAmount = purchasePrice;
  
  // First $180,000: 1%
  if (remainingAmount > 0) {
    const firstTier = Math.min(remainingAmount, 180000);
    bsd += firstTier * 0.01;
    remainingAmount -= firstTier;
  }
  
  // Next $180,000: 2%
  if (remainingAmount > 0) {
    const secondTier = Math.min(remainingAmount, 180000);
    bsd += secondTier * 0.02;
    remainingAmount -= secondTier;
  }
  
  // Next $640,000: 3%
  if (remainingAmount > 0) {
    const thirdTier = Math.min(remainingAmount, 640000);
    bsd += thirdTier * 0.03;
    remainingAmount -= thirdTier;
  }
  
  // Next $500,000: 4%
  if (remainingAmount > 0) {
    const fourthTier = Math.min(remainingAmount, 500000);
    bsd += fourthTier * 0.04;
    remainingAmount -= fourthTier;
  }
  
  // Next $1,500,000: 5%
  if (remainingAmount > 0) {
    const fifthTier = Math.min(remainingAmount, 1500000);
    bsd += fifthTier * 0.05;
    remainingAmount -= fifthTier;
  }
  
  // Remaining amount: 6%
  if (remainingAmount > 0) {
    bsd += remainingAmount * 0.06;
  }
  
  // BSD is rounded down to the nearest dollar, subject to a minimum duty of $1
  // Only apply minimum $1 if we actually have a calculated BSD > 0
  return bsd > 0 ? Math.max(1, Math.floor(bsd)) : 0;
}

// Function to calculate ABSD (Additional Buyer Stamp Duty) based on purchase price, citizenship, and property count
function calculateABSD(purchasePrice: number, citizenship: "SC" | "PR" | "Foreigner" = "SC", propertyCount: number = 1): number {
  let absdRate = 0;
  
  if (citizenship === "SC") {
    // Singapore Citizens
    if (propertyCount === 1) {
      absdRate = 0; // No ABSD for 1st property
    } else if (propertyCount === 2) {
      absdRate = 0.20; // 20% for 2nd property
    } else if (propertyCount === 3) {
      absdRate = 0.25; // 25% for 3rd property
    } else {
      absdRate = 0.30; // 30% for 4th+ property
    }
  } else if (citizenship === "PR") {
    // Permanent Residents
    if (propertyCount === 1) {
      absdRate = 0.25; // 25% for 1st property
    } else if (propertyCount === 2) {
      absdRate = 0.30; // 30% for 2nd property
    } else {
      absdRate = 0.35; // 35% for 3rd+ property
    }
  } else {
    // Foreigners
    absdRate = 0.60; // 60% for all properties
  }
  
  return Math.round(purchasePrice * absdRate);
}

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

function calculateAgentCommission(property: Property, YEARS: number, monthlyRental: number, gstEnabled: boolean = false): number {
  if (property.commissionRate === "other") {
    return property.agentCommission;
  }
  
  if (property.commissionRate === "none" || property.commissionRate === "") {
    return 0;
  }

  const monthlyRent = monthlyRental;
  const rateMultiplier = parseFloat(property.commissionRate);
  
  let commission = 0;
  
  if (property.type === "BUC") {
    // For BUC properties, calculate based on balance months after TOP
    const balanceMonths = calculateBalanceMonthAftTOP(property.estTOP, YEARS);
    if (balanceMonths <= 0) return 0;
    
    // Calculate annual commission: monthly rent * rate multiplier
    const annualCommission = monthlyRent * rateMultiplier;
    // Calculate total commission for balance months: annual commission * (balance months / 12)
    commission = annualCommission * (balanceMonths / 12);
  } else {
    // For Resale properties, calculate for full holding period
    const annualCommission = monthlyRent * rateMultiplier;
    commission = annualCommission * YEARS;
  }
  
  // Apply GST if enabled
  if (gstEnabled) {
    commission = commission * 1.09;
  }
  
  return Math.round(commission);
}

function calculateSalesCommission(property: Property, projectedGrowth: number, gstEnabled: boolean = false): number {
  if (property.salesCommissionRate === "other") {
    return property.salesCommission;
  }
  
  if (property.salesCommissionRate === "none" || property.salesCommissionRate === "") {
    return 0;
  }

  // Calculate selling price (purchase price + projected growth)
  const sellingPrice = property.purchasePrice + projectedGrowth;
  
  // Convert percentage to decimal (e.g., "1.50" -> 0.015)
  const rateMultiplier = parseFloat(property.salesCommissionRate) / 100;
  
  // Calculate base commission
  let commission = sellingPrice * rateMultiplier;
  
  // Apply GST if enabled
  if (gstEnabled) {
    commission = commission * 1.09;
  }
  
  return Math.round(commission);
}

// Function to calculate monthly mortgage instalment for RESALE properties only
// For BUC properties, use calculateBUCMonthlyInstalment instead
export function calculateMonthlyInstalment(
  loanAmount: number,
  annualInterestRate: number,
  loanTenureYears: number
): number {
  if (loanAmount <= 0 || annualInterestRate <= 0 || loanTenureYears <= 0) {
    return 0;
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  const totalPayments = loanTenureYears * 12;

  // Standard mortgage payment formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
  // Where: P = monthly payment, L = loan amount, c = monthly interest rate, n = total number of payments
  if (monthlyRate === 0) {
    return loanAmount / totalPayments;
  }

  const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments);
  const denominator = Math.pow(1 + monthlyRate, totalPayments) - 1;
  
  return Math.round(numerator / denominator);
}

// Function to calculate monthly instalment for BUC properties based on progressive disbursement
export function calculateBUCMonthlyInstalment(
  property: Property,
  estTOP: Date | null,
  estCSC?: Date | null
): number {
  if (property.type !== "BUC") {
    return 0;
  }

  const totalLoanAmount = (property.purchasePrice * (property.ltv || 75)) / 100;
  const annualInterestRate = property.interestRate || 2.0;
  const loanTenureYears = property.loanTenure || 30;
  const totalPayments = loanTenureYears * 12;
  const monthlyRate = annualInterestRate / 100 / 12;

  if (totalLoanAmount <= 0 || annualInterestRate <= 0 || loanTenureYears <= 0) {
    return 0;
  }

  // BUC construction stages with disbursement percentages and timing
  // Based on the detailed breakdown provided
  const constructionStages = [
    { stage: "Foundation", percentage: 0.05, months: 6, startMonth: 0 },
    { stage: "Reinforced Concrete", percentage: 0.10, months: 6, startMonth: 6 },
    { stage: "Brick Wall", percentage: 0.05, months: 3, startMonth: 12 },
    { stage: "Ceiling/Roofing", percentage: 0.05, months: 3, startMonth: 15 },
    { stage: "Electrical/Plumbing", percentage: 0.05, months: 3, startMonth: 18 },
    { stage: "Roads/Car Parks", percentage: 0.05, months: 3, startMonth: 21 },
    { stage: "TOP", percentage: 0.25, months: 12, startMonth: 24 },
    { stage: "CSC", percentage: 0.15, months: 12, startMonth: 36 }
  ];

  // Calculate months elapsed from now
  let monthsElapsed = 0;
  if (estTOP) {
    const currentDate = new Date();
    const topDate = new Date(estTOP);
    monthsElapsed = (topDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                    (topDate.getMonth() - currentDate.getMonth());
    monthsElapsed = Math.max(0, monthsElapsed);
  }

  // Find the current construction stage based on months elapsed
  let currentStage = 0;
  let cumulativeDisbursed = 0;

  for (let i = 0; i < constructionStages.length; i++) {
    const stage = constructionStages[i];
    
    if (monthsElapsed >= stage.startMonth) {
      // This stage has been reached, add its disbursement
      cumulativeDisbursed += totalLoanAmount * stage.percentage;
      currentStage = i;
    } else {
      // We haven't reached this stage yet
      break;
    }
  }

  // If we haven't reached any stage yet, return 0
  if (currentStage === 0 && monthsElapsed < constructionStages[0].startMonth) {
    return 0;
  }

  // Calculate the current disbursed amount
  const currentDisbursedAmount = cumulativeDisbursed;

  // Calculate remaining payments (total tenure minus elapsed time)
  // For BUC, we start counting from the first disbursement
  const firstDisbursementMonth = constructionStages[0].startMonth;
  const effectiveElapsedMonths = Math.max(0, monthsElapsed - firstDisbursementMonth);
  const remainingPayments = totalPayments - effectiveElapsedMonths;

  // Apply the amortization formula with current disbursed amount and remaining payments
  if (monthlyRate === 0) {
    return currentDisbursedAmount / remainingPayments;
  }

  const numerator = currentDisbursedAmount * monthlyRate * Math.pow(1 + monthlyRate, remainingPayments);
  const denominator = Math.pow(1 + monthlyRate, remainingPayments) - 1;
  
  return Math.round(numerator / denominator);
}

// Function to calculate monthly instalment for any property type (BUC or Resale)
export function calculateMonthlyInstalmentForProperty(
  property: Property,
  estTOP?: Date | null,
  estCSC?: Date | null
): number {
  if (property.type === "BUC") {
    return calculateBUCMonthlyInstalment(property, estTOP || null, estCSC || null);
  } else {
    // For Resale properties, use standard calculation
    const loanAmount = (property.purchasePrice * (property.ltv || 75)) / 100;
    return calculateMonthlyInstalment(loanAmount, property.interestRate || 2.0, property.loanTenure || 30);
  }
}

// Function to calculate monthly instalment for BUC properties for specific years
export function calculateBUCMonthlyInstalmentByYear(
  property: Property,
  estTOP: Date | null,
  targetYear: 1 | 2 | 3 | 4
): number {
  if (property.type !== "BUC" || !estTOP) {
    return 0;
  }

  const totalLoanAmount = (property.purchasePrice * (property.ltv || 75)) / 100;
  const annualInterestRate = property.interestRate || 2.0;
  const loanTenureYears = property.loanTenure || 30;
  const monthlyRate = annualInterestRate / 100 / 12;

  if (totalLoanAmount <= 0 || annualInterestRate <= 0 || loanTenureYears <= 0) {
    return 0;
  }

  // BUC construction stages with disbursement percentages and timing
  const constructionStages = [
    { stage: "Foundation", percentage: 0.05, months: 6, startMonth: 0 },
    { stage: "Reinforced Concrete", percentage: 0.10, months: 6, startMonth: 6 },
    { stage: "Brick Wall", percentage: 0.05, months: 3, startMonth: 12 },
    { stage: "Ceiling/Roofing", percentage: 0.05, months: 3, startMonth: 15 },
    { stage: "Electrical/Plumbing", percentage: 0.05, months: 3, startMonth: 18 },
    { stage: "Roads/Car Parks", percentage: 0.05, months: 3, startMonth: 21 },
    { stage: "TOP", percentage: 0.25, months: 12, startMonth: 24 },
    { stage: "CSC", percentage: 0.15, months: 12, startMonth: 36 }
  ];

  // Calculate the total loan amount disbursed by the end of each year
  let year1Total = 0;
  let year2Total = 0;
  let year3Total = 0;
  let year4Total = 0;

  // Calculate cumulative disbursed amounts for each year
  for (let i = 0; i < constructionStages.length; i++) {
    const stage = constructionStages[i];
    const stageEndMonth = stage.startMonth + stage.months;
    
    if (stageEndMonth <= 12) {
      year1Total += totalLoanAmount * stage.percentage;
    }
    if (stageEndMonth <= 24) {
      year2Total += totalLoanAmount * stage.percentage;
    }
    if (stageEndMonth <= 36) {
      year3Total += totalLoanAmount * stage.percentage;
    }
    if (stageEndMonth <= 48) {
      year4Total += totalLoanAmount * stage.percentage;
    }
  }

  // Get the total loan balance for the target year
  let totalLoanBalance: number;
  
  if (targetYear === 1) {
    totalLoanBalance = year1Total;
  } else if (targetYear === 2) {
    totalLoanBalance = year2Total;
  } else if (targetYear === 3) {
    totalLoanBalance = year3Total;
  } else if (targetYear === 4) {
    totalLoanBalance = year4Total;
  } else {
    return 0;
  }

  // Calculate monthly payment based on the total loan balance
  // Use the standard amortization formula
  if (monthlyRate === 0) {
    return totalLoanBalance / (loanTenureYears * 12);
  }

  const numerator = totalLoanBalance * monthlyRate * Math.pow(1 + monthlyRate, loanTenureYears * 12);
  const denominator = Math.pow(1 + monthlyRate, loanTenureYears * 12) - 1;
  
  return Math.round(numerator / denominator);
}

// Function to get BUC monthly instalment breakdown for all years
export function getBUCMonthlyInstalmentBreakdown(
  property: Property,
  estTOP: Date | null
): { year1: number; year2: number; year3: number; year4: number } {
  if (property.type !== "BUC" || !estTOP) {
    return { year1: 0, year2: 0, year3: 0, year4: 0 };
  }

  return {
    year1: calculateBUCMonthlyInstalmentByYear(property, estTOP, 1),
    year2: calculateBUCMonthlyInstalmentByYear(property, estTOP, 2),
    year3: calculateBUCMonthlyInstalmentByYear(property, estTOP, 3),
    year4: calculateBUCMonthlyInstalmentByYear(property, estTOP, 4)
  };
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
          // If no TOP date is entered, use holding period * monthly rent
          if (!property.estTOP) {
            return property.monthlyRentWhileWaiting * YEARS * 12;
          }
          
          // If TOP date is entered, calculate months from now until TOP
          const monthsToTOP = calculateMonthsToTOP(property.estTOP);
          return monthsToTOP > 0 ? property.monthlyRentWhileWaiting * monthsToTOP : 0;
        })()
      : 0;

  const agentCommission = calculateAgentCommission(property, YEARS, ctx.monthlyRental, property.rentalGstEnabled);
  const salesCommission = calculateSalesCommission(property, projectedGrowth, property.salesGstEnabled);

  // Calculate SSD based on holding period
  const ssdPayable = calculateSSD(property.purchasePrice, YEARS, projectedGrowth);

  // Calculate BSD and ABSD
  const bsd = calculateBSD(property.purchasePrice);
  const absd = calculateABSD(property.purchasePrice);

  // For BUC properties, only include minor renovation and furniture & fittings if balance months after TOP > 0
  let applicableMinorRenovation = property.minorRenovation;
  let applicableFurnitureFittings = property.furnitureFittings;
  
  if (property.type === "BUC") {
    const balanceMonths = calculateBalanceMonthAftTOP(property.estTOP, YEARS);
    if (balanceMonths <= 0) {
      applicableMinorRenovation = 0;
      applicableFurnitureFittings = 0;
    }
  }

  const totalOtherExpenses =
    bankInterest +
    maintenanceFeeTotal +
    property.propertyTax +
    taxOnRental +
    rentWhileWaitingTotal +
    applicableMinorRenovation +
    applicableFurnitureFittings +
    agentCommission +
    ssdPayable +
    bsd +
    absd +
    property.otherExpenses +
    salesCommission

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
    bsd,
    absd,
    salesCommission,
    agentCommission,
  }
}
