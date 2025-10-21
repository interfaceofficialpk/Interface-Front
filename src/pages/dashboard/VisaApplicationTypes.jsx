import { GlobalConfig } from "../../GlobalConfig"; // Adjust path if necessary
import { useState, useEffect } from "react";
import api from "../../utils/service-base"; // Adjust path if necessary
import useDebounce from "../../hooks/useDebounce"; // Adjust path if necessary
import { AnimatePresence, motion } from "framer-motion"; // Assuming 'motion/react' points to Framer Motion
import CreateVisaApplicationTypeModal from "../../components/visaApplicationTypes/CreateVisaApplicationTypeModal"; // Adjust path if necessary
import EditVisaApplicationTypeModal from "../../components/visaApplicationTypes/EditVisaApplicationTypeModal"; // Adjust path if necessary
import DashboardPage from "../../components/dashboard/DashboardPage"; // Adjust path if necessary

export default function VisaApplicationTypes() {
  const [visaApplicationTypes, setVisaApplicationTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedVisaApplicationType, setSelectedVisaApplicationType] =
    useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchVisaApplicationTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/visa-application-types`,
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      setVisaApplicationTypes(response.data.visaApplicationTypes);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching visa application types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisaApplicationTypes();
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

  const showCreateVisaApplicationTypeModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateVisaApplicationTypeModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchVisaApplicationTypes();
    }
  };

  const showEditVisaApplicationTypeModal = (visaApplicationType) => {
    setSelectedVisaApplicationType(visaApplicationType);
    setIsEditModalOpen(true);
  };

  const closeEditVisaApplicationTypeModal = (refresh) => {
    setIsEditModalOpen(false);
    setSelectedVisaApplicationType(null); // Clear selected item
    if (refresh) {
      fetchVisaApplicationTypes();
    }
  };

  return (
    <DashboardPage title="Visa Application Types">
      <h1 className="text-2xl font-bold">Manage Visa Application Types</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search visa application types..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1); // Reset page number on new search
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateVisaApplicationTypeModal}
        >
          Add Visa Application Type
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
            {visaApplicationTypes.map((visaApplicationType) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={visaApplicationType.id}
                onClick={() =>
                  showEditVisaApplicationTypeModal(visaApplicationType)
                }
              >
                <td>{visaApplicationType.name}</td>
                <td>{visaApplicationType.description || "-"}</td>
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
          <CreateVisaApplicationTypeModal
            onClose={closeCreateVisaApplicationTypeModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditVisaApplicationTypeModal
            visaApplicationType={selectedVisaApplicationType}
            onClose={closeEditVisaApplicationTypeModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
