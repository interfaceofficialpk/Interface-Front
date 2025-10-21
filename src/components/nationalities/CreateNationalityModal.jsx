import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import Modal from "../Modal.jsx";
import { useState } from "react";

const nationalitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  twoLetterCode: z.string().optional(),
  threeLetterCode: z.string().optional(),
});

export default function CreateNationalityModal({ onClose }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(nationalitySchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.post(`${GlobalConfig.apiUrl}/v1/nationalities`, data);
      alert("Nationality created successfully!");
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
        <h2 className="font-bold text-lg">Create Nationality</h2>
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
            maxLength={2} // Max length for 2-letter code
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
            maxLength={3} // Max length for 3-letter code
          />
          {errors.threeLetterCode && (
            <p className="text-red-500 text-sm">
              {errors.threeLetterCode.message}
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
