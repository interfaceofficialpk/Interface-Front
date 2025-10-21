import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect } from "react";
import Modal from "../Modal.jsx";
import { useState } from "react";

const documentTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export default function EditDocumentTypeModal({ documentType, onClose }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(documentTypeSchema),
    defaultValues: {
      name: documentType.name,
      description: documentType.description,
    },
  });

  useEffect(() => {
    if (documentType) {
      reset({
        name: documentType.name,
        description: documentType.description,
      });
    }
  }, [documentType, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.put(
        `${GlobalConfig.apiUrl}/v1/document-types/${documentType.id}`,
        data
      );
      alert("Document type updated successfully!");
      reset();
      onClose(true);
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
      }
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document type?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await api.delete(
        `${GlobalConfig.apiUrl}/v1/document-types/${documentType.id}`
      );
      alert("Document type deleted successfully!");
      reset();
      onClose(true); // refresh list
    } catch {
      alert("Failed to delete document type.");
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
        <h2 className="text-lg font-bold">Edit Document Type</h2>

        <div className="form-control">
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="input w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
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
