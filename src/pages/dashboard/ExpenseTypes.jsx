import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateExpenseTypeModal from "../../components/expenseTypes/CreateExpenseTypeModal";
import EditExpenseTypeModal from "../../components/expenseTypes/EditExpenseTypeModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function ExpenseTypes() {
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedExpenseType, setSelectedExpenseType] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchExpenseTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/expense-types`,
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      setExpenseTypes(response.data.expenseTypes);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching expense types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseTypes();
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

  const showCreateExpenseTypeModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateExpenseTypeModal = (refresh) => {
    setIsCreateModalOpen(false);

    if (refresh) {
      fetchExpenseTypes();
    }
  };

  const showEditExpenseTypeModal = (expenseType) => {
    setSelectedExpenseType(expenseType);
    setIsEditModalOpen(true);
  };

  const closeEditExpenseTypeModal = (refresh) => {
    setIsEditModalOpen(false);

    setSelectedExpenseType(null);

    if (refresh) {
      fetchExpenseTypes();
    }
  };

  return (
    <DashboardPage title="Expense Types">
      <h1 className="text-2xl font-bold">Manage Expense Types</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search expense types..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateExpenseTypeModal}
        >
          Add Expense Type
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
            {expenseTypes.map((expenseType) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={expenseType.id}
                onClick={() => showEditExpenseTypeModal(expenseType)}
              >
                <td>{expenseType.name}</td>
                <td>{expenseType.description || "-"}</td>
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
          <CreateExpenseTypeModal onClose={closeCreateExpenseTypeModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditExpenseTypeModal
            expenseType={selectedExpenseType}
            onClose={closeEditExpenseTypeModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
