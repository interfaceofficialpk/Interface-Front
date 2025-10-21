import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect } from "react";
import Modal from "../Modal.jsx";
import { useState } from "react";

const nationalitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  twoLetterCode: z.string().optional(),
  threeLetterCode: z.string().optional(),
});

export default function EditNationalityModal({ nationality, onClose }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(nationalitySchema),
    defaultValues: {
      name: nationality.name,
      twoLetterCode: nationality.twoLetterCode,
      threeLetterCode: nationality.threeLetterCode,
    },
  });

  useEffect(() => {
    if (nationality) {
      reset({
        name: nationality.name,
        twoLetterCode: nationality.twoLetterCode,
        threeLetterCode: nationality.threeLetterCode,
      });
    }
  }, [nationality, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.put(
        `${GlobalConfig.apiUrl}/v1/nationalities/${nationality.id}`,
        data
      );
      alert("Nationality updated successfully!");
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
      "Are you sure you want to delete this nationality?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await api.delete(
        `${GlobalConfig.apiUrl}/v1/nationalities/${nationality.id}`
      );
      alert("Nationality deleted successfully!");
      reset();
      onClose(true);
    } catch {
      alert("Failed to delete nationality.");
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
        <h2 className="text-lg font-bold">Edit Nationality</h2>

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
          <input
            type="text"
            placeholder="Two-Letter Code (e.g., US, RO)"
            {...register("twoLetterCode")}
            className="input w-full"
            maxLength={2}
          />
          {errors.twoLetterCode && (
            <p className="text-red-500 text-sm">
              {errors.twoLetterCode.message}
            </p>
          )}
        </div>
        <div className="form-control">
          <input
            type="text"
            placeholder="Three-Letter Code (e.g., USA, ROU)"
            {...register("threeLetterCode")}
            className="input w-full"
            maxLength={3}
          />
          {errors.threeLetterCode && (
            <p className="text-red-500 text-sm">
              {errors.threeLetterCode.message}
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
