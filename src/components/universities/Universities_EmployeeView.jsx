// src/pages/Universities.jsx
import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateUniversityModal from "../../components/universities/CreateUniversityModal";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { useNavigate } from "react-router-dom";

export default function Universities_EmployeeView() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${GlobalConfig.apiUrl}/v1/universities`, {
        params: {
          searchTerm: debouncedSearchTerm,
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
      });

      setUniversities(response.data.universities);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("Failed to load universities: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
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

  const showCreateUniversityModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateUniversityModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchUniversities();
    }
  };

  const navigateToUniversityDetails = (universityId) => {
    navigate(`${universityId}`);
  };

  if (error) {
    return (
      <DashboardPage title="Error">
        <p className="text-red-500 text-center">{error}</p>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage title="Universities">
      <h1 className="text-2xl font-bold">Manage Universities</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search universities by name..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1); // Reset page number on new search
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateUniversityModal}
        >
          Add University
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>Campuses</th>
            <th>Total Students</th>
            <th>Year Founded</th>
            <th>Location</th>
            <th>Type</th>
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
            {universities.length === 0 ? (
              <tr>
                <td colSpan="6">No universities found.</td>
              </tr>
            ) : (
              universities.map((university) => (
                <motion.tr
                  className="cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  key={university.id}
                  onClick={() => navigateToUniversityDetails(university.id)}
                >
                  <td>{university.name}</td>
                  <td>{university.numOfCampuses || "-"}</td>
                  <td>{university.totalStudents || "-"}</td>
                  <td>{university.yearFounded || "-"}</td>
                  <td>
                    {university.locationId ? `${university.locationName}` : "-"}
                  </td>
                  <td>{university.universityTypeName || "-"}</td>
                </motion.tr>
              ))
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
          <CreateUniversityModal onClose={closeCreateUniversityModal} />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
