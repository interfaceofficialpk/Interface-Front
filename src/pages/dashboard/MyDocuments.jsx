import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "../../utils/service-base";
import { GlobalConfig } from "../../GlobalConfig";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import CreateDocumentModal from "../../components/common/CreateDocumentModal";

// ✅ Status Badge Helper
const StatusBadge = ({ status }) => {
  const config = {
    UnderReview: {
      className: "badge badge-warning gap-2",
      icon: <Clock size={16} />,
      label: "Under Review",
    },
    Approved: {
      className: "badge badge-success gap-2",
      icon: <CheckCircle size={16} />,
      label: "Approved",
    },
    Rejected: {
      className: "badge badge-error gap-2",
      icon: <XCircle size={16} />,
      label: "Rejected",
    },
  };

  const badge = config[status];
  return badge ? (
    <div className={badge.className}>
      {badge.icon} {badge.label}
    </div>
  ) : null;
};

// ✅ File Size Formatter
const formatFileSize = (bytes) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

export default function MyDocuments() {
  const [documents, setDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]); // For lookup data
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { getId } = useAuth();
  const userId = getId();

  // ✅ Fetch Documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `${GlobalConfig.apiUrl}/v1/client-users/${userId}/documents`
      );
      setDocuments(data.documents || []);
    } catch {
      alert("Failed to load documents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Document
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await api.delete(
        `${GlobalConfig.apiUrl}/v1/client-users/${userId}/documents/${id}`
      );
      setDocuments((docs) => docs.filter((doc) => doc.id !== id));
    } catch {
      alert("Failed to delete the document.");
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

  const showCreateDocumentModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateDocumentModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchDocuments();
    }
  };

  useEffect(() => {
    fetchLookupData();
    fetchDocuments();
  }, []);

  // ✅ Early Returns for states
  if (loading) {
    return (
      <DashboardPage title="My Documents">
        <p>Loading documents...</p>
      </DashboardPage>
    );
  }

  if (documents.length === 0) {
    return (
      <DashboardPage title="My Documents">
        <div className="alert alert-info shadow-lg">
          <span>No documents found.</span>
        </div>
      </DashboardPage>
    );
  }

  // ✅ Main Render
  return (
    <DashboardPage title="My Documents">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateDocumentModal}
        >
          Upload
        </button>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            className="card bg-base-100/50 border border-primary"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            <div className="card-body">
              <div className="flex items-center space-x-4 mb-2">
                <FileText size={28} className="text-primary" />
                <h2 className="card-title text-lg font-semibold">
                  {doc.fileName}
                </h2>
              </div>
              <p className="text-sm text-gray-500">
                Type: {doc.documentTypeName}
              </p>
              <p className="text-sm text-gray-500">
                Size: {formatFileSize(doc.fileSize)}
              </p>
              <div className="mt-2">
                Status: <StatusBadge status={doc.documentStatus} />
              </div>

              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-sm btn-outline btn-error"
                  onClick={() => handleDelete(doc.id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
                <a
                  href={doc.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary btn-outline"
                >
                  <Download size={16} /> View
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateDocumentModal
            studentId={userId}
            documentTypes={documentTypes}
            onClose={closeCreateDocumentModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
