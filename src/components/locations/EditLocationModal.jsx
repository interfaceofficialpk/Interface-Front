import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect } from "react";
import Modal from "../Modal.jsx";
import { useState } from "react";

const locationSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});

export default function EditLocationModal({ location, onClose }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      city: location.city,
      country: location.country,
    },
  });

  useEffect(() => {
    if (location) {
      reset({
        city: location.city,
        country: location.country,
      });
    }
  }, [location, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.put(`${GlobalConfig.apiUrl}/v1/locations/${location.id}`, data);
      alert("Location updated successfully!");
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
      "Are you sure you want to delete this location?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await api.delete(`${GlobalConfig.apiUrl}/v1/locations/${location.id}`);
      alert("Location deleted successfully!");
      reset();
      onClose(true); // refresh list
    } catch {
      alert("Failed to delete location.");
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
        <h2 className="text-lg font-bold">Edit Location</h2>

        <div className="form-control">
          <input
            type="text"
            placeholder="City"
            {...register("city")}
            className="input w-full"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>
        <div className="form-control">
          <input
            type="text"
            placeholder="Country"
            {...register("country")}
            className="input w-full"
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
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
