import DashboardPage from "../../components/dashboard/DashboardPage";
import OverviewTab from "../../components/finances/OverviewTab";
import TrendsTab from "../../components/finances/TrendsTab";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import { GlobalConfig } from "../../GlobalConfig";

export default function Finances() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${GlobalConfig.apiUrl}/v1/currencies`);
      setCurrencies(response.data.currencies);
      if (response.data.currencies.length > 0) {
        setSelectedCurrency(response.data.currencies[0].id);
      }
    } catch {
      setError("Failed to load currencies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  if (error) {
    return (
      <DashboardPage title="Error">
        <p className="text-red-500 text-center">{error}</p>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage title="Financial Overview">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Overview</h1>
        <select
          className="select select-bordered"
          onChange={handleCurrencyChange}
          value={selectedCurrency || ""}
        >
          {loading ? (
            <option>Loading currencies...</option>
          ) : (
            <>
              <option value="">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.name}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      <div className="tabs tabs-border">
        <input
          type="radio"
          name="financial_overview_tabs"
          className="tab"
          aria-label="Overview"
          defaultChecked
        />
        <OverviewTab selectedCurrency={selectedCurrency} />

        <input
          type="radio"
          name="financial_overview_tabs"
          className="tab"
          aria-label="Trends"
        />
        <TrendsTab selectedCurrency={selectedCurrency} />
      </div>
    </DashboardPage>
  );
}
