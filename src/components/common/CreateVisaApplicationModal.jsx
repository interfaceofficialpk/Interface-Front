import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import Modal from "../Modal.jsx"; // Assuming you have a Modal component
import { useState } from "react";

// Define the ApplicationStatus enum options for the frontend
const ApplicationStatusOptions = [
  { value: 0, label: "Under Review" },
  { value: 1, label: "Review Successful" },
  { value: 2, label: "Submitted" },
  { value: 3, label: "Approved" },
  { value: 4, label: "Rejected" },
];

// Zod schema for creating a new visa application
const createVisaApplicationSchema = z.object({
  visaApplicationTypeId: z.string().min(1, "Visa Application Type is required"),
  applyDate: z.string().optional(), // Made optional as per your backend model
  applicationStatus: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().int().min(0).max(4, "Invalid Application Status")
  ),
  notes: z.string().optional(),
});

export default function CreateVisaApplicationModal({
  applicantId,
  visaApplicationTypes,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createVisaApplicationSchema),
    defaultValues: {
      applicationStatus: 0, // Default to 'UnderReview'
      notes: "", // Default empty notes
      applyDate: new Date().toISOString().split("T")[0], // Default to today's date
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        applicantId: applicantId,
        applyDate: data.applyDate
          ? new Date(data.applyDate).toISOString()
          : null, // Send null if not provided
        applicationStatus: parseInt(data.applicationStatus, 10),
      };

      await api.post(`${GlobalConfig.apiUrl}/v1/visa-applications`, payload);
      alert("Visa Application created successfully!"); // Using alert as per original code style
      reset();
      onClose(true); // Close modal and trigger refresh
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          setError(key.toLowerCase(), {
            // Convert key to lowercase to match form field names
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
        alert("An unexpected error occurred. Please try again later.");
        console.error("Error creating visa application:", error);
      }
    }
  };

  return (
    <Modal onClose={() => onClose(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box border border-primary flex flex-col gap-4"
      >
        <h2 className="font-bold text-lg">Create Visa Application</h2>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Visa Application Type</span>
          </label>
          <select
            {...register("visaApplicationTypeId")}
            className="select select-bordered w-full"
          >
            <option value="">Select Application Type</option>
            {visaApplicationTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.visaApplicationTypeId && (
            <p className="text-red-500 text-sm">
              {errors.visaApplicationTypeId.message}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Application Date (Optional)</span>
          </label>
          <input
            type="date"
            {...register("applyDate")}
            className="input w-full"
          />
          {errors.applyDate && (
            <p className="text-red-500 text-sm">{errors.applyDate.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Application Status</span>
          </label>
          <select
            {...register("applicationStatus")}
            className="select select-bordered w-full"
          >
            {ApplicationStatusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          {errors.applicationStatus && (
            <p className="text-red-500 text-sm">
              {errors.applicationStatus.message}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Notes (Optional)</span>
          </label>
          <textarea
            placeholder="Add any relevant notes here..."
            {...register("notes")}
            className="textarea w-full"
          />
          {errors.notes && (
            <p className="text-red-500 text-sm">{errors.notes.message}</p>
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
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
