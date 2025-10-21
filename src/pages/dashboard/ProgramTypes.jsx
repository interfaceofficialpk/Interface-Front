import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateProgramTypeModal from "../../components/programTypes/CreateProgramTypeModal";
import EditProgramTypeModal from "../../components/programTypes/EditProgramTypeModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function ProgramTypes() {
  const [programTypes, setProgramTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedProgramType, setSelectedProgramType] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchProgramTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/program-types`,
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      setProgramTypes(response.data.items);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching program types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramTypes();
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

  const showCreateProgramTypeModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateProgramTypeModal = (refresh) => {
    setIsCreateModalOpen(false);

    if (refresh) {
      fetchProgramTypes();
    }
  };

  const showEditProgramTypeModal = (programType) => {
    setSelectedProgramType(programType);
    setIsEditModalOpen(true);
  };

  const closeEditProgramTypeModal = (refresh) => {
    setIsEditModalOpen(false);

    setSelectedProgramType(null);

    if (refresh) {
      fetchProgramTypes();
    }
  };

  return (
    <DashboardPage title="Program Types">
      <h1 className="text-2xl font-bold">Manage Program Types</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search program types..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateProgramTypeModal}
        >
          Add Program Type
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
            {programTypes.map((programType) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={programType.id}
                onClick={() => showEditProgramTypeModal(programType)}
              >
                <td>{programType.name}</td>
                <td>{programType.description || "-"}</td>
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
          <CreateProgramTypeModal onClose={closeCreateProgramTypeModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditProgramTypeModal
            programType={selectedProgramType}
            onClose={closeEditProgramTypeModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
