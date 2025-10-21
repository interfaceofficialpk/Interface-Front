import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion"; // Changed from 'motion/react'
import CreateDocumentModal from "./CreateDocumentModal"; // Assuming path
import EditDocumentModal from "./EditDocumentModal"; // Assuming path
import { Download } from "lucide-react"; // at the top with other imports

export default function DocumentsTab({ student }) {
  const [documents, setDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]); // State for lookup data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (!student?.id) {
      console.warn("Student ID not available for fetching documents.");
      setLoading(false);
      return;
    }
    fetchLookupData();
  }, [student?.id]); // Fetch lookup data once when student ID is available

  const fetchDocuments = async () => {
    if (!student?.id) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/client-users/${student.id}/documents`,
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      setDocuments(response.data.documents);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLookupData = async () => {
    try {
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/document-types`
      );
      setDocumentTypes(response.data.items);
    } catch (error) {
      console.error("Error fetching document types:", error);
    }
  };

  useEffect(() => {
    if (student?.id) {
      fetchDocuments(); // Fetch documents whenever search/pagination or student ID changes
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

  const showCreateDocumentModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateDocumentModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchDocuments();
    }
  };

  const showEditDocumentModal = (document) => {
    setSelectedDocument(document);
    setIsEditModalOpen(true);
  };

  const closeEditDocumentModal = (refresh) => {
    setIsEditModalOpen(false);
    setSelectedDocument(null);
    if (refresh) {
      fetchDocuments();
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
    <div className="p-4">
      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search documents..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <div className="flex flex-col items-center">
          <progress
            className="progress progress-primary w-56"
            value={(student.storageUsage / student.storageLimit) * 100}
            max="100"
          ></progress>
          <p>
            {((student.storageUsage / student.storageLimit) * 100).toFixed(2)}%
            Storage Usage
          </p>
        </div>
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateDocumentModal}
        >
          Add Document
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>File Name</th>
            <th>File Size (Bytes)</th>
            <th>Status</th>
            <th>Description</th>
            <th>Document Type</th>
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
            {documents.length > 0 ? (
              documents.map((document) => (
                <motion.tr
                  className="cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  key={document.id}
                  onClick={() => showEditDocumentModal(document)}
                >
                  <td>{document.fileName}</td>
                  <td>{document.fileSize}</td>
                  <td>{document.documentStatus || "Unknown"}</td>
                  <td>{document.description || "-"}</td>
                  <td>{document.documentTypeName || "N/A"}</td>
                  <td>
                    {document.publicUrl ? (
                      <a
                        href={document.publicUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} // prevent row click from triggering edit modal
                        className="btn btn-ghost btn-sm"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No documents found.</td>
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
          <CreateDocumentModal
            studentId={student.id}
            documentTypes={documentTypes}
            onClose={closeCreateDocumentModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditDocumentModal
            studentId={student.id}
            document={selectedDocument}
            documentTypes={documentTypes}
            onClose={closeEditDocumentModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
