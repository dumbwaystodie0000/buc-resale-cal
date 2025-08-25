import type { Property, TaxBracket, SavedProperty } from "./types";

export const YEARS = 4;
export const INTEREST_RATE_PCT = 1.94;

export const mockFolders = [
  "Singapore Properties",
  "Investment Portfolio",
  "Personal Collection",
];

export const mockSavedProperties: SavedProperty[] = [
  {
    id: "1",
    name: "Marina Bay Condo",
    type: "BUC",
    purchasePrice: 1200000,
    folder: "Singapore Properties",
  },
  {
    id: "2",
    name: "Punggol BTO",
    type: "BUC",
    purchasePrice: 800000,
    folder: "Singapore Properties",
  },
  {
    id: "3",
    name: "Orchard Resale",
    type: "Resale",
    purchasePrice: 2500000,
    folder: "Investment Portfolio",
  },
  {
    id: "4",
    name: "Sentosa Cove Villa",
    type: "Resale",
    purchasePrice: 5000000,
    folder: "Investment Portfolio",
  },
  {
    id: "5",
    name: "Woodlands Executive Condo",
    type: "BUC",
    purchasePrice: 950000,
    folder: "Personal Collection",
  },
];

export const TAX_BRACKETS: readonly TaxBracket[] = [
  { id: "0-20k", range: "$0 - $20k", rate: 0 },
  { id: "20-30k", range: "$20k - $30k", rate: 2 },
  { id: "30-40k", range: "$30k - $40k", rate: 3.5 },
  { id: "40-80k", range: "$40k - $80k", rate: 7 },
  { id: "80-120k", range: "$80k - $120k", rate: 11.5 },
  { id: "120-160k", range: "$120k - $160k", rate: 15 },
  { id: "160-200k", range: "$160k - $200k", rate: 18 },
  { id: "200-240k", range: "$200k - $240k", rate: 19 },
  { id: "240-280k", range: "$240k - $280k", rate: 19.5 },
  { id: "280-320k", range: "$280k - $320k", rate: 20 },
  { id: "320-500k", range: "$320k - $500k", rate: 22 },
  { id: "500k-1m", range: "$500k - $1m", rate: 23 },
  { id: "above-1m", range: "Above $1m", rate: 24 },
];

export const defaultPropertyBase: Omit<Property, "id"> = {
  name: "",
  type: "BUC",
  purchasePrice: 0,
  loanTenure: 30,
  interestRate: 1.94,
  ltv: 75,
  bankLoan: 0,
  projectedGrowth: 0,
  annualGrowth: 0,
  rentalIncome: 0,
  monthlyRental: 0,
  vacancyMonth: 0,
  maintenanceFee: 0,
  monthlyMaintenance: 0,
  propertyTax: 0,
  taxBracket: 0,
  minorRenovation: 0,
  furnitureFittings: 0,
  agentCommission: 0,
  otherExpenses: 0,
  monthlyRentWhileWaiting: 0,
  estTOP: null,
  balanceMonthAftTOP: 48,
  holdingPeriod: 4,
};
