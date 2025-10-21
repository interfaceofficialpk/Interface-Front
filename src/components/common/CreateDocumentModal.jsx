import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base.js";
import Modal from "../Modal.jsx";
import { useState } from "react";

const documentSchema = z.object({
  description: z.string().optional(),
  documentTypeId: z.string().min(1, "Document Type is required"),
});

export default function CreateDocumentModal({
  studentId,
  documentTypes,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(documentSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("Description", data.description || "");
    formData.append("DocumentTypeId", data.documentTypeId);

    const fileInput = document.getElementById("file-upload-input"); // Get input by ID
    if (fileInput && fileInput.files[0]) {
      formData.append("File", fileInput.files[0]); // Append the actual file
    } else {
      setError("file", { type: "manual", message: "File is required." });
      return;
    }

    try {
      await api.post(
        `${GlobalConfig.apiUrl}/v1/client-users/${studentId}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      alert("Document uploaded successfully!");
      reset();
      onClose(true); // Close modal and refresh parent list
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          setError(key, {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
        alert("An unexpected error occurred. Please try again later.");
        console.error("Error creating document:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box border border-primary flex flex-col gap-4"
      >
        <h2 className="font-bold text-lg">Create Document</h2>
        <div className="form-control">
          <input
            type="file"
            id="file-upload-input"
            className="file-input file-input-bordered w-full"
          />
          {errors.file && (
            <p className="text-red-500 text-sm">{errors.file.message}</p>
          )}
        </div>

        <div className="form-control">
          <textarea
            placeholder="Description (optional)"
            {...register("description")}
            className="textarea w-full"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div className="form-control">
          <select
            {...register("documentTypeId")}
            className="select select-bordered w-full"
          >
            <option value="">Select Document Type</option>
            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.documentTypeId && (
            <p className="text-red-500 text-sm">
              {errors.documentTypeId.message}
            </p>
          )}
        </div>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-secondary btn-outline"
            onClick={() => onClose(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-outline"
            disabled={loading}
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
