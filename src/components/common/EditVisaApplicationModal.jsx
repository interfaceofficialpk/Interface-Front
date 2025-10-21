import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect } from "react";
import Modal from "../Modal.jsx"; // Assuming you have a Modal component

// Define the ApplicationStatus enum options for the frontend
const ApplicationStatusOptions = [
  { value: 0, label: "Under Review" },
  { value: 1, label: "Review Successful" },
  { value: 2, label: "Submitted" },
  { value: 3, label: "Approved" },
  { value: 4, label: "Rejected" },
];

// Zod schema for updating a visa application
const editVisaApplicationSchema = z.object({
  visaApplicationTypeId: z.string().min(1, "Visa Application Type is required"),
  applyDate: z.string().optional(),
  reviewSuccessDate: z.string().optional(),
  submissionDate: z.string().optional(),
  resultDate: z.string().optional(),
  applicationStatus: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().int().min(0).max(4, "Invalid Application Status")
  ),
  notes: z.string().optional(),
});

export default function EditVisaApplicationModal({
  application, // The visa application object to edit
  visaApplicationTypes,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(editVisaApplicationSchema),
    defaultValues: {
      // Initialize form fields with existing application data
      visaApplicationTypeId: application?.visaApplicationTypeId || "",
      applyDate: application?.applyDate
        ? new Date(application.applyDate).toISOString().split("T")[0]
        : "",
      reviewSuccessDate: application?.reviewSuccessDate
        ? new Date(application.reviewSuccessDate).toISOString().split("T")[0]
        : "",
      submissionDate: application?.submissionDate
        ? new Date(application.submissionDate).toISOString().split("T")[0]
        : "",
      resultDate: application?.resultDate
        ? new Date(application.resultDate).toISOString().split("T")[0]
        : "",
      applicationStatus: application?.applicationStatus ?? 0, // Default to 0 if null/undefined
      notes: application?.notes || "",
    },
  });

  // Reset form values when the 'application' prop changes
  useEffect(() => {
    if (application) {
      reset({
        visaApplicationTypeId: application.visaApplicationTypeId || "",
        applyDate: application.applyDate
          ? new Date(application.applyDate).toISOString().split("T")[0]
          : "",
        reviewSuccessDate: application.reviewSuccessDate
          ? new Date(application.reviewSuccessDate).toISOString().split("T")[0]
          : "",
        submissionDate: application.submissionDate
          ? new Date(application.submissionDate).toISOString().split("T")[0]
          : "",
        resultDate: application.resultDate
          ? new Date(application.resultDate).toISOString().split("T")[0]
          : "",
        applicationStatus: application.applicationStatus ?? 0,
        notes: application.notes || "",
      });
    }
  }, [application, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        visaApplicationTypeId: data.visaApplicationTypeId,
        applyDate: data.applyDate
          ? new Date(data.applyDate).toISOString()
          : null,
        reviewSuccessDate: data.reviewSuccessDate
          ? new Date(data.reviewSuccessDate).toISOString()
          : null,
        submissionDate: data.submissionDate
          ? new Date(data.submissionDate).toISOString()
          : null,
        resultDate: data.resultDate
          ? new Date(data.resultDate).toISOString()
          : null,
        applicationStatus: parseInt(data.applicationStatus, 10),
        notes: data.notes,
      };

      await api.put(
        `${GlobalConfig.apiUrl}/v1/visa-applications/${application.id}`,
        payload
      );
      alert("Visa Application updated successfully!"); // Using alert as per original code style
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
        alert("An unexpected error occurred.");
        console.error("Error updating visa application:", error);
      }
    }
  };

  const onDelete = async () => {
    // Using window.confirm as per original code style
    const confirmed = window.confirm(
      "Are you sure you want to delete this visa application?"
    );
    if (!confirmed) return;

    try {
      await api.delete(
        `${GlobalConfig.apiUrl}/v1/visa-applications/${application.id}`
      );
      alert("Visa Application deleted successfully!"); // Using alert as per original code style
      onClose(true); // Close modal and trigger refresh
    } catch (error) {
      alert("Failed to delete visa application.");
      console.error("Error deleting visa application:", error);
    }
  };

  return (
    <Modal onClose={() => onClose(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box flex flex-col gap-4 border border-primary"
      >
        <h2 className="text-lg font-bold">Edit Visa Application</h2>

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
            <span className="label-text">
              Review Successful Date (Optional)
            </span>
          </label>
          <input
            type="date"
            {...register("reviewSuccessDate")}
            className="input w-full"
          />
          {errors.reviewSuccessDate && (
            <p className="text-red-500 text-sm">
              {errors.reviewSuccessDate.message}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Submission Date (Optional)</span>
          </label>
          <input
            type="date"
            {...register("submissionDate")}
            className="input w-full"
          />
          {errors.submissionDate && (
            <p className="text-red-500 text-sm">
              {errors.submissionDate.message}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Result Date (Optional)</span>
          </label>
          <input
            type="date"
            {...register("resultDate")}
            className="input w-full"
          />
          {errors.resultDate && (
            <p className="text-red-500 text-sm">{errors.resultDate.message}</p>
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

        <div className="modal-action justify-between">
          <button
            type="button"
            className="btn btn-error btn-outline"
            onClick={onDelete}
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-outline"
              onClick={() => onClose(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-outline">
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
