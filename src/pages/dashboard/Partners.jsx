import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreatePartnerModal from "../../components/partners/CreatePartnerModal"; // Assuming this path
import EditPartnerModal from "../../components/partners/EditPartnerModal"; // Assuming this path
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/partners`, // Corrected endpoint for partners
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      console.log(response.data.partners);
      setPartners(response.data.partners);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching partners:", error);
      // Optionally show a user-friendly error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
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

  const showCreatePartnerModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreatePartnerModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchPartners();
    }
  };

  const showEditPartnerModal = (partner) => {
    setSelectedPartner(partner);
    setIsEditModalOpen(true);
  };

  const closeEditPartnerModal = (refresh) => {
    setIsEditModalOpen(false);
    setSelectedPartner(null); // Clear selected partner
    if (refresh) {
      fetchPartners();
    }
  };

  return (
    <DashboardPage title="Partners">
      <h1 className="text-2xl font-bold">Manage Partners</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search partners by name or email..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1); // Reset page number on new search
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreatePartnerModal}
        >
          Add Partner
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            {/* <th>Role</th> */}
            <th>Phone Number</th>
            <th>Active</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="6">
                {" "}
                {/* Adjusted colspan for fewer columns */}
                <div className="loading loading-spinner"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {partners.length === 0 ? (
              <tr>
                <td colSpan="6">No partners found.</td>
              </tr>
            ) : (
              partners.map((partner) => (
                <motion.tr
                  className="cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  key={partner.id}
                  onClick={() => showEditPartnerModal(partner)}
                >
                  <td>{partner.email}</td>
                  <td>{partner.firstName}</td>
                  <td>{partner.lastName}</td>
                  {/* <td>{partner.role}</td> This will be "Partner" */}
                  <td>{partner.phoneNumber || "-"}</td>
                  <td>{partner.isActive ? "Yes" : "No"}</td>
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
          <CreatePartnerModal onClose={closeCreatePartnerModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditPartnerModal
            partner={selectedPartner}
            onClose={closeEditPartnerModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
