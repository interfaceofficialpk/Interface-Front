import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useState, useEffect } from "react";
import Modal from "../Modal.jsx";

// Define the ApplicationStatus enum options for the frontend
const ApplicationStatusOptions = [
  { value: 0, label: "Under Review" },
  { value: 1, label: "Review Successful" },
  { value: 2, label: "Submitted" },
  { value: 3, label: "Approved" },
  { value: 4, label: "Rejected" },
];

// Zod schema aligned with backend UpdateUniversityApplicationRequest
const universityApplicationSchema = z.object({
  universityId: z.string().min(1, "University is required"),
  universityProgramId: z.string().min(1, "University Program is required"),

  applyDate: z.string().optional(), // Added back as optional
  submissionDate: z.string().optional(),
  resultDate: z.string().optional(),
  reviewSuccessDate: z.string().optional(),

  applicationStatus: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().int().min(0).max(4, "Invalid Application Status")
  ),
  // notes: z.string().optional(), // Assuming Notes will be added to backend UpdateUniversityApplicationRequest
});

export default function EditUniversityApplicationModal({
  application,
  universities,
  universityPrograms: allUniversityPrograms,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    watch,
  } = useForm({
    resolver: zodResolver(universityApplicationSchema),
    defaultValues: {
      universityId: application?.universityId || "",
      universityProgramId: application?.universityProgramId || "",
      applyDate: application?.applyDate // Initialize applyDate
        ? new Date(application.applyDate).toISOString().split("T")[0]
        : "",
      submissionDate: application?.submissionDate
        ? new Date(application.submissionDate).toISOString().split("T")[0]
        : "",
      resultDate: application?.resultDate
        ? new Date(application.resultDate).toISOString().split("T")[0]
        : "",
      reviewSuccessDate: application?.reviewSuccessDate
        ? new Date(application.reviewSuccessDate).toISOString().split("T")[0]
        : "",
      applicationStatus: application?.applicationStatus,
    },
  });

  const selectedUniversityId = watch("universityId");
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  useEffect(() => {
    if (selectedUniversityId) {
      const programsForSelectedUniversity = allUniversityPrograms.filter(
        (program) => program.universityId === selectedUniversityId
      );
      setFilteredPrograms(programsForSelectedUniversity);
    } else {
      setFilteredPrograms([]);
    }
  }, [selectedUniversityId, allUniversityPrograms]);

  useEffect(() => {
    if (application) {
      reset({
        universityId: application.universityId || "",
        universityProgramId: application.universityProgramId || "",
        applyDate: application.applyDate
          ? new Date(application.applyDate).toISOString().split("T")[0]
          : "",
        submissionDate: application.submissionDate
          ? new Date(application.submissionDate).toISOString().split("T")[0]
          : "",
        resultDate: application.resultDate
          ? new Date(application.resultDate).toISOString().split("T")[0]
          : "",
        reviewSuccessDate: application.reviewSuccessDate
          ? new Date(application.reviewSuccessDate).toISOString().split("T")[0]
          : "",
        applicationStatus: application.applicationStatus ?? 0,
        notes: application.notes || "",
      });
    }
  }, [application, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        universityId: data.universityId,
        universityProgramId: data.universityProgramId,

        applyDate: data.applyDate
          ? new Date(data.applyDate).toISOString()
          : null, // Send applyDate
        submissionDate: data.submissionDate
          ? new Date(data.submissionDate).toISOString()
          : null,
        resultDate: data.resultDate
          ? new Date(data.resultDate).toISOString()
          : null,
        reviewSuccessDate: data.reviewSuccessDate
          ? new Date(data.reviewSuccessDate).toISOString()
          : null,

        applicationStatus: parseInt(data.applicationStatus, 10),
        notes: data.notes,
      };

      await api.put(
        `${GlobalConfig.apiUrl}/v1/university-applications/${application.id}`,
        payload
      );
      alert("University Application updated successfully!");
      onClose(true);
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          setError(key.toLowerCase(), {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
        alert("An unexpected error occurred.");
        console.error("Error updating university application:", error);
      }
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this university application?"
    );
    if (!confirmed) return;

    try {
      await api.delete(
        `${GlobalConfig.apiUrl}/v1/university-applications/${application.id}`
      );
      alert("University Application deleted successfully!");
      onClose(true);
    } catch (error) {
      alert("Failed to delete university application.");
      console.error("Error deleting university application:", error);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box flex flex-col gap-4 border border-primary"
      >
        <h2 className="text-lg font-bold">Edit University Application</h2>

        <div className="form-control">
          <label className="label">
            <span className="label-text">University</span>
          </label>
          <select
            {...register("universityId")}
            className="select select-bordered w-full"
          >
            <option value="">Select University</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
          {errors.universityId && (
            <p className="text-red-500 text-sm">
              {errors.universityId.message}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">University Program</span>
          </label>
          <select
            {...register("universityProgramId")}
            className="select select-bordered w-full"
            disabled={!selectedUniversityId || loadingPrograms}
          >
            <option value="">
              {loadingPrograms
                ? "Loading programs..."
                : selectedUniversityId
                ? "Select University Program"
                : "Select a University first"}
            </option>
            {filteredPrograms.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
          {errors.universityProgramId && (
            <p className="text-red-500 text-sm">
              {errors.universityProgramId.message}
            </p>
          )}
        </div>

        {/* Apply Date Field - Added back */}
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

        {/* Existing Date Fields */}
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

        {/* <div className="form-control">
          <label className="label">
            <span className="label-text">Notes (Optional)</span>
          </label>
          <textarea
            placeholder="Notes (optional)"
            {...register("notes")}
            className="textarea w-full"
          />
          {errors.notes && (
            <p className="text-red-500 text-sm">{errors.notes.message}</p>
          )}
        </div> */}

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
