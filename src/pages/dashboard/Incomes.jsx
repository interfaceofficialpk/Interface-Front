import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateIncomeModal from "../../components/incomes/CreateIncomeModal";
import EditIncomeModal from "../../components/incomes/EditIncomeModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function Incomes() {
  const [incomes, setIncomes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [incomeTypes, setIncomeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [selectedIncomeTypeId, setSelectedIncomeTypeId] = useState("");
  const [selectedIncomeStatus, setSelectedIncomeStatus] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const params = {
        searchTerm: debouncedSearchTerm,
        pageNumber: pageNumber,
        pageSize: pageSize,
      };

      if (selectedIncomeTypeId) {
        params.incomeTypeId = selectedIncomeTypeId;
      }

      if (selectedIncomeStatus) {
        params.status = selectedIncomeStatus;
      }

      if (selectedCurrency) {
        params.currencyId = selectedCurrency;
      }

      const response = await api.get(`${GlobalConfig.apiUrl}/v1/incomes`, {
        params: params,
      });

      setIncomes(response.data.incomes);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLookupData = async () => {
    try {
      const [currenciesResponse, incomeTypesResponse] = await Promise.all([
        api.get(`${GlobalConfig.apiUrl}/v1/currencies/all`),
        api.get(`${GlobalConfig.apiUrl}/v1/income-types/all`),
      ]);
      setCurrencies(currenciesResponse.data.currencies);
      setIncomeTypes(incomeTypesResponse.data.incomeTypes);
    } catch (error) {
      console.error("Error fetching lookup data:", error);
    }
  };

  useEffect(() => {
    fetchLookupData();
  }, []);

  useEffect(() => {
    fetchIncomes();
  }, [
    debouncedSearchTerm,
    pageNumber,
    pageSize,
    selectedIncomeTypeId,
    selectedIncomeStatus,
    selectedCurrency,
  ]);

  const handlePrevious = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < totalPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const showCreateIncomeModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateIncomeModal = (refresh) => {
    setIsCreateModalOpen(false);

    if (refresh) {
      fetchIncomes();
    }
  };

  const showEditIncomeModal = (income) => {
    setSelectedIncome(income);
    setIsEditModalOpen(true);
  };

  const closeEditIncomeModal = (refresh) => {
    setIsEditModalOpen(false);

    setSelectedIncome(null);

    if (refresh) {
      fetchIncomes();
    }
  };

  const handleIncomeTypeChange = (e) => {
    setPageNumber(1);
    setSelectedIncomeTypeId(e.target.value);
  };

  return (
    <DashboardPage title="Incomes">
      <h1 className="text-2xl font-bold">Manage Incomes</h1>

      <div className="flex items-center justify-between py-2 gap-2">
        <input
          type="text"
          placeholder="Search incomes..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <select
          className="select"
          value={selectedIncomeTypeId}
          onChange={handleIncomeTypeChange}
        >
          <option value="">All Income Types</option>
          {incomeTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={selectedIncomeStatus}
          onChange={(e) => {
            setPageNumber(1);
            setSelectedIncomeStatus(e.target.value);
          }}
        >
          <option value="">All Income Status</option>
          <option value="Pending">Pending</option>
          <option value="Received">Received</option>
        </select>
        <select
          className="select"
          value={selectedCurrency}
          onChange={(e) => {
            setPageNumber(1);
            setSelectedCurrency(e.target.value);
          }}
        >
          <option value="">All Currencies</option>
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.id}>
              {currency.name} ({currency.code})
            </option>
          ))}
        </select>
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateIncomeModal}
        >
          Add Income
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Date</th>
            <th>Status</th>
            <th>Description</th>
            <th>Income Type</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="7">
                <div className="loading loading-spinner"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {incomes.length === 0 ? (
              <tr>
                <td colSpan="7">No incomes found.</td>
              </tr>
            ) : (
              incomes.map((income) => (
                <motion.tr
                  className="cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  key={income.id}
                  onClick={() => showEditIncomeModal(income)}
                >
                  <td>{income.amount.toFixed(2)}</td>
                  <td>{income.currencyCode || "N/A"}</td>
                  <td>{new Date(income.date).toLocaleDateString()}</td>
                  <td>{income.incomeStatus}</td>
                  <td>{income.description || "-"}</td>
                  <td>{income.incomeTypeName || "N/A"}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        )}
      </table>

      <div className="flex justify-between items-center py-4">
        <button
          onClick={handlePrevious}
          disabled={pageNumber === 1}
          className="btn btn-sm btn-outline"
        >
          Previous
        </button>
        <span>
          Page {pageNumber} of {totalPages} ({totalCount} items)
        </span>
        <button
          onClick={handleNext}
          disabled={pageNumber === totalPages || totalPages === 0}
          className="btn btn-sm btn-outline"
        >
          Next
        </button>
      </div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateIncomeModal
            currencies={currencies}
            incomeTypes={incomeTypes}
            onClose={closeCreateIncomeModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditIncomeModal
            income={selectedIncome}
            currencies={currencies}
            incomeTypes={incomeTypes}
            onClose={closeEditIncomeModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
