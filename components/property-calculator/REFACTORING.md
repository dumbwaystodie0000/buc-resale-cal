# Property Table Refactoring

The original `property-table.tsx` file was quite lengthy (1272 lines) and has been refactored into smaller, more manageable components for better maintainability and readability.

## New Component Structure

### 1. **TableHeader** (`table-header.tsx`)
- Handles the table header with property type badges, names, editing, and save options
- Manages inline editing of property names
- Contains the holding period input
- Handles property removal and save operations

### 2. **BasicPropertyData** (`basic-property-data.tsx`)
- Contains basic property information fields:
  - Purchase Price
  - Loan Tenure (Years)
  - Interest Rate %
  - LTV %
  - Bank Loan (calculated)
  - Est. TOP (Month-Year)

### 3. **GrowthRentalSection** (`growth-rental-section.tsx`)
- Handles growth and rental-related calculations:
  - Projected Property Growth
  - Rental Income (investment mode)
  - Vacancy Month
  - Est. Gross Profit

### 4. **ExpensesSection** (`expenses-section.tsx`)
- Manages all expense-related fields:
  - Rent while waiting for BUC (own mode)
  - Total Interest Payable
  - Maintenance Fee
  - SSD Payable
  - Property Tax
  - Income Tax on Net Rental (investment mode)
  - Minor Renovation
  - Furniture & Fittings
  - Rental Agent Commission (investment mode)
  - Other Expenses
  - Total Expenses

### 5. **CreateFolderDialog** (`create-folder-dialog.tsx`)
- Standalone dialog component for creating new folders
- Handles folder creation and property saving

### 6. **HoldingPeriodInput** (`holding-period-input.tsx`)
- Reusable input component for holding period
- Includes validation and formatting

### 7. **VacancyMonthSelector** (`vacancy-month-selector.tsx`)
- Dropdown selector for vacancy months (0-24 months)

### 8. **PropertyTableRefactored** (`property-table-refactored.tsx`)
- Main component that orchestrates all the smaller components
- Maintains the same API as the original PropertyTable
- Significantly cleaner and more maintainable

## Benefits of Refactoring

1. **Improved Readability**: Each component has a single responsibility
2. **Better Maintainability**: Changes to specific sections are isolated
3. **Easier Testing**: Individual components can be tested in isolation
4. **Code Reusability**: Components like `HoldingPeriodInput` can be reused
5. **Reduced Complexity**: Main component is now much simpler to understand

## Usage

The refactored components maintain the exact same API as the original `PropertyTable`. You can simply replace:

```tsx
import PropertyTable from "./property-table";

// With:
import PropertyTableRefactored from "./property-table-refactored";
```

## File Size Comparison

- **Original**: `property-table.tsx` - 1272 lines
- **Refactored**: `property-table-refactored.tsx` - ~250 lines
- **Total Components**: 8 focused, single-responsibility components

## Migration Notes

- All props and functionality remain identical
- No breaking changes to the public API
- The original file can be kept as a backup during transition
- All data-oid attributes have been preserved for testing purposes 