import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion";
import CreateUniversityApplicationModal from "./CreateUniversityApplicationModal"; // New component path
import EditUniversityApplicationModal from "./EditUniversityApplicationModal"; // New component path

export default function UniversityApplicationsTab({ student }) {
  const [applications, setApplications] = useState([]);
  const [universities, setUniversities] = useState([]); // Lookup data
  const [universityPrograms, setUniversityPrograms] = useState([]); // Lookup data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch lookup data (universities, programs)
  const fetchLookupData = async () => {
    try {
      const [universitiesResponse, programsResponse] = await Promise.all([
        api.get(`${GlobalConfig.apiUrl}/v1/universities`),
        api.get(`${GlobalConfig.apiUrl}/v1/university-programs`),
      ]);
      setUniversities(universitiesResponse.data.universities);
      setUniversityPrograms(programsResponse.data.programs);
    } catch (error) {
      console.error("Error fetching lookup data:", error);
    }
  };

  useEffect(() => {
    fetchLookupData();
  }, []);

  const fetchApplications = async () => {
    if (!student?.id) {
      console.warn("Student ID not available for fetching applications.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/university-applications`,
        {
          params: {
            applicantId: student.id, // Parameter name as per your endpoint
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      setApplications(response.data.applications); // Adjust based on actual API response key
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (student?.id) {
      fetchApplications();
    }
  }, [debouncedSearchTerm, pageNumber, pageSize, student?.id]);

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

  const showCreateApplicationModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateApplicationModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchApplications();
    }
  };

  const showEditApplicationModal = (application) => {
    setSelectedApplication(application);
    setIsEditModalOpen(true);
  };

  const closeEditApplicationModal = (refresh) => {
    setIsEditModalOpen(false);
    setSelectedApplication(null);
    if (refresh) {
      fetchApplications();
    }
  };

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
          placeholder="Search applications..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateApplicationModal}
        >
          Add Application
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>University</th>
            <th>Program</th>
            <th>Application Date</th>
            <th>Status</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="6">
                <div className="loading loading-spinner"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <motion.tr
                  className="cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  key={app.id}
                  onClick={() => showEditApplicationModal(app)}
                >
                  <td>{app.universityName || "N/A"}</td>
                  <td>{app.programName || "N/A"}</td>
                  <td>{new Date(app.applyDate).toLocaleDateString()}</td>
                  <td>{app.applicationStatus || "Unknown"}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No university applications found.</td>
              </tr>
            )}
          </tbody>
        )}
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
          <CreateUniversityApplicationModal
            studentId={student.id}
            universities={universities}
            universityPrograms={universityPrograms}
            onClose={closeCreateApplicationModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && selectedApplication && (
          <EditUniversityApplicationModal
            application={selectedApplication}
            universities={universities}
            universityPrograms={universityPrograms}
            onClose={closeEditApplicationModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
