import { useState } from "react";
import FinancialSummaryCards from "./FinancialSummaryCards";
import FinancialCharts from "./FinancialCharts";

export default function OverviewTab({ selectedCurrency }) {
  // Date range states for the overview tab
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  if (!selectedCurrency) {
    return (
      <div className="tab-content border-base-300 p-4">
        <p className="text-center text-gray-500">
          Please select a currency to view the financial overview.
        </p>
      </div>
    );
  }

  return (
    <div className="tab-content border-base-300 p-4">
      {/* Date Range Selectors */}
      <div className="mb-4 flex justify-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={startDate ? startDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setStartDate(e.target.value ? new Date(e.target.value) : null)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={endDate ? endDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setEndDate(e.target.value ? new Date(e.target.value) : null)
            }
          />
        </div>
      </div>

      <FinancialSummaryCards
        selectedCurrency={selectedCurrency}
        startDate={startDate}
        endDate={endDate}
      />
      <br />
      <FinancialCharts
        selectedCurrency={selectedCurrency}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
