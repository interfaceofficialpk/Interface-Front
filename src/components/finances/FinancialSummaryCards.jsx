import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import { GlobalConfig } from "../../GlobalConfig";

// Helper function to format currency for display
const formatCurrency = (amount, currencyCode) => {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(amount);
};

export default function FinancialSummaryCards({ selectedCurrency, startDate, endDate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    totalIncome: null,
    totalExpectedIncome: null,
    totalExpenses: null,
    netProfit: null,
    netExpectedProfit: null,
    incomeExpenseRatio: null,
  });

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
          `/v1/dashboard/finances/total-income?${params.toString()}`,
          `/v1/dashboard/finances/total-expected-income?${params.toString()}`,
          `/v1/dashboard/finances/total-expenses?${params.toString()}`,
          `/v1/dashboard/finances/net-profit?${params.toString()}`,
          `/v1/dashboard/finances/net-expected-profit?${params.toString()}`,
          `/v1/dashboard/finances/income-expense-ratio?${params.toString()}`,
        ];

        const responses = await Promise.all(
          endpoints.map((url) => api.get(`${GlobalConfig.apiUrl}${url}`))
        );

        setData({
          totalIncome: responses[0].data,
          totalExpectedIncome: responses[1].data,
          totalExpenses: responses[2].data,
          netProfit: responses[3].data,
          netExpectedProfit: responses[4].data,
          incomeExpenseRatio: responses[5].data,
        });
      } catch (err) {
        console.error("Error fetching summary data:", err);
        setError("Failed to load summary data.");
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
        <p>Loading summary data...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  const { totalIncome, totalExpectedIncome, totalExpenses, netProfit, netExpectedProfit, incomeExpenseRatio } = data;
  const currentCurrencyCode = totalIncome?.currencyCode || "USD";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Total Received Income Card */}
        <div className="card border bg-base-100/50 border-primary">
          <div className="card-body">
            <h2 className="card-title text-xl">Total Received Income</h2>
            <p className="text-3xl font-bold text-success">
              {formatCurrency(totalIncome?.totalAmount, currentCurrencyCode)}
            </p>
          </div>
        </div>

        {/* Total Expected Income Card */}
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title text-xl">Total Expected Income</h2>
            <p className="text-3xl font-bold text-info">
              {formatCurrency(totalExpectedIncome?.totalAmount, currentCurrencyCode)}
            </p>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title text-xl">Total Expenses</h2>
            <p className="text-3xl font-bold text-error">
              {formatCurrency(totalExpenses?.totalAmount, currentCurrencyCode)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Net Profit Card */}
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title text-xl">Net Profit (Received)</h2>
            <p className={`text-3xl font-bold ${netProfit?.netProfitAmount >= 0 ? "text-success" : "text-error"}`}>
              {formatCurrency(netProfit?.netProfitAmount, currentCurrencyCode)}
            </p>
          </div>
        </div>

        {/* Net Expected Profit Card */}
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title text-xl">Net Expected Profit (All Income)</h2>
            <p className={`text-3xl font-bold ${netExpectedProfit?.netProfitAmount >= 0 ? "text-success" : "text-error"}`}>
              {formatCurrency(netExpectedProfit?.netProfitAmount, currentCurrencyCode)}
            </p>
          </div>
        </div>

        {/* Income to Expense Ratio Card */}
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title text-xl">Income to Expense Ratio</h2>
            {incomeExpenseRatio?.ratio !== null ? (
              <p className="text-3xl font-bold">{incomeExpenseRatio?.ratio?.toFixed(2)} : 1</p>
            ) : (
              <p className="text-xl font-bold text-warning">
                {incomeExpenseRatio?.message || "Not available"}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}