// src/components/communities/CreateCommunityModal.jsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import Modal from "../Modal.jsx"; // Assuming path to your Modal component

const createCommunitySchema = z.object({
  name: z.string().min(1, "Community Name is required").max(100),
  description: z.string().nullable().optional(),
});

export default function CreateCommunityModal({ onClose }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post(`${GlobalConfig.apiUrl}/v1/communities`, data);
      alert("Community created successfully!");
      reset(); // Clear form fields
      onClose(true); // Close modal and trigger refresh
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          const formFieldName =
            Object.keys(createCommunitySchema.shape).find(
              (schemaKey) => schemaKey.toLowerCase() === fieldName.toLowerCase()
            ) || fieldName;

          setError(formFieldName, {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
        console.error("Error creating community:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <Modal onClose={() => onClose(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box border border-primary flex flex-col gap-4"
      >
        <h2 className="font-bold text-lg">Create New Community</h2>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Community Name</span>
          </label>
          <input
            type="text"
            placeholder="Community Name"
            {...register("name")}
            className="input w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description (optional)</span>
          </label>
          <textarea
            placeholder="A brief description of the community..."
            {...register("description")}
            className="textarea textarea-bordered h-24"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
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
            {isSubmitting ? "Creating..." : "Create Community"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
