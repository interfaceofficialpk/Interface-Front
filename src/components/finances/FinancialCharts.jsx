import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import { GlobalConfig } from "../../GlobalConfig";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define some colors for the pie chart segments
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF19A6",
  "#19FFD8",
  "#FF5733",
];

// Helper function to format currency for display
const formatCurrency = (amount, currencyCode) => {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(amount);
};

export default function FinancialCharts({
  selectedCurrency,
  startDate,
  endDate,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incomeByType, setIncomeByType] = useState([]);
  const [pendingIncomeByType, setPendingIncomeByType] = useState([]);
  const [expensesByType, setExpensesByType] = useState([]);
  const [currencyCode, setCurrencyCode] = useState("USD");

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCurrency) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("currencyId", selectedCurrency);
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());

      try {
        const endpoints = [
          `/v1/dashboard/finances/received-income-by-type?${params.toString()}`,
          `/v1/dashboard/finances/expenses-by-type?${params.toString()}`,
          `/v1/dashboard/finances/pending-income-by-type?${params.toString()}`,
        ];

        const responses = await Promise.all(
          endpoints.map((url) => api.get(`${GlobalConfig.apiUrl}${url}`))
        );

        setIncomeByType(responses[0].data.incomeTypeSummaries);
        setExpensesByType(responses[1].data.expenseTypeSummaries);
        setPendingIncomeByType(responses[2].data.incomeTypeSummaries);
        setCurrencyCode(responses[0].data.currencyCode || "USD");
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCurrency, startDate, endDate]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <p>Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  const renderChart = (data, dataKey, nameKey, title) => (
    <div className="card bg-base-100/50 border border-primary">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${title
                      .toLowerCase()
                      .replace(/ /g, "-")}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${formatCurrency(value, currencyCode)}`,
                  props.payload[nameKey],
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">
            No {title.toLowerCase()} data for this currency and period.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {renderChart(
        incomeByType,
        "totalAmount",
        "incomeTypeName",
        "Income by Type (Received)"
      )}
      {renderChart(
        pendingIncomeByType,
        "totalAmount",
        "incomeTypeName",
        "Income by Type (Pending)"
      )}
      {renderChart(
        expensesByType,
        "totalAmount",
        "expenseTypeName",
        "Expenses by Type"
      )}
    </div>
  );
}
