import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import Modal from "../Modal.jsx";
import { useState } from "react";

const createStudentSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  phoneNumber: z.string().optional(),
  dateOfBirth: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Invalid date format")
    .refine(
      (val) => !val || new Date(val) < new Date(),
      "Date of birth cannot be in the future"
    ),
});

export default function CreateStudentModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createStudentSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (data.dateOfBirth === "") {
        data.dateOfBirth = null;
      } else {
        data.dateOfBirth = new Date(data.dateOfBirth).toISOString();
      }
      await api.post(`${GlobalConfig.apiUrl}/v1/students`, data);
      alert("Student created successfully!");
      reset();
      onClose(true);
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        // Map server errors to form fields
        Object.keys(serverErrors).forEach((key) => {
          setError(key, {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
        console.error("Error creating student:", error);
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
        <h2 className="font-bold text-lg">Create New Student</h2>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="input w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            placeholder="First Name"
            {...register("firstName")}
            className="input w-full"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Middle Name (optional)</span>
          </label>
          <input
            type="text"
            placeholder="Middle Name"
            {...register("middleName")}
            className="input w-full"
          />
          {errors.middleName && (
            <p className="text-red-500 text-sm">{errors.middleName.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            placeholder="Last Name"
            {...register("lastName")}
            className="input w-full"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone Number (optional)</span>
          </label>
          <input
            type="tel"
            placeholder="Phone Number"
            {...register("phoneNumber")}
            className="input w-full"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Date of Birth (optional)</span>
          </label>
          <input
            type="date"
            {...register("dateOfBirth")}
            className="input w-full"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>
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
            Create Student
          </button>
        </div>
      </form>
    </Modal>
  );
}
