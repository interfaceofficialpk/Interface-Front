import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import { GlobalConfig } from "../../GlobalConfig";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TrendInterval = {
  Daily: 0,
  Monthly: 1,
  Yearly: 2,
};

const IncomeStatus = {
  Received: 0,
  Pending: 1,
};

// Helper function to format a date to 'YYYY-MM-DD' for date inputs
const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function TrendsTab({ selectedCurrency }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize dates to a default range (last 12 months)
  const defaultEndDate = new Date();
  const defaultStartDate = new Date(defaultEndDate);
  defaultStartDate.setFullYear(defaultEndDate.getFullYear() - 1);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const [interval, setInterval] = useState(TrendInterval.Monthly);
  const [incomeStatusFilter, setIncomeStatusFilter] = useState(null);

  const [combinedTrendData, setCombinedTrendData] = useState([]);

  const formatCurrency = (amount, currencyCode) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode || "USD",
    }).format(amount);
  };

  const fetchData = async () => {
    if (!selectedCurrency || startDate > endDate) {
      setLoading(false);
      setCombinedTrendData([]);
      if (startDate > endDate) {
        setError("Start date cannot be after the end date.");
      }
      return;
    }

    setLoading(true);
    setError(null);

    const commonParams = new URLSearchParams();
    commonParams.append("currencyId", selectedCurrency);
    commonParams.append("startDate", startDate.toISOString());
    commonParams.append("endDate", endDate.toISOString());
    commonParams.append("interval", interval);

    try {
      const incomeTrendUrl = `/v1/dashboard/finances/income-trend?${commonParams.toString()}${
        incomeStatusFilter !== null
          ? `&incomeStatusFilter=${incomeStatusFilter}`
          : ""
      }`;
      const expenseTrendUrl = `/v1/dashboard/finances/expense-trend?${commonParams.toString()}`;

      const [incomeRes, expenseRes] = await Promise.all([
        api.get(`${GlobalConfig.apiUrl}${incomeTrendUrl}`),
        api.get(`${GlobalConfig.apiUrl}${expenseTrendUrl}`),
      ]);

      const incomeData = incomeRes.data.trendData;
      const expenseData = expenseRes.data.trendData;

      const combinedDataMap = new Map();

      incomeData.forEach((d) => {
        combinedDataMap.set(d.periodStart, {
          periodStart: d.periodStart,
          incomeAmount: d.totalAmount,
          currencyCode: d.currencyCode,
        });
      });

      expenseData.forEach((d) => {
        const existing = combinedDataMap.get(d.periodStart);
        combinedDataMap.set(d.periodStart, {
          ...existing,
          periodStart: d.periodStart,
          expenseAmount: d.totalAmount,
          currencyCode: d.currencyCode,
        });
      });

      const formattedCombinedData = Array.from(combinedDataMap.values()).map(
        (d) => {
          const formattedDate = (() => {
            const date = new Date(d.periodStart);
            switch (interval) {
              case TrendInterval.Daily:
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              case TrendInterval.Monthly:
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                });
              case TrendInterval.Yearly:
                return date.getFullYear().toString();
              default:
                return d.periodStart;
            }
          })();
          return {
            ...d,
            period: formattedDate,
            incomeAmount: d.incomeAmount || 0,
            expenseAmount: d.expenseAmount || 0,
          };
        }
      );

      formattedCombinedData.sort(
        (a, b) => new Date(a.periodStart) - new Date(b.periodStart)
      );

      setCombinedTrendData(formattedCombinedData);
    } catch (err) {
      console.error("Error fetching trend data:", err);
      setError("Failed to load financial trend data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Re-fetch data whenever any filter changes
    fetchData();
  }, [selectedCurrency, startDate, endDate, interval, incomeStatusFilter]);

  if (!selectedCurrency) {
    return (
      <div className="tab-content border-base-300 p-4">
        <p className="text-center text-gray-500">
          Please select a currency to view financial trends.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content border-base-300 p-4">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  const currentCurrencyCode = combinedTrendData[0]?.currencyCode || "USD";

  return (
    <div className="tab-content border-base-300 p-4">
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="label">
            <span className="label-text">Start Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={formatDateForInput(startDate)}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">End Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={formatDateForInput(endDate)}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Interval</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value))}
          >
            <option value={TrendInterval.Daily}>Daily</option>
            <option value={TrendInterval.Monthly}>Monthly</option>
            <option value={TrendInterval.Yearly}>Yearly</option>
          </select>
        </div>
        <div>
          <label className="label">
            <span className="label-text">Income Status Filter</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={incomeStatusFilter === null ? "" : incomeStatusFilter}
            onChange={(e) =>
              setIncomeStatusFilter(
                e.target.value === "" ? null : parseInt(e.target.value)
              )
            }
          >
            <option value="">All Income</option>
            <option value={IncomeStatus.Received}>Received</option>
            <option value={IncomeStatus.Pending}>Pending</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading trend data...</p>
        </div>
      ) : (
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title">Income vs. Expense Trend</h2>
            {combinedTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={combinedTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis
                    tickFormatter={(value) =>
                      formatCurrency(value, currentCurrencyCode)
                    }
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      formatCurrency(value, currentCurrencyCode),
                      name,
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="incomeAmount"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenseAmount"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">
                No financial trend data for the selected period/filters.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
