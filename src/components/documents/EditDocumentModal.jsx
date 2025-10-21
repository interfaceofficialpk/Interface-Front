import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig";
import api from "../../utils/service-base";
import { useState, useEffect } from "react";
import Modal from "../Modal";
import { z } from "zod";

const assignDocumentSchema = z.object({
  ownerId: z.string().uuid("Owner is required"),
  documentTypeId: z.string().uuid("Document type is required"),
  documentStatus: z.string().min(1, "Status is required"),
});

export default function EditDocumentModal({
  document,
  owners,
  types,
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
    resolver: zodResolver(assignDocumentSchema),
    defaultValues: {
      ownerId: document?.ownerId || "",
      documentTypeId: document?.documentTypeId || "",
      documentStatus: document?.documentStatus || "UnderReview",
    },
  });

  useEffect(() => {
    if (document) {
      reset({
        ownerId: document.ownerId || "",
        documentTypeId: document.documentTypeId || "",
        documentStatus: document.documentStatus || "UnderReview",
      });
    }
  }, [document, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.put(`${GlobalConfig.apiUrl}/v1/documents/assign`, {
        documentId: document.id,
        ...data,
      });
      alert("Document updated successfully!");
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

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box flex flex-col gap-4 border border-primary"
      >
        <h2 className="text-lg font-bold">Assign Document</h2>

        {/* Owner */}
        <div className="form-control">
          <label className="label">Owner</label>
          <select {...register("ownerId")} className="select w-full">
            <option value="">-- Select Owner --</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.email}
              </option>
            ))}
          </select>
          {errors.ownerId && (
            <p className="text-red-500 text-sm">{errors.ownerId.message}</p>
          )}
        </div>

        {/* Document Type */}
        <div className="form-control">
          <label className="label">Document Type</label>
          <select {...register("documentTypeId")} className="select w-full">
            <option value="">-- Select Type --</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.documentTypeId && (
            <p className="text-red-500 text-sm">
              {errors.documentTypeId.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="form-control">
          <label className="label">Status</label>
          <select {...register("documentStatus")} className="select w-full">
            <option value="UnderReview">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          {errors.documentStatus && (
            <p className="text-red-500 text-sm">
              {errors.documentStatus.message}
            </p>
          )}
        </div>

        {document.publicUrl && (
          <a
            href={document.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline"
          >
            View / Download
          </a>
        )}

        <div className="modal-action justify-end">
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
      </form>
    </Modal>
  );
}
