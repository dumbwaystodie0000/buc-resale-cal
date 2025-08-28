import type { Property, Mode, CalculationResult } from "./types"
import { INTEREST_RATE_PCT, SSD_RATES, AV_YIELD_RATE, PROPERTY_TAX_REBATE_YEAR, PROPERTY_TAX_REBATE_RATE, PROPERTY_TAX_REBATE_CAP } from "./constants"
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
export function calculateABSD(purchasePrice: number, citizenship: "SC" | "PR" | "Foreigner" | "Company" = "SC", propertyCount: number = 1): number {
  let absdRate = 0;
  
  if (citizenship === "SC") {
    // Singapore Citizens
    if (propertyCount === 1) {
      absdRate = 0; // No ABSD for 1st property
    } else if (propertyCount === 2) {
      absdRate = 0.20; // 20% for 2nd property
    } else {
      absdRate = 0.30; // 30% for 3rd+ property
    }
  } else if (citizenship === "PR") {
    // Permanent Residents
    if (propertyCount === 1) {
      absdRate = 0.05; // 5% for 1st property
    } else if (propertyCount === 2) {
      absdRate = 0.30; // 30% for 2nd property
    } else {
      absdRate = 0.35; // 35% for 3rd+ property
    }
  } else if (citizenship === "Company") {
    // Companies/Entities
    absdRate = 0.65; // 65% for all properties
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
// For resale properties, we calculate total interest paid during the holding period using proper amortization formula
// 
// Formula breakdown:
// 1. Monthly Payment = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]
// 2. Remaining Balance = P × [(1+r)ⁿ - (1+r)ᵖ] / [(1+r)ⁿ - 1]
// 3. Total Interest = (Monthly Payment × p) - Principal Paid
// 
// Where:
// P = Principal loan amount
// r = Monthly interest rate (annual rate ÷ 12)
// n = Total number of payments (loan tenure × 12)
// p = Number of payments made during holding period (holding period × 12)
//
// Example: $750k loan, 3% annual rate, 30-year term, 4-year holding period
// Expected result: ~$86,227 interest paid in first 4 years
function calculateResaleBankInterest(loanAmount: number, annualInterestRate: number, holdingPeriod: number, loanTenureYears: number = 30): number {
  if (loanAmount <= 0 || annualInterestRate <= 0 || holdingPeriod <= 0 || loanTenureYears <= 0) {
    return 0;
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  const totalPayments = loanTenureYears * 12; // Use actual loan tenure
  const targetPayments = holdingPeriod * 12; // Number of payments made during holding period

  // Step 1: Calculate monthly payment using standard mortgage formula
  // PMT = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]
  const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments);
  const denominator = Math.pow(1 + monthlyRate, totalPayments) - 1;
  const monthlyPayment = numerator / denominator;

  // Step 2: Calculate remaining balance after target payments
  // Remaining Balance = P × [(1+r)ⁿ - (1+r)ᵖ] / [(1+r)ⁿ - 1]
  const remainingBalance = loanAmount * (Math.pow(1 + monthlyRate, totalPayments) - Math.pow(1 + monthlyRate, targetPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);

  // Step 3: Calculate principal paid during holding period
  const principalPaid = loanAmount - remainingBalance;

  // Step 4: Calculate total interest paid during holding period
  // Total Interest = (Monthly Payment × Number of Payments) - Principal Paid
  const totalInterest = (monthlyPayment * targetPayments) - principalPaid;

  return Math.round(totalInterest);
}

// Function to calculate Annual Value (AV) for a specific year
export function calculateAnnualValue(purchasePrice: number, annualGrowthRate: number, yearNumber: number): number {
  // Year 1: AV = Property Price × 2.6%
  if (yearNumber === 1) {
    return purchasePrice * AV_YIELD_RATE;
  }
  
  // Year N onwards: AV = AV_1 × (1 + annualGrowth%)^(n-1)
  const year1AV = purchasePrice * AV_YIELD_RATE;
  return year1AV * Math.pow(1 + (annualGrowthRate / 100), yearNumber - 1);
}

// Function to calculate property tax for owner-occupied properties (effective 1 Jan 2025)
export function calculateOwnerOccupiedPropertyTax(annualValue: number, taxYear: number): number {
  let totalTax = 0;
  
  // Progressive tax brackets for owner-occupied properties
  if (annualValue <= 12000) {
    // First $12,000: 0%
    totalTax = 0;
  } else if (annualValue <= 40000) {
    // First $12,000: 0%
    // Next $28,000: 4%
    totalTax = (annualValue - 12000) * 0.04;
  } else if (annualValue <= 50000) {
    // First $40,000: $1,120 (cumulative)
    // Next $10,000: 6%
    totalTax = 1120 + (annualValue - 40000) * 0.06;
  } else if (annualValue <= 75000) {
    // First $50,000: $1,720 (cumulative)
    // Next $25,000: 10%
    totalTax = 1720 + (annualValue - 50000) * 0.10;
  } else if (annualValue <= 85000) {
    // First $75,000: $4,220 (cumulative)
    // Next $10,000: 12%
    totalTax = 4220 + (annualValue - 75000) * 0.12;
  } else if (annualValue <= 100000) {
    // First $85,000: $5,420 (cumulative)
    // Next $15,000: 14%
    totalTax = 5420 + (annualValue - 85000) * 0.14;
  } else if (annualValue <= 150000) {
    // First $100,000: $7,520 (cumulative)
    // Next $50,000: 16%
    totalTax = 7520 + (annualValue - 100000) * 0.16;
  } else if (annualValue <= 200000) {
    // First $150,000: $15,520 (cumulative)
    // Next $50,000: 18%
    totalTax = 1520 + (annualValue - 150000) * 0.18;
  } else {
    // Above $200,000: $24,520 (cumulative) + 20% on remaining
    totalTax = 24520 + (annualValue - 200000) * 0.20;
  }
  
  // Apply 2025 rebate if applicable
  if (taxYear === PROPERTY_TAX_REBATE_YEAR) {
    const rebate = Math.min(totalTax * PROPERTY_TAX_REBATE_RATE, PROPERTY_TAX_REBATE_CAP);
    totalTax = Math.max(0, totalTax - rebate);
  }
  
  return Math.round(totalTax);
}

// Function to calculate property tax for non-owner-occupied (investment) properties (effective 1 Jan 2024)
export function calculateInvestmentPropertyTax(annualValue: number): number {
  let totalTax = 0;
  
  // Progressive tax brackets for non-owner-occupied properties
  if (annualValue <= 30000) {
    // First $30,000: 12%
    totalTax = annualValue * 0.12;
  } else if (annualValue <= 45000) {
    // First $30,000: $3,600
    // Next $15,000: 20%
    totalTax = 3600 + (annualValue - 30000) * 0.20;
  } else if (annualValue <= 60000) {
    // First $45,000: $6,600
    // Next $15,000: 28%
    totalTax = 6600 + (annualValue - 45000) * 0.28;
  } else {
    // First $60,000: $10,800
    // Above $60,000: 36%
    totalTax = 10800 + (annualValue - 60000) * 0.36;
  }
  
  return Math.round(totalTax);
}

// Function to calculate total property tax for the entire holding period
export function calculateTotalPropertyTax(
  property: Property, 
  mode: Mode, 
  holdingPeriod: number
): number {
  let totalPropertyTax = 0;
  
  if (property.type === "BUC") {
    // For BUC properties, property tax is only charged after TOP
    const balanceMonths = calculateBalanceMonthAftTOP(property.estTOP, holdingPeriod);
    
    if (balanceMonths <= 0) {
      // No property tax if TOP hasn't been reached yet
      return 0;
    }
    
    // Calculate how many years of property tax to charge
    // If there are partial months, round up to the nearest year
    const taxableYears = Math.ceil(balanceMonths / 12);
    
    // Calculate the actual tax year when property tax becomes payable
    // This is based on the TOP date, not the year of ownership
    if (!property.estTOP) {
      return 0; // No TOP date specified, no property tax
    }
    const topDate = new Date(property.estTOP);
    const topYear = topDate.getFullYear();
    
    // Calculate property tax for the taxable years only
    for (let year = 1; year <= taxableYears; year++) {
      const annualValue = calculateAnnualValue(property.purchasePrice, property.annualGrowth || 0, year);
      
      if (mode === "own") {
        // Owner-occupied: use owner-occupied rates
        // The tax year is the TOP year + (year - 1) since year 1 starts from TOP
        const taxYear = topYear + (year - 1);
        totalPropertyTax += calculateOwnerOccupiedPropertyTax(annualValue, taxYear);
      } else {
        // Investment: use non-owner-occupied rates
        totalPropertyTax += calculateInvestmentPropertyTax(annualValue);
      }
    }
  } else {
    // For Resale properties, calculate property tax for the full holding period
    // For Resale, we assume the current year is when the property is purchased
    const currentYear = new Date().getFullYear();
    
    for (let year = 1; year <= holdingPeriod; year++) {
      const annualValue = calculateAnnualValue(property.purchasePrice, property.annualGrowth || 0, year);
      
      if (mode === "own") {
        // Owner-occupied: use owner-occupied rates
        // The tax year is the current year + (year - 1)
        const taxYear = currentYear + (year - 1);
        totalPropertyTax += calculateOwnerOccupiedPropertyTax(annualValue, taxYear);
      } else {
        // Investment: use non-owner-occupied rates
        totalPropertyTax += calculateInvestmentPropertyTax(annualValue);
      }
    }
  }
  
  return totalPropertyTax;
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
  const annualInterestRate = property.interestRate ?? INTEREST_RATE_PCT;
  const loanTenureYears = property.loanTenure || 30;
  const totalPayments = loanTenureYears * 12;
  const monthlyRate = annualInterestRate / 100 / 12;

  if (totalLoanAmount <= 0 || loanTenureYears <= 0) {
    return 0;
  }

  // BUC construction stages with disbursement percentages and timing (FIXED SCHEDULE)
  const constructionStages = [
    { stage: "Foundation", percentage: 0.05, months: 6, startMonth: 1 },
    { stage: "Reinforced Concrete", percentage: 0.10, months: 6, startMonth: 7 },
    { stage: "Brick Wall", percentage: 0.05, months: 3, startMonth: 13 },
    { stage: "Ceiling/Roofing", percentage: 0.05, months: 3, startMonth: 16 },
    { stage: "Electrical/Plumbing", percentage: 0.05, months: 3, startMonth: 19 },
    { stage: "Roads/Car Parks", percentage: 0.05, months: 3, startMonth: 22 },
    { stage: "TOP", percentage: 0.25, months: 12, startMonth: 25 },
    { stage: "CSC", percentage: 0.15, months: 12, startMonth: 37 }
  ];

  // If TOP date is provided, calculate based on current construction stage
  if (estTOP) {
    // Calculate months elapsed from now
    let monthsElapsed = 0;
    const currentDate = new Date();
    const topDate = new Date(estTOP);
    monthsElapsed = (topDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                    (topDate.getMonth() - currentDate.getMonth());
    monthsElapsed = Math.max(0, monthsElapsed);

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
  } else {
    // If no TOP date is provided, calculate the final monthly installment
    // based on the actual loan amount (not the full construction cost)
    let totalDisbursedByEnd = 0;
    constructionStages.forEach(stage => {
      totalDisbursedByEnd += totalLoanAmount * stage.percentage;
    });

    // Calculate the final monthly installment based on the total loan amount
    // This represents what the monthly payment will be after construction is complete
    if (monthlyRate === 0) {
      return totalDisbursedByEnd / totalPayments;
    }

    const numerator = totalDisbursedByEnd * monthlyRate * Math.pow(1 + monthlyRate, totalPayments);
    const denominator = Math.pow(1 + monthlyRate, totalPayments) - 1;
    
    return Math.round(numerator / denominator);
  }
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
    return calculateMonthlyInstalment(loanAmount, property.interestRate ?? INTEREST_RATE_PCT, property.loanTenure || 30);
  }
}



/**
 * Helper function to calculate monthly mortgage payment using the standard formula
 */
function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  tenureInMonths: number
): number {
  if (principal <= 0 || tenureInMonths <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return principal / tenureInMonths;
  }

  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths);
  const denominator = Math.pow(1 + monthlyRate, tenureInMonths) - 1;
  
  return numerator / denominator;
}

/**
 * REVISED FUNCTION: Calculates the AVERAGE monthly instalment for a BUC property for a specific year.
 * This version correctly re-amortizes the loan over the REMAINING TENURE at each disbursement.
 * For Year 5 onwards, uses fixed monthly instalment since construction is completed.
 */
export function calculateBUCAverageMonthlyInstalmentByYear(
  property: Property,
  targetYear: 1 | 2 | 3 | 4 | 5
): number {
  if (property.type !== "BUC" || !property.ltv) {
    return 0;
  }

  const annualInterestRate = property.interestRate ?? INTEREST_RATE_PCT;
  const loanTenureYears = property.loanTenure || 30;
  const totalPaymentsInLoan = loanTenureYears * 12;
  
  const timeline = getBUCLoanDisbursementTimeline(property);

  if (timeline.length === 0) {
    return 0;
  }

  // For Year 5 onwards (month 49+), construction is completed and loan is fully disbursed
  // Use fixed monthly instalment like resale properties
  if (targetYear >= 5) {
    const totalLoanAmount = (property.purchasePrice * property.ltv) / 100;
    const monthsSinceLoanStart = 48; // Month 49 is the start of year 5
    const remainingPayments = totalPaymentsInLoan - monthsSinceLoanStart;
    
    if (remainingPayments > 0) {
      return Math.round(calculateMortgagePayment(
        totalLoanAmount,
        annualInterestRate,
        remainingPayments
      ));
    }
    return 0;
  }

  let totalInstallmentsForYear = 0;
  const startMonthInTimeline = (targetYear - 1) * 12 + 1; // Year 1 is months 1-12
  const endMonthInTimeline = targetYear * 12 + 1;

  // Loop through each of the 12 months of the target year
  for (let currentMonth = startMonthInTimeline; currentMonth < endMonthInTimeline; currentMonth++) {
    let loanBalanceForMonth = 0;

    // Find the cumulative loan amount at this month
    for (const stage of timeline) {
      if (stage.startMonth <= currentMonth) {
        loanBalanceForMonth = stage.cumulativeLoanAmount;
      } else {
        break; // Stop checking stages that haven't started yet
      }
    }

    // Calculate the remaining tenure from the start of the loan (month 1)
    // The remaining tenure should be based on how many months have passed since the loan started
    const monthsSinceLoanStart = currentMonth - 1; // Month 1 is month 0 since loan start
    const remainingPayments = totalPaymentsInLoan - monthsSinceLoanStart;

    if (loanBalanceForMonth > 0 && remainingPayments > 0) {
      const monthlyInstallment = calculateMortgagePayment(
        loanBalanceForMonth,
        annualInterestRate,
        remainingPayments // Use the correct remaining tenure
      );
      totalInstallmentsForYear += monthlyInstallment;
    }
  }

  const averageMonthlyInstallment = totalInstallmentsForYear / 12;
  
  return Math.round(averageMonthlyInstallment);
}

/**
 * UPDATED FUNCTION: Calls the new, more accurate averaging function.
 * Now includes Year 5 with fixed monthly instalment after construction completion.
 */
export function getBUCMonthlyInstalmentBreakdown(
  property: Property,
  estTOP: Date | null // estTOP is kept for API consistency but not used in the new calculation
): { year1: number; year2: number; year3: number; year4: number; year5: number } {
  if (property.type !== "BUC") {
    return { year1: 0, year2: 0, year3: 0, year4: 0, year5: 0 };
  }

  return {
    year1: calculateBUCAverageMonthlyInstalmentByYear(property, 1),
    year2: calculateBUCAverageMonthlyInstalmentByYear(property, 2),
    year3: calculateBUCAverageMonthlyInstalmentByYear(property, 3),
    year4: calculateBUCAverageMonthlyInstalmentByYear(property, 4),
    year5: calculateBUCAverageMonthlyInstalmentByYear(property, 5),
  };
}

// Function to get the complete loan disbursement timeline for BUC properties
export function getBUCLoanDisbursementTimeline(property: Property): {
  stage: string;
  startMonth: number;
  endMonth: number;
  percentage: number;
  loanAmount: number;
  cumulativeLoanAmount: number;
  year: number;
}[] {
  if (property.type !== "BUC" || !property.ltv) {
    return [];
  }

  const totalLoanAmount = (property.purchasePrice * property.ltv) / 100;
  
  const constructionStages = [
    { stage: "Foundation", percentage: 0.05, months: 6, startMonth: 1 },
    { stage: "Reinforced Concrete", percentage: 0.10, months: 6, startMonth: 7 },
    { stage: "Brick Wall", percentage: 0.05, months: 3, startMonth: 13 },
    { stage: "Ceiling/Roofing", percentage: 0.05, months: 3, startMonth: 16 },
    { stage: "Electrical/Plumbing", percentage: 0.05, months: 3, startMonth: 19 },
    { stage: "Roads/Car Parks", percentage: 0.05, months: 3, startMonth: 22 },
    { stage: "TOP", percentage: 0.25, months: 12, startMonth: 25 },
    { stage: "CSC", percentage: 0.15, months: 12, startMonth: 37 }
  ];

  const timeline = [];
  let remainingLoanAmount = totalLoanAmount;
  let cumulativeLoanAmount = 0;

  for (const stage of constructionStages) {
    const stageEndMonth = stage.startMonth + stage.months - 1; // End month is inclusive
    const stageDisbursement = property.purchasePrice * stage.percentage;
    let stageLoanAmount = 0;
    
    if (remainingLoanAmount > 0) {
      stageLoanAmount = Math.min(stageDisbursement, remainingLoanAmount);
      remainingLoanAmount -= stageLoanAmount;
      cumulativeLoanAmount += stageLoanAmount;
    }
    
    timeline.push({
      stage: stage.stage,
      startMonth: stage.startMonth,
      endMonth: stageEndMonth,
      percentage: stage.percentage * 100,
      loanAmount: Math.round(stageLoanAmount),
      cumulativeLoanAmount: Math.round(cumulativeLoanAmount),
      year: Math.ceil((stageEndMonth + 1) / 12), // Adjust year calculation for inclusive end month
    });
  }

  return timeline;
}

// Helper function to determine which construction stage the loan will start disbursing from
export function getBUCStartingStage(property: Property): {
  stage: string;
  startMonth: number;
  percentage: number;
  description: string;
} {
  if (property.type !== "BUC") {
    return { stage: "N/A", startMonth: 0, percentage: 0, description: "Not a BUC property" };
  }

  const totalLoanAmount = (property.purchasePrice * (property.ltv || 75)) / 100;
  const loanPercentage = (totalLoanAmount / property.purchasePrice) * 100;

  // For 75% loan (maximum), loan starts disbursing from Foundation stage (Year 1)
  // For lower loan amounts, loan starts disbursing from later stages
  if (loanPercentage >= 71) {
    return { stage: "Foundation", startMonth: 1, percentage: 5, description: "Starts at Foundation (Year 1)" };
  } else if (loanPercentage >= 61) {
    return { stage: "Reinforced Concrete", startMonth: 7, percentage: 10, description: "Starts at Reinforced Concrete (Year 1)" };
  } else if (loanPercentage >= 56) {
    return { stage: "Brick Wall", startMonth: 13, percentage: 5, description: "Starts at Brick Wall (Year 2)" };
  } else if (loanPercentage >= 51) {
    return { stage: "Ceiling/Roofing", startMonth: 16, percentage: 5, description: "Starts at Ceiling/Roofing (Year 2)" };
  } else if (loanPercentage >= 46) {
    return { stage: "Electrical/Plumbing", startMonth: 19, percentage: 5, description: "Starts at Electrical/Plumbing (Year 2)" };
  } else if (loanPercentage >= 41) {
    return { stage: "Roads/Car Parks", startMonth: 22, percentage: 5, description: "Starts at Roads/Car Parks (Year 2)" };
  } else if (loanPercentage >= 16) {
    return { stage: "TOP", startMonth: 25, percentage: 25, description: "Starts at TOP (Year 3)" };
  } else {
    return { stage: "CSC", startMonth: 37, percentage: 15, description: "Starts at CSC (Year 4)" };
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
    bankInterest = calculateBUCBankInterest(actualLoanAmount, property.purchasePrice, property.interestRate ?? INTEREST_RATE_PCT)
  } else {
    // Use the specific formula for resale properties
    bankInterest = calculateResaleBankInterest(actualLoanAmount, property.interestRate ?? INTEREST_RATE_PCT, YEARS, property.loanTenure || 30)
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
  // Calculate rental income tax based on new formula:
  // 1. Monthly rent × 12 × 0.85 (15% deduction for rental expenses) = net rental income per year
  // 2. Apply tax bracket percentage to get annual rental income tax
  // 3. Multiply by rental years to get total rental income tax for the rental period
  let taxOnRental = 0;
  
  if (isRentalApplicable && ctx.taxBracket > 0) {
    // Calculate net rental income per year (assuming 0 vacancy months)
    const annualRentalIncome = ctx.monthlyRental * 12;
    
    // Apply 15% deduction for rental expenses
    const netAnnualRentalIncome = annualRentalIncome * 0.85;
    
    // Calculate annual rental income tax based on selected tax bracket
    const annualRentalIncomeTax = netAnnualRentalIncome * (ctx.taxBracket / 100);
    
    // Calculate total rental income tax for the rental period
    if (property.type === "BUC") {
      // For BUC properties, calculate based on balance months after TOP
      const balanceMonths = calculateBalanceMonthAftTOP(property.estTOP, YEARS);
      
      if (balanceMonths > 0) {
        // Convert balance months to years and round up to nearest year
        // Example: 6 months = 1 year, 18 months = 2 years, etc.
        const rentalYears = Math.ceil(balanceMonths / 12);
        taxOnRental = annualRentalIncomeTax * rentalYears;
      }
      // If balanceMonths is 0, taxOnRental remains 0
    } else {
      // For Resale properties, use the full holding period
      taxOnRental = annualRentalIncomeTax * YEARS;
    }
  }

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
  const absd = calculateABSD(property.purchasePrice, property.absdCitizenship || "SC", property.absdPropertyCount || 1);

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

  // Calculate automatic property tax based on mode and holding period
  const automaticPropertyTax = calculateTotalPropertyTax(property, ctx.mode, YEARS);
  
  const totalOtherExpenses =
    bankInterest +
    maintenanceFeeTotal +
    automaticPropertyTax +
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
  
  // Calculate ROE using the correct formula:
  // ROE = Est. Net Profit / (Downpayment + Amortised Cumulative Principal Paid)
  const downpayment = property.purchasePrice - actualLoanAmount;
  
  let cumulativePrincipalPaid = 0;
  if (property.type === "BUC") {
    // For BUC properties, calculate principal paid during holding period
    cumulativePrincipalPaid = calculateBUCPrincipalPaid(actualLoanAmount, property.purchasePrice, property.interestRate ?? INTEREST_RATE_PCT, YEARS);
  } else {
    // For Resale properties, calculate principal paid during holding period
    cumulativePrincipalPaid = calculateResalePrincipalPaid(actualLoanAmount, property.interestRate ?? INTEREST_RATE_PCT, YEARS, property.loanTenure || 30);
  }
  
  const totalEquity = downpayment + cumulativePrincipalPaid;
  const roe = totalEquity > 0 ? (netProfit / totalEquity) * 100 : 0;
  
  // Calculate 4 years amortised principal returned using Method 1: Calculate Remaining Balance Directly
  // Step 1: Calculate remaining balance after 4 years
  // Step 2: Principal returned = Original Loan Amount - Remaining Balance
  const fourYearAmortisedPrincipal = calculateResalePrincipalPaid(actualLoanAmount, property.interestRate ?? INTEREST_RATE_PCT, 4, property.loanTenure || 30);
  
  // Total Cash/CPF Return = Downpayment + Est. Net Profits + 4 years Amortised Principal Returned
  const totalCashReturn = downpayment + netProfit + fourYearAmortisedPrincipal

  // Calculate monthly cash flow
  let monthlyCashFlow = 0
  if (ctx.monthlyRental > 0 || ctx.mode === "own") {
    let monthlyInstalment: number
    
    // For BUC properties in own stay mode, use year 4 average monthly instalment
    if (property.type === "BUC" && ctx.mode === "own") {
      const breakdown = getBUCMonthlyInstalmentBreakdown(property, property.estTOP)
      monthlyInstalment = breakdown.year4 || breakdown.year1
    } else {
      // For other cases, use the standard calculation
      monthlyInstalment = calculateMonthlyInstalmentForProperty(property, property.estTOP)
    }
    
    // Calculate monthly property tax correctly:
    // Use the same property tax calculation that's already working in the main calculation
    // but convert it to monthly for the cash flow
    const monthlyPropertyTax = automaticPropertyTax / (YEARS * 12)
    
    // For BUC properties, only deduct property tax and maintenance if they are applicable
    let applicableMonthlyPropertyTax = 0
    let applicableMonthlyMaintenance = 0
    
    if (property.type === "BUC") {
      // For BUC properties, check if property tax and maintenance are applicable
      // Property tax is only applicable after TOP
      if (monthlyPropertyTax > 0) {
        applicableMonthlyPropertyTax = monthlyPropertyTax
      }
      
      // Maintenance fee is only applicable after TOP
      if (property.monthlyMaintenance > 0) {
        applicableMonthlyMaintenance = property.monthlyMaintenance
      }
      

    } else {
      // For resale properties, always apply both
      applicableMonthlyPropertyTax = monthlyPropertyTax
      applicableMonthlyMaintenance = property.monthlyMaintenance
    }
    
    // For own stay analysis, pretend rental income is 0, then deduct the rest
    const effectiveRentalIncome = ctx.mode === "own" ? 0 : ctx.monthlyRental
    monthlyCashFlow = effectiveRentalIncome - (monthlyInstalment + applicableMonthlyPropertyTax + applicableMonthlyMaintenance)
  }

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
    propertyTax: automaticPropertyTax,
    monthlyCashFlow,
  }
}

// Function to calculate amortized cumulative principal paid for BUC properties
// For BUC properties, we need to calculate principal paid during the holding period
// based on the construction phases and loan disbursement schedule
function calculateBUCPrincipalPaid(loanAmount: number, purchasePrice: number, annualInterestRate: number, holdingPeriod: number): number {
  if (loanAmount <= 0 || annualInterestRate <= 0 || holdingPeriod <= 0) {
    return 0;
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  
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
  ];
  
  let totalPrincipalPaid = 0;
  let cumulativeDisbursed = 0;
  const holdingPeriodMonths = holdingPeriod * 12;
  
  // Calculate principal paid for each construction phase within the holding period
  constructionPhases.forEach(phase => {
    // Check if this phase falls within the holding period
    if (phase.startMonth <= holdingPeriodMonths) {
      // Calculate how many months of this phase are within the holding period
      const phaseStartMonth = phase.startMonth;
      const phaseEndMonth = Math.min(phaseStartMonth + phase.months - 1, holdingPeriodMonths);
      const applicableMonths = Math.max(0, phaseEndMonth - phaseStartMonth + 1);
      
      if (applicableMonths > 0) {
        // Add this phase's disbursement to cumulative total
        const phaseDisbursement = purchasePrice * phase.percentage;
        cumulativeDisbursed += phaseDisbursement;
        
        // Calculate monthly payment for the current cumulative disbursed amount
        // Use a 30-year amortization period for BUC properties
        const loanTenureYears = 30;
        const totalPayments = loanTenureYears * 12;
        
        // Calculate monthly payment using standard mortgage formula
        const numerator = cumulativeDisbursed * monthlyRate * Math.pow(1 + monthlyRate, totalPayments);
        const denominator = Math.pow(1 + monthlyRate, totalPayments) - 1;
        const monthlyPayment = numerator / denominator;
        
        // Calculate principal portion for each applicable month
        for (let month = 0; month < applicableMonths; month++) {
          // Calculate interest portion for this month
          const monthlyInterest = cumulativeDisbursed * monthlyRate;
          // Principal portion = Monthly payment - Interest portion
          const monthlyPrincipal = monthlyPayment - monthlyInterest;
          
          totalPrincipalPaid += monthlyPrincipal;
          
          // Update cumulative disbursed amount for next month
          cumulativeDisbursed -= monthlyPrincipal;
        }
      }
    }
  });
  
  return Math.round(totalPrincipalPaid);
}

// Function to calculate amortized cumulative principal paid for resale properties
// This extracts the principal calculation logic from the existing calculateResaleBankInterest function
function calculateResalePrincipalPaid(loanAmount: number, annualInterestRate: number, holdingPeriod: number, loanTenureYears: number = 30): number {
  if (loanAmount <= 0 || annualInterestRate <= 0 || holdingPeriod <= 0 || loanTenureYears <= 0) {
    return 0;
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  const totalPayments = loanTenureYears * 12;
  const targetPayments = holdingPeriod * 12;

  // Step 1: Calculate monthly payment using standard mortgage formula
  const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments);
  const denominator = Math.pow(1 + monthlyRate, totalPayments) - 1;
  const monthlyPayment = numerator / denominator;

  // Step 2: Calculate remaining balance after target payments
  const remainingBalance = loanAmount * (Math.pow(1 + monthlyRate, totalPayments) - Math.pow(1 + monthlyRate, targetPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);

  // Step 3: Calculate principal paid during holding period
  const principalPaid = loanAmount - remainingBalance;

  return Math.round(principalPaid);
}
