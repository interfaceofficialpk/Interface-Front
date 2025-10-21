import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import Modal from "../Modal.jsx";
import { useState } from "react";

const createEmployeeSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  title: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export default function CreateEmployeeModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createEmployeeSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.post(`${GlobalConfig.apiUrl}/v1/employees`, data);
      alert("Employee created successfully!");
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
        console.error("Error creating employee:", error);
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
        <h2 className="font-bold text-lg">Create New Employee</h2>

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
            <span className="label-text">Title (optional)</span>
          </label>
          <input
            type="text"
            placeholder="Title"
            {...register("title")}
            className="input w-full"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone Number (optional)</span>
          </label>
          <input
            type="tel" // Use type="tel" for phone numbers
            placeholder="Phone Number"
            {...register("phoneNumber")}
            className="input w-full"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
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
            Create Employee
          </button>
        </div>
      </form>
    </Modal>
  );
}
