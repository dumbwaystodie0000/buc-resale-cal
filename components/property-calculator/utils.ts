import type { Property, Mode } from "./types";

// Currency formatting options
export interface CurrencyFormatOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useThousandSeparators?: boolean;
}

// Default currency formatting for SGD
export const fmtCurrency = (n: number, options?: CurrencyFormatOptions) => {
  const {
    currency = "SGD",
    locale = "en-SG",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    useThousandSeparators = true,
  } = options || {};

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping: useThousandSeparators,
  }).format(Number.isFinite(n) ? n : 0);
};

// Format number with thousand separators (no currency symbol)
export const fmtNumber = (
  n: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
  },
) => {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    locale = "en-SG",
  } = options || {};

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping: true,
  }).format(Number.isFinite(n) ? n : 0);
};

// Quick formatters for common use cases
export const fmtCurrencyWithCents = (n: number) =>
  fmtCurrency(n, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtCurrencyCompact = (n: number) => {
  if (Math.abs(n) >= 1_000_000) {
    return fmtCurrency(n / 1_000_000, { maximumFractionDigits: 1 }) + "M";
  }
  if (Math.abs(n) >= 1_000) {
    return fmtCurrency(n / 1_000, { maximumFractionDigits: 1 }) + "K";
  }
  return fmtCurrency(n);
};

export const fmtPercent = (n: number, dp = 1) =>
  `${Number.isFinite(n) ? n.toFixed(dp) : "0.0"}%`;

export const fmtRate = (n: number) =>
  Number.isInteger(n) ? `${n}%` : `${n.toFixed(2)}%`;

export function isFieldNotApplicable(
  property: Property,
  field: keyof Property,
  mode: Mode,
) {
  // Fields that can be enabled for BUC if balance months after TOP > 0
  const conditionalBucFields = [
    "minorRenovation",
    "furnitureFittings",
    "propertyTax",
    "maintenanceFee",
    "monthlyRental",
    "agentCommission",
    "commissionRate",
  ];

  if (property.type === "BUC") {
    // Check if these fields should be enabled based on balance months after TOP
    if (conditionalBucFields.includes(field)) {
      // For BUC properties, check if there are balance months after TOP
      // If balanceMonths > 0, enable the field; otherwise show N/A
      // Note: We'll need to pass the balance months or calculate them here
      // For now, we'll always show N/A for BUC, but this will be overridden
      // in the property table component based on the actual balance months
      return true; // This will be overridden in the component
    }
  }

  // Specific conditions for agent commission
  if (
    (field === "agentCommission" || field === "commissionRate") &&
    mode === "own" &&
    property.type === "Resale"
  ) {
    return true;
  }

  return false;
}

// Calculate the balance months after TOP (remaining time in holding period after TOP is reached)
export function calculateBalanceMonthAftTOP(estTOP: Date | null, holdingPeriod: number = 4): number {
  if (!estTOP) return 0;
  
  const currentDate = new Date();
  const topDate = new Date(estTOP);
  
  // Calculate months to TOP using the same logic as calculateMonthsToTOP
  // This gives us how many months from now until TOP is reached
  const monthsToTOP = (topDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                      (topDate.getMonth() - currentDate.getMonth());
  
  // Calculate balance months after TOP: Holding Period - Months to TOP
  // This gives us the remaining months in the holding period after TOP is reached
  // Example: If holding period is 48 months and TOP is 5 months away, 
  // balance months = 48 - 5 = 43 months
  const holdingPeriodMonths = holdingPeriod * 12;
  const balanceMonths = holdingPeriodMonths - monthsToTOP;
  
  return Math.max(0, balanceMonths);
}

// Calculate the months from today until TOP date (for rent calculation)
export function calculateMonthsToTOP(estTOP: Date | null): number {
  if (!estTOP) return 0;
  
  const currentDate = new Date();
  const topDate = new Date(estTOP);
  
  // Calculate months difference: (TOP Year - Current Year) * 12 + (TOP Month - Current Month)
  // We don't add +1 because we want to count from the NEXT month after current month
  // So if today is August 2025 and TOP is March 2026, we count: Sep, Oct, Nov, Dec, Jan, Feb, Mar = 7 months
  const monthsToTOP = (topDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                      (topDate.getMonth() - currentDate.getMonth());
  
  // Return the months to TOP, but only if it's positive (TOP is in the future)
  return Math.max(0, monthsToTOP);
}
