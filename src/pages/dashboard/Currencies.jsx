import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateCurrencyModal from "../../components/currencies/CreateCurrencyModal";
import EditCurrencyModal from "../../components/currencies/EditCurrencyModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function Currencies() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${GlobalConfig.apiUrl}/v1/currencies`, {
        params: {
          searchTerm: debouncedSearchTerm,
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
      });

      setCurrencies(response.data.currencies);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, [debouncedSearchTerm, pageNumber, pageSize]);

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

  const showCreateCurrencyModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateCurrencyModal = (refresh) => {
    setIsCreateModalOpen(false);

    if (refresh) {
      fetchCurrencies();
    }
  };

  const showEditCurrencyModal = (currency) => {
    setSelectedCurrency(currency);
    setIsEditModalOpen(true);
  };

  const closeEditCurrencyModal = (refresh) => {
    setIsEditModalOpen(false);

    setSelectedCurrency(null);

    if (refresh) {
      fetchCurrencies();
    }
  };

  return (
    <DashboardPage title="Currencies">
      <h1 className="text-2xl font-bold">Manage Currencies</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search currencies..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateCurrencyModal}
        >
          Add Currency
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Description</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="4">
                <div className="loading loading-spinner"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {currencies.map((currency) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={currency.id}
                onClick={() => showEditCurrencyModal(currency)}
              >
                <td>{currency.name}</td>
                <td>{currency.code}</td>
                <td>{currency.description || "-"}</td>
              </motion.tr>
            ))}
          </tbody>
        )}
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
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
          <CreateCurrencyModal onClose={closeCreateCurrencyModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditCurrencyModal
            currency={selectedCurrency}
            onClose={closeEditCurrencyModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
