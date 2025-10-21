import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig";
import api from "../../utils/service-base";
import Modal from "../Modal";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2Icon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const createCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required").max(1000),
});

export default function CommentsModal({
  communityId,
  postId,
  postTitle,
  onClose,
}) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const { getPermissions, getId } = useAuth();
  const permissions = getPermissions();
  const userId = getId();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const fetchPost = async () => {
    try {
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/communities/${communityId}/posts/${postId}`
      );
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching post:", error);
      alert("Failed to load post. Please try again later.");
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/communities/${communityId}/posts/${postId}/comments`,
        {
          params: {
            pageNumber,
            pageSize,
          },
        }
      );
      setComments(response.data.comments);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert("Failed to load comments. Please try again later.");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.delete(
          `${GlobalConfig.apiUrl}/v1/communities/${communityId}/posts/${postId}/comments/${commentId}`
        );
        alert("Comment deleted successfully!");
        setComments(comments.filter((c) => c.id !== commentId));
        fetchComments(); // Re-fetch comments to update the list
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Failed to delete comment. You may not have permission.");
      }
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId, pageNumber, pageSize]);

  const onSubmit = async (data) => {
    try {
      await api.post(
        `${GlobalConfig.apiUrl}/v1/communities/${communityId}/posts/${postId}/comments`,
        data
      );
      alert("Comment added successfully!");
      reset();
      setPageNumber(1);
      fetchComments();
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-box border border-primary flex flex-col gap-4 max-w-2xl w-full">
        <div className="flex justify-between items-start">
          <h2 className="font-bold text-lg">"{postTitle}"</h2>
          <button
            className="btn btn-sm btn-circle btn-ghost btn-error"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <blockquote className="">
          {post && post.content}
        </blockquote>

        {/* Comments Section */}
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-2">
          {loadingComments ? (
            <div className="flex justify-center items-center h-full">
              <div className="loading loading-spinner"></div>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div>
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="chat chat-start flex"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="chat-bubble">{comment.content}</div>
                    {(permissions.includes("Comments_Delete") ||
                      comment.createdById === userId) && (
                      <Trash2Icon
                        size={20}
                        className="text-error hover:cursor-pointer"
                        onClick={() => handleDeleteComment(comment.id)}
                      />
                    )}
                  </div>
                </motion.div>
                <div className="chat-footer pl-2 text-xs opacity-50">
                  {new Date(comment.createdOn).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <h3 className="font-semibold">Add a Comment</h3>
          <textarea
            placeholder="Write your comment here..."
            {...register("content")}
            className="textarea textarea-bordered w-full h-20"
          ></textarea>
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
