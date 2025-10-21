import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateLocationModal from "../../components/locations/CreateLocationModal";
import EditLocationModal from "../../components/locations/EditLocationModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${GlobalConfig.apiUrl}/v1/locations`, {
        params: {
          searchTerm: debouncedSearchTerm,
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
      });

      setLocations(response.data.locations);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
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

  const showCreateLocationModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateLocationModal = (refresh) => {
    setIsCreateModalOpen(false);

    if (refresh) {
      fetchLocations();
    }
  };

  const showEditLocationModal = (location) => {
    setSelectedLocation(location);
    setIsEditModalOpen(true);
  };

  const closeEditLocationModal = (refresh) => {
    setIsEditModalOpen(false);

    setSelectedLocation(null);

    if (refresh) {
      fetchLocations();
    }
  };

  return (
    <DashboardPage title="Locations">
      <h1 className="text-2xl font-bold">Manage Locations</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search locations..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateLocationModal}
        >
          Add Locations
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>City</th>
            <th>Country</th>
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
            {locations.map((location) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={location.id}
                onClick={() => showEditLocationModal(location)}
              >
                <td>{location.city}</td>
                <td>{location.country}</td>
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
          <CreateLocationModal onClose={closeCreateLocationModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditLocationModal
            location={selectedLocation}
            onClose={closeEditLocationModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
