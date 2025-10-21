import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base.js";
import { useEffect } from "react";
import Modal from "../Modal.jsx";
import { useState } from "react";

const DocumentStatusOptions = [
  { value: 0, label: "Under Review" },
  { value: 1, label: "Approved" },
  { value: 2, label: "Rejected" },
];

const documentSchema = z.object({
  fileName: z.string().min(1, "File Name is required"),
  documentStatus: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().int().min(0).max(2, "Invalid Document Status")
  ),
  description: z.string().optional(),
  documentTypeId: z.string().min(1, "Document Type is required"),
});

export default function EditDocumentModal({
  studentId,
  document,
  documentTypes,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      fileName: document?.fileName || "",
      documentStatus: document?.documentStatus || 0,
      description: document?.description || "",
      documentTypeId: document?.documentTypeId || "",
    },
  });

  useEffect(() => {
    if (document) {
      reset({
        fileName: document.fileName,
        documentStatus: document.documentStatus,
        description: document.description,
        documentTypeId: document.documentTypeId,
      });
    }
  }, [document, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        documentStatus: parseInt(data.documentStatus, 10),
      };
      await api.put(
        `${GlobalConfig.apiUrl}/v1/client-users/${studentId}/documents/${document.id}`,
        payload
      );
      alert("Document updated successfully!");
      reset();
      onClose(true); // Close modal and refresh list
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
        alert("An unexpected error occurred.");
        console.error("Error updating document:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await api.delete(
        `${GlobalConfig.apiUrl}/v1/client-users/${studentId}/documents/${document.id}`
      );
      alert("Document deleted successfully!");
      reset();
      onClose(true); // Refresh list
    } catch (error) {
      alert("Failed to delete document.");
      console.error("Error deleting document:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box flex flex-col gap-4 border border-primary"
      >
        <h2 className="text-lg font-bold">Edit Document</h2>

        <div className="form-control">
          <input
            type="text"
            placeholder="File Name"
            {...register("fileName")}
            className="input w-full"
          />
          {errors.fileName && (
            <p className="text-red-500 text-sm">{errors.fileName.message}</p>
          )}
        </div>

        <div className="form-control">
          <select
            {...register("documentStatus")}
            className="select select-bordered w-full"
          >
            <option value="">Select Status</option>
            {DocumentStatusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          {errors.documentStatus && (
            <p className="text-red-500 text-sm">
              {errors.documentStatus.message}
            </p>
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

        <div className="modal-action justify-between">
          <button
            type="button"
            className="btn btn-error btn-outline"
            onClick={onDelete}
            disabled={loading}
          >
            Delete
          </button>

          <div className="flex gap-2">
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
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
