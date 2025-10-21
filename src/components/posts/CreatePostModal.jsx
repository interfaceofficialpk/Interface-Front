// src/components/posts/CreatePostModal.jsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import Modal from "../Modal.jsx";

const createPostSchema = z.object({
  title: z.string().min(1, "Post Title is required").max(200),
  content: z.string().min(1, "Post Content is required").max(4000),
});

export default function CreatePostModal({ communityId, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post(
        `${GlobalConfig.apiUrl}/v1/communities/${communityId}/posts`,
        data
      );
      alert("Post created successfully!");
      reset();
      onClose(true); // Close modal and trigger refresh
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <Modal onClose={() => onClose(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box border border-primary flex flex-col gap-4"
      >
        <h2 className="font-bold text-lg">Create New Post</h2>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Post Title</span>
          </label>
          <input
            type="text"
            placeholder="Title"
            {...register("title")}
            className="input w-full"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Post Content</span>
          </label>
          <textarea
            placeholder="Your post content..."
            {...register("content")}
            className="textarea textarea-bordered h-24"
          ></textarea>
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-secondary btn-outline"
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
