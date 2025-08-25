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
  // Fields always N/A for BUC, regardless of mode
  const commonBucNAFields = [
    "minorRenovation",
    "furnitureFittings",
    "propertyTax",
    "maintenanceFee",
    "monthlyRental",
  ];

  if (property.type === "BUC") {
    if (commonBucNAFields.includes(field)) return true;
    if (field === "agentCommission" && mode === "investment") return true;
  }

  // Specific conditions for agent commission
  if (
    field === "agentCommission" &&
    mode === "own" &&
    property.type === "Resale"
  ) {
    return true;
  }

  return false;
}

// Calculate the number of months from current date to estimated TOP date
export function calculateBalanceMonthAftTOP(estTOP: Date | null): number {
  if (!estTOP) return 0;
  
  const currentDate = new Date();
  const topDate = new Date(estTOP);
  
  // Calculate the difference in months
  const yearDiff = topDate.getFullYear() - currentDate.getFullYear();
  const monthDiff = topDate.getMonth() - currentDate.getMonth();
  
  let totalMonths = yearDiff * 12 + monthDiff;
  
  // Adjust for day of month
  if (topDate.getDate() < currentDate.getDate()) {
    totalMonths--;
  }
  
  return Math.max(0, totalMonths);
}
