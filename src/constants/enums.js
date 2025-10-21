// Map enum integer values to readable labels and store the permission key
export const UserPermissionOptions = [
  { value: 0, label: "Locations View", key: "Locations_View" },
  { value: 1, label: "Locations Edit", key: "Locations_Edit" },
  { value: 2, label: "Nationalities View", key: "Nationalities_View" },
  { value: 3, label: "Nationalities Edit", key: "Nationalities_Edit" },
  { value: 4, label: "Income Types View", key: "IncomeTypes_View" },
  { value: 5, label: "Income Types Edit", key: "IncomeTypes_Edit" },
  { value: 6, label: "Expense Types View", key: "ExpenseTypes_View" },
  { value: 7, label: "Expense Types Edit", key: "ExpenseTypes_Edit" },
  { value: 8, label: "Expenses View", key: "Expenses_View" },
  { value: 9, label: "Expenses Edit", key: "Expenses_Edit" },
  { value: 10, label: "Incomes View", key: "Incomes_View" },
  { value: 11, label: "Incomes Edit", key: "Incomes_Edit" },
  { value: 12, label: "University Types View", key: "UniversityTypes_View" },
  { value: 13, label: "University Types Edit", key: "UniversityTypes_Edit" },
  { value: 14, label: "Program Types View", key: "ProgramTypes_View" },
  { value: 15, label: "Program Types Edit", key: "ProgramTypes_Edit" },
  { value: 16, label: "Document Types View", key: "DocumentTypes_View" },
  { value: 17, label: "Document Types Edit", key: "DocumentTypes_Edit" },
  { value: 18, label: "Employees View", key: "Employees_View" },
  { value: 19, label: "Employees Edit", key: "Employees_Edit" },
  { value: 20, label: "Currencies View", key: "Currencies_View" },
  { value: 21, label: "Currencies Edit", key: "Currencies_Edit" },
];

// Helper to get permission key from value (useful for initial form state)
export const getPermissionKeyByValue = (value) => {
  return UserPermissionOptions.find((opt) => opt.value === value)?.key;
};
