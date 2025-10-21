import { useState, useEffect } from "react";
import { GlobalConfig } from "../../GlobalConfig";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion";
import CreateVisaApplicationModal from "./CreateVisaApplicationModal";
import EditVisaApplicationModal from "./EditVisaApplicationModal";

export default function VisaApplicationsTab({ entityId }) {
  const [visaApplications, setVisaApplications] = useState([]);
  const [selectedVisaApplication, setSelectedVisaApplication] = useState(null);
  const [visaApplicationTypes, setVisaApplicationTypes] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetches visa applications for the given entityId (applicantId)
  const fetchVisaApplications = async () => {
    if (!entityId) {
      console.warn("Entity ID not available for fetching visa applications.");
      setLoadingApplications(false);
      return;
    }

    try {
      setLoadingApplications(true);
      setError(null);

      const res = await api.get(`${GlobalConfig.apiUrl}/v1/visa-applications`, {
        params: {
          applicantId: entityId,
          searchTerm: debouncedSearchTerm, // Use debounced search term here
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
      });
      setVisaApplications(res.data.visaApplications);
      setTotalCount(res.data.totalCount);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching visa applications:", err);
      setError(
        "Failed to load visa applications. " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoadingApplications(false);
    }
  };

  // Fetches all available visa application types (lookup data)
  const fetchVisaApplicationTypes = async () => {
    try {
      setLoadingTypes(true);
      setError(null);

      // Await the API call to ensure data is fetched before setting state
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/visa-application-types/all`
      );
      setVisaApplicationTypes(response.data.visaApplicationTypes);
    } catch (err) {
      console.error("Error fetching visa application types:", err);
      setError(
        "Failed to load visa application types. " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoadingTypes(false);
    }
  };

  // Fetch visa application types once on component mount
  useEffect(() => {
    fetchVisaApplicationTypes();
  }, []);

  // Fetch visa applications whenever pagination, search term, or entityId changes
  useEffect(() => {
    if (entityId) {
      // Only fetch if entityId is available
      fetchVisaApplications();
    }
  }, [pageNumber, pageSize, entityId, debouncedSearchTerm]);

  // Pagination handlers
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

  // Modal open/close handlers
  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchVisaApplications(); // Refresh list after creation
    }
  };

  const handleEditModalOpen = (visaApplication) => {
    setSelectedVisaApplication(visaApplication);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = (refresh) => {
    setSelectedVisaApplication(null);
    setIsEditModalOpen(false);
    if (refresh) {
      fetchVisaApplications(); // Refresh list after edit/delete
    }
  };

  const isLoading = loadingApplications || loadingTypes;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="loading loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="border-base-300 p-4">
      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          className="input input-bordered"
          placeholder="Search Visa Applications..."
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />

        <button
          className="btn btn-primary btn-outline"
          onClick={handleCreateModalOpen}
        >
          Add Visa Application
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>Application Type</th>
            <th>Status</th>
            <th>Application Date</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {visaApplications.length > 0 ? (
            visaApplications.map((visaApplication) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={visaApplication.id}
                onClick={() => handleEditModalOpen(visaApplication)}
              >
                <td>{visaApplication.visaApplicationTypeName || "N/A"}</td>
                <td>{visaApplication.applicationStatus}</td>
                <td>
                  {new Date(visaApplication.applyDate).toLocaleDateString()}
                </td>
                <td>{visaApplication.notes || "N/A"}</td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No visa applications found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
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
          <CreateVisaApplicationModal
            applicantId={entityId}
            visaApplicationTypes={visaApplicationTypes}
            onClose={handleCreateModalClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && selectedVisaApplication && (
          <EditVisaApplicationModal
            application={selectedVisaApplication}
            visaApplicationTypes={visaApplicationTypes}
            onClose={handleEditModalClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const ApplicationStatusOptions = [
  { value: 0, label: "Under Review" },
  { value: 1, label: "Review Successful" },
  { value: 2, label: "Submitted" },
  { value: 3, label: "Approved" },
  { value: 4, label: "Rejected" },
];
