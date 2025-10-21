import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import { AnimatePresence, motion } from "motion/react";
import DashboardPage from "../../components/dashboard/DashboardPage";
import EditDocumentModal from "../../components/documents/EditDocumentModal";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [owners, setOwners] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${GlobalConfig.apiUrl}/v1/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnersAndTypes = async () => {
    try {
      const [ownersRes, typesRes] = await Promise.all([
        api.get(`${GlobalConfig.apiUrl}/v1/students/all`),
        api.get(`${GlobalConfig.apiUrl}/v1/document-types`),
      ]);
      console.log(typesRes);
      console.log(ownersRes);
      setOwners(ownersRes.data);
      setTypes(typesRes.data.items);
    } catch (error) {
      console.error("Error fetching owners/types:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchOwnersAndTypes();
  }, []);

  const showEditModal = (doc) => {
    setSelectedDocument(doc);
    setIsEditModalOpen(true);
  };

  const closeEditModal = (refresh) => {
    setIsEditModalOpen(false);
    setSelectedDocument(null);
    if (refresh) fetchDocuments();
  };

  return (
    <DashboardPage title="Documents">
      <h1 className="text-2xl font-bold">Manage Documents</h1>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Type</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="4">
                <div className="loading loading-spinner"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {documents.map((doc) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={doc.id}
                onClick={() => showEditModal(doc)}
              >
                <td>{doc.fileName}</td>
                <td>{doc.documentStatus}</td>
                <td>{doc.ownerName || "-"}</td>
                <td>{doc.documentTypeName || "-"}</td>
              </motion.tr>
            ))}
          </tbody>
        )}
      </table>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditDocumentModal
            document={selectedDocument}
            owners={owners}
            types={types}
            onClose={closeEditModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
