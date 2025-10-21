// src/pages/Communities.jsx
import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion";
import CreateCommunityModal from "../../components/communities/CreateCommunityModal";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { useNavigate } from "react-router-dom";

export default function Communities_EmployeeView() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${GlobalConfig.apiUrl}/v1/communities`, {
        params: {
          searchTerm: debouncedSearchTerm,
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
      });

      setCommunities(response.data.communities);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
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

  const showCreateCommunityModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateCommunityModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchCommunities();
    }
  };

  const navigateToCommunityDetails = (communityId) => {
    navigate(`${communityId}/posts`);
  };

  return (
    <DashboardPage title="Communities">
      <h1 className="text-2xl font-bold">Manage Communities</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search communities by name..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateCommunityModal}
        >
          Add Community
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Posts</th>
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
            {communities.length === 0 ? (
              <tr>
                <td colSpan="3">No communities found.</td>
              </tr>
            ) : (
              communities.map((community) => (
                <motion.tr
                  className="cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  key={community.id}
                  onClick={() => navigateToCommunityDetails(community.id)}
                >
                  <td>{community.name}</td>
                  <td>{community.description || "-"}</td>
                  <td>{community.postCount}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        )}
      </table>

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
          <CreateCommunityModal onClose={closeCreateCommunityModal} />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
