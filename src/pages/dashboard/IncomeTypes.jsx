import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateIncomeTypeModal from "../../components/incomeTypes/CreateIncomeTypeModal";
import EditIncomeTypeModal from "../../components/incomeTypes/EditIncomeTypeModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function IncomeTypes() {
  const [incomeTypes, setIncomeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedIncomeType, setSelectedIncomeType] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchIncomeTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${GlobalConfig.apiUrl}/v1/income-types`, {
        params: {
          searchTerm: debouncedSearchTerm,
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
      });

      setIncomeTypes(response.data.incomeTypes);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching income types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeTypes();
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

  const showCreateIncomeTypeModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateIncomeTypeModal = (refresh) => {
    setIsCreateModalOpen(false);

    if (refresh) {
      fetchIncomeTypes();
    }
  };

  const showEditIncomeTypeModal = (incomeType) => {
    setSelectedIncomeType(incomeType);
    setIsEditModalOpen(true);
  };

  const closeEditIncomeTypeModal = (refresh) => {
    setIsEditModalOpen(false);

    setSelectedIncomeType(null);

    if (refresh) {
      fetchIncomeTypes();
    }
  };

  return (
    <DashboardPage title="Income Types">
      <h1 className="text-2xl font-bold">Manage Income Types</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search income types..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateIncomeTypeModal}
        >
          Add Income Type
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="3">
                <div className="loading loading-spinner"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {incomeTypes.map((incomeType) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={incomeType.id}
                onClick={() => showEditIncomeTypeModal(incomeType)}
              >
                <td>{incomeType.name}</td>
                <td>{incomeType.description || "-"}</td>
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
          <CreateIncomeTypeModal onClose={closeCreateIncomeTypeModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditIncomeTypeModal
            incomeType={selectedIncomeType}
            onClose={closeEditIncomeTypeModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
