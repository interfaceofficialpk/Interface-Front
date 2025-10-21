import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateImmigrationClientCaseTypeModal from "../../components/immigrationClientCaseTypes/CreateImmigrationClientCaseTypeModal";
import EditImmigrationClientCaseTypeModal from "../../components/immigrationClientCaseTypes/EditImmigrationClientCaseTypeModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function ImmigrationClientCaseTypes() {
  const [caseTypes, setCaseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCaseType, setSelectedCaseType] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCaseTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/immigration-client-case-types`,
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      setCaseTypes(response.data.items);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching case types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseTypes();
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

  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchCaseTypes();
    }
  };

  const showEditModal = (caseType) => {
    setSelectedCaseType(caseType);
    setIsEditModalOpen(true);
  };

  const closeEditModal = (refresh) => {
    setIsEditModalOpen(false);
    setSelectedCaseType(null);
    if (refresh) {
      fetchCaseTypes();
    }
  };

  return (
    <DashboardPage title="Immigration Client Case Types">
      <h1 className="text-2xl font-bold">Manage Immigration Client Case Types</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search case types..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateModal}
        >
          Add Case Type
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
            {caseTypes.map((caseType) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={caseType.id}
                onClick={() => showEditModal(caseType)}
              >
                <td>{caseType.name}</td>
                <td>{caseType.description || "-"}</td>
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
          <CreateImmigrationClientCaseTypeModal onClose={closeCreateModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditImmigrationClientCaseTypeModal
            caseType={selectedCaseType}
            onClose={closeEditModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}