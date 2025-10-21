import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import Modal from "../Modal.jsx";
import { useState } from "react";

const clientSourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export default function CreateClientSourceModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(clientSourceSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.post(`${GlobalConfig.apiUrl}/v1/client-sources`, data);
      alert("Client source created successfully!");
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
        alert("An unexpected error occurred. Please try again later.");
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
        <h2 className="font-bold text-lg">Create Client Source</h2>
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
