import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateDocumentTypeModal from "../../components/documentTypes/CreateDocumentTypeModal";
import EditDocumentTypeModal from "../../components/documentTypes/EditDocumentTypeModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function DocumentTypes() {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchDocumentTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/document-types`,
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      setDocumentTypes(response.data.items);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching document types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
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

  const showCreateDocumentTypeModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateDocumentTypeModal = (refresh) => {
    setIsCreateModalOpen(false);

    if (refresh) {
      fetchDocumentTypes();
    }
  };

  const showEditDocumentTypeModal = (documentType) => {
    setSelectedDocumentType(documentType);
    setIsEditModalOpen(true);
  };

  const closeEditDocumentTypeModal = (refresh) => {
    setIsEditModalOpen(false);

    setSelectedDocumentType(null);

    if (refresh) {
      fetchDocumentTypes();
    }
  };

  return (
    <DashboardPage title="Document Types">
      <h1 className="text-2xl font-bold">Manage Document Types</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search document types..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateDocumentTypeModal}
        >
          Add Document Type
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
            {documentTypes.map((documentType) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={documentType.id}
                onClick={() => showEditDocumentTypeModal(documentType)}
              >
                <td>{documentType.name}</td>
                <td>{documentType.description || "-"}</td>
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
          <CreateDocumentTypeModal onClose={closeCreateDocumentTypeModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditDocumentTypeModal
            documentType={selectedDocumentType}
            onClose={closeEditDocumentTypeModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
