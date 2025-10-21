import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import Modal from "../Modal.jsx";
import { useState, useEffect } from "react";

// Define the ApplicationStatus enum options for the frontend
// These values MUST match your backend C# enum integer values
const ApplicationStatusOptions = [
  { value: 0, label: "Under Review" },
  { value: 1, label: "Review Successful" },
  { value: 2, label: "Submitted" },
  { value: 3, label: "Approved" },
  { value: 4, label: "Rejected" },
];

const universityApplicationSchema = z.object({
  universityId: z.string().min(1, "University is required"),
  universityProgramId: z.string().min(1, "University Program is required"),
  applyDate: z.string().optional(), // Made optional
  applicationStatus: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().int().min(0).max(4, "Invalid Application Status") // Max adjusted to 4 based on your enum
  ),
});

export default function CreateUniversityApplicationModal({
  studentId,
  universities,
  universityPrograms: allUniversityPrograms,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(universityApplicationSchema),
    defaultValues: {
      applicationStatus: 0, // Default to 'UnderReview'
      notes: "", // Default empty notes
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
    setValue("universityProgramId", "");
  }, [selectedUniversityId, allUniversityPrograms, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        applicantId: studentId,
        applyDate: data.applyDate
          ? new Date(data.applyDate).toISOString()
          : null, // Send null if not provided
        applicationStatus: parseInt(data.applicationStatus, 10),
      };

      await api.post(
        `${GlobalConfig.apiUrl}/v1/university-applications`, // Corrected endpoint as per previous conversation
        payload
      );
      alert("University Application created successfully!");
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
        console.error("Error creating university application:", error);
      }
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box border border-primary flex flex-col gap-4"
      >
        <h2 className="font-bold text-lg">Create University Application</h2>

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

        <div className="form-control">
          <label className="label">
            <span className="label-text">Application Date (Optional)</span>
          </label>
          <input
            type="date"
            placeholder="Application Date"
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
