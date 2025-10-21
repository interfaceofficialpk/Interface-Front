// src/pages/Posts.jsx
import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion";
import CreatePostModal from "../../components/posts/CreatePostModal";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { useNavigate, useParams } from "react-router-dom";
// New imports for the comments modal
import CommentsModal from "../../components/comments/CommentsModal";

export default function Posts() {
  const { communityId } = useParams();
  const [posts, setPosts] = useState([]);
  const [communityName, setCommunityName] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // New state variables for comments modal
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPostTitle, setSelectedPostTitle] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const communityResponse = await api.get(
        `${GlobalConfig.apiUrl}/v1/communities/${communityId}`
      );
      setCommunityName(communityResponse.data.name);

      const postsResponse = await api.get(
        `${GlobalConfig.apiUrl}/v1/communities/${communityId}/posts`,
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      setPosts(postsResponse.data.posts);
      setTotalCount(postsResponse.data.totalCount);
      setTotalPages(postsResponse.data.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
      if (error.response?.status === 404) {
        alert("Community not found!");
        navigate("/communities");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (communityId) {
      fetchPosts();
    }
  }, [communityId, debouncedSearchTerm, pageNumber, pageSize]);

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

  const showCreatePostModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreatePostModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchPosts();
    }
  };

  // New function to open the comments modal
  const openCommentsModal = (post) => {
    setSelectedPostId(post.id);
    setSelectedPostTitle(post.title);
    setIsCommentsModalOpen(true);
  };

  // New function to close the comments modal
  const closeCommentsModal = () => {
    setIsCommentsModalOpen(false);
    setSelectedPostId(null);
    setSelectedPostTitle("");
  };

  return (
    <DashboardPage title={`Posts in ${communityName}`}>
      <h1 className="text-2xl font-bold">Posts in {communityName}</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search posts by title..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreatePostModal}
        >
          Add Post
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Comments</th>
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
            {posts.length === 0 ? (
              <tr>
                <td colSpan="3">No posts found.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <motion.tr
                  className="cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  key={post.id}
                  // Updated onClick to open comments modal
                  onClick={() => openCommentsModal(post)}
                >
                  <td>{post.title}</td>
                  <td className="truncate max-w-xs">{post.content}</td>
                  <td>{post.commentCount}</td>
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
          <CreatePostModal
            communityId={communityId}
            onClose={closeCreatePostModal}
          />
        )}

        {isCommentsModalOpen && (
          <CommentsModal
            communityId={communityId}
            postId={selectedPostId}
            postTitle={selectedPostTitle}
            onClose={closeCommentsModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
