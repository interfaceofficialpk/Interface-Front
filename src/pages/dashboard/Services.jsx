import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion";
import CreateServiceModal from "../../components/services/CreateServiceModal";
import EditServiceModal from "../../components/services/EditServiceModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedService, setSelectedService] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${GlobalConfig.apiUrl}/v1/services`, {
        params: {
          searchTerm: debouncedSearchTerm,
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
      });

      setServices(response.data.services);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
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

  const showCreateServiceModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateServiceModal = (refresh) => {
    setIsCreateModalOpen(false);

    if (refresh) {
      fetchServices();
    }
  };

  const showEditServiceModal = (service) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const closeEditServiceModal = (refresh) => {
    setIsEditModalOpen(false);
    setSelectedService(null);

    if (refresh) {
      fetchServices();
    }
  };

  return (
    <DashboardPage title="Services">
      <h1 className="text-2xl font-bold">Manage Services</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search services..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateServiceModal}
        >
          Add Service
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
            {services.map((service) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={service.id}
                onClick={() => showEditServiceModal(service)}
              >
                <td>{service.name}</td>
                <td>{service.description || "-"}</td>
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
          <CreateServiceModal onClose={closeCreateServiceModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditServiceModal
            service={selectedService}
            onClose={closeEditServiceModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
