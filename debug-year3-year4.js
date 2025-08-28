// Debug script to understand why Year 3 and Year 4 aren't showing $2,334 and $2,998

// Mock property data for testing
const testProperty = {
  type: "BUC",
  purchasePrice: 1000000, // $1M property
  ltv: 75, // 75% loan
  interestRate: 2.0, // 2% annual interest
  loanTenure: 30 // 30 years
};

// Helper function to calculate monthly mortgage payment
function calculateMortgagePayment(principal, annualRate, tenureInMonths) {
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

// Test the specific values from the table
console.log("Testing specific values from the table:");
console.log("Property:", testProperty);

// Test TOP stage (Year 3) - $600,000 loan
console.log("\n--- TOP Stage (Year 3) ---");
console.log("Loan amount: $600,000");
console.log("Start month: 25");

// Calculate remaining tenure from month 25
const totalPayments = 30 * 12; // 360 months
const monthsSinceStart = 25 - 1; // Month 25 is 24 months after start
const remainingPayments = totalPayments - monthsSinceStart; // 360 - 24 = 336 months

console.log(`Total payments: ${totalPayments}`);
console.log(`Months since start: ${monthsSinceStart}`);
console.log(`Remaining payments: ${remainingPayments}`);

const topMonthlyPayment = calculateMortgagePayment(600000, 2.0, remainingPayments);
console.log(`TOP monthly payment: $${topMonthlyPayment.toFixed(2)}`);

// Test CSC stage (Year 4) - $750,000 loan
console.log("\n--- CSC Stage (Year 4) ---");
console.log("Loan amount: $750,000");
console.log("Start month: 37");

// Calculate remaining tenure from month 37
const monthsSinceStartCSC = 37 - 1; // Month 37 is 36 months after start
const remainingPaymentsCSC = totalPayments - monthsSinceStartCSC; // 360 - 36 = 324 months

console.log(`Months since start: ${monthsSinceStartCSC}`);
console.log(`Remaining payments: ${remainingPaymentsCSC}`);

const cscMonthlyPayment = calculateMortgagePayment(750000, 2.0, remainingPaymentsCSC);
console.log(`CSC monthly payment: $${cscMonthlyPayment.toFixed(2)}`);

// Test our current calculation method
console.log("\n--- Testing our current calculation method ---");

function calculateBUCAverageMonthlyInstalmentByYear(property, targetYear) {
  const annualInterestRate = property.interestRate ?? 2.0;
  const loanTenureYears = property.loanTenure || 30;
  const totalPaymentsInLoan = loanTenureYears * 12;
  
  // Simplified timeline for testing
  const timeline = [
    { startMonth: 1, cumulativeLoanAmount: 50000 },
    { startMonth: 7, cumulativeLoanAmount: 150000 },
    { startMonth: 13, cumulativeLoanAmount: 200000 },
    { startMonth: 16, cumulativeLoanAmount: 250000 },
    { startMonth: 19, cumulativeLoanAmount: 300000 },
    { startMonth: 22, cumulativeLoanAmount: 350000 },
    { startMonth: 25, cumulativeLoanAmount: 600000 },
    { startMonth: 37, cumulativeLoanAmount: 750000 }
  ];

  let totalInstallmentsForYear = 0;
  const startMonthInTimeline = (targetYear - 1) * 12 + 1; // Year 1 is months 1-12
  const endMonthInTimeline = targetYear * 12 + 1;

  console.log(`Year ${targetYear}: months ${startMonthInTimeline}-${endMonthInTimeline-1}`);

  // Loop through each of the 12 months of the target year
  for (let currentMonth = startMonthInTimeline; currentMonth < endMonthInTimeline; currentMonth++) {
    let loanBalanceForMonth = 0;
    let disbursementStartMonth = 0;

    // Find the cumulative loan amount and the start month of that disbursement stage
    for (const stage of timeline) {
      if (stage.startMonth <= currentMonth) {
        loanBalanceForMonth = stage.cumulativeLoanAmount;
        disbursementStartMonth = stage.startMonth;
      } else {
        break;
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
        remainingPayments
      );
      totalInstallmentsForYear += monthlyInstallment;
      
      if (targetYear === 3 || targetYear === 4) {
        console.log(`  Month ${currentMonth}: $${loanBalanceForMonth.toLocaleString()} over ${remainingPayments} months = $${monthlyInstallment.toFixed(2)}`);
      }
    }
  }

  const averageMonthlyInstallment = totalInstallmentsForYear / 12;
  return Math.round(averageMonthlyInstallment);
}

console.log("\nCalculated yearly averages:");
for (let year = 1; year <= 4; year++) {
  const avgMonthly = calculateBUCAverageMonthlyInstalmentByYear(testProperty, year);
  console.log(`Year ${year}: $${avgMonthly.toLocaleString()}`);
} 