import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect } from "react";
import Modal from "../Modal.jsx";
import { useState } from "react";

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export default function EditServiceModal({ service, onClose }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service.name,
      description: service.description,
    },
  });

  useEffect(() => {
    if (service) {
      reset({
        name: service.name,
        description: service.description,
      });
    }
  }, [service, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.put(`${GlobalConfig.apiUrl}/v1/services/${service.id}`, data);
      window.alert("Service updated successfully!");
      reset();
      onClose(true);
    } catch (error) {
      setLoading(false);
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          setError(key, {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
        window.alert("An unexpected error occurred.");
      }
    }
  };

  const onDelete = async () => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        setLoading(true);
        await api.delete(`${GlobalConfig.apiUrl}/v1/services/${service.id}`);
        window.alert("Service deleted successfully!");
        onClose(true); // refresh list
      } catch {
        setLoading(false);
        window.alert("Failed to delete service.");
      }
    }
  };

  return (
    <Modal onClose={() => onClose(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box flex flex-col gap-4 border border-primary"
      >
        <h2 className="text-lg font-bold">Edit Service</h2>

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
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
