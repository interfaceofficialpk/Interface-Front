import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateUniversityTypeModal from "../../components/universityTypes/CreateUniversityTypeModal";
import EditUniversityTypeModal from "../../components/universityTypes/EditUniversityTypeModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function UniversityTypes() {
  const [universityTypes, setUniversityTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUniversityType, setSelectedUniversityType] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchUniversityTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/university-types`,
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      setUniversityTypes(response.data.items);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching university types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversityTypes();
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

  const showCreateUniversityTypeModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateUniversityTypeModal = (refresh) => {
    setIsCreateModalOpen(false);

    if (refresh) {
      fetchUniversityTypes();
    }
  };

  const showEditUniversityTypeModal = (universityType) => {
    setSelectedUniversityType(universityType);
    setIsEditModalOpen(true);
  };

  const closeEditUniversityTypeModal = (refresh) => {
    setIsEditModalOpen(false);

    setSelectedUniversityType(null);

    if (refresh) {
      fetchUniversityTypes();
    }
  };

  return (
    <DashboardPage title="University Types">
      <h1 className="text-2xl font-bold">Manage University Types</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search university types..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateUniversityTypeModal}
        >
          Add University Type
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
            {universityTypes.map((universityType) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={universityType.id}
                onClick={() => showEditUniversityTypeModal(universityType)}
              >
                <td>{universityType.name}</td>
                <td>{universityType.description || "-"}</td>
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
          <CreateUniversityTypeModal onClose={closeCreateUniversityTypeModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditUniversityTypeModal
            universityType={selectedUniversityType}
            onClose={closeEditUniversityTypeModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
