import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateNationalityModal from "../../components/nationalities/CreateNationalityModal";
import EditNationalityModal from "../../components/nationalities/EditNationalityModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function Nationalities() {
  const [nationalities, setNationalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedNationality, setSelectedNationality] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchNationalities = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/nationalities`,
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      setNationalities(response.data.nationalities);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching nationalities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNationalities();
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

  const showCreateNationalityModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateNationalityModal = (refresh) => {
    setIsCreateModalOpen(false);

    if (refresh) {
      fetchNationalities();
    }
  };

  const showEditNationalityModal = (nationality) => {
    setSelectedNationality(nationality);
    setIsEditModalOpen(true);
  };

  const closeEditNationalityModal = (refresh) => {
    setIsEditModalOpen(false);

    setSelectedNationality(null);

    if (refresh) {
      fetchNationalities();
    }
  };

  return (
    <DashboardPage title="Nationalities">
      <h1 className="text-2xl font-bold">Manage Nationalities</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search nationalities..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateNationalityModal}
        >
          Add Nationality
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>2-Letter Code</th>
            <th>3-Letter Code</th>
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
            {nationalities.map((nationality) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={nationality.id}
                onClick={() => showEditNationalityModal(nationality)}
              >
                <td>{nationality.name}</td>
                <td>{nationality.twoLetterCode || "-"}</td>
                <td>{nationality.threeLetterCode || "-"}</td>
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
          <CreateNationalityModal onClose={closeCreateNationalityModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditNationalityModal
            nationality={selectedNationality}
            onClose={closeEditNationalityModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
