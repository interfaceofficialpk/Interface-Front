import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import Modal from "../Modal.jsx"; // Assuming path to your Modal component

// Define the schema for creating a PartnerUser
const createPartnerSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  phoneNumber: z.string().optional(), // Nullable in C# model
});

export default function CreatePartnerModal({ onClose }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createPartnerSchema),
  });

  const onSubmit = async (data) => {
    try {
      // The backend will set the 'Role' to 'Partner' automatically for this endpoint.
      await api.post(`${GlobalConfig.apiUrl}/v1/partners`, data);
      alert("Partner created successfully!");
      reset(); // Clear form fields
      onClose(true); // Close modal and trigger refresh
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        // Map server errors to form fields
        Object.keys(serverErrors).forEach((key) => {
          const fieldName = key.toLowerCase().includes("email") ? "email" : key; // Adjust key if backend casing differs
          setError(fieldName, {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
        console.error("Error creating partner:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box border border-primary flex flex-col gap-4"
      >
        <h2 className="font-bold text-lg">Create New Partner</h2>

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

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-secondary btn-outline"
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-outline">
            Create Partner
          </button>
        </div>
      </form>
    </Modal>
  );
}
