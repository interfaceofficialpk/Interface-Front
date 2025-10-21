import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion";
import CreateClientSourceModal from "../../components/clientSources/CreateClientSourceModal";
import EditClientSourceModal from "../../components/clientSources/EditClientSourceModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function ClientSources() {
  const [clientSources, setClientSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedClientSource, setSelectedClientSource] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchClientSources = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/client-sources`,
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      setClientSources(response.data.clientSources);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching client sources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientSources();
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

  const showCreateClientSourceModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateClientSourceModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchClientSources();
    }
  };

  const showEditClientSourceModal = (clientSource) => {
    setSelectedClientSource(clientSource);
    setIsEditModalOpen(true);
  };

  const closeEditClientSourceModal = (refresh) => {
    setIsEditModalOpen(false);
    setSelectedClientSource(null);
    if (refresh) {
      fetchClientSources();
    }
  };

  return (
    <DashboardPage title="Client Sources">
      <h1 className="text-2xl font-bold">Manage Client Sources</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search client sources..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateClientSourceModal}
        >
          Add Client Source
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
              <td colSpan="2">
                <div className="loading loading-spinner"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {clientSources.map((clientSource) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={clientSource.id}
                onClick={() => showEditClientSourceModal(clientSource)}
              >
                <td>{clientSource.name}</td>
                <td>{clientSource.description || "-"}</td>
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
          <CreateClientSourceModal onClose={closeCreateClientSourceModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditClientSourceModal
            clientSource={selectedClientSource}
            onClose={closeEditClientSourceModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
