import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import Modal from "../Modal.jsx"; // Assuming your Modal component path

const createProgramSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  durationYears: z.preprocess(
    (val) => parseInt(val, 10), // Ensure it's parsed as an integer
    z.number().int().positive("Duration must be a positive number of years")
  ),
  isActive: z.boolean(),
  description: z.string().optional(),
  programTypeId: z.string().min(1, "Program type is required"),
});

export default function CreateProgramModal({
  universityId,
  onClose,
  programTypes,
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      name: "",
      durationYears: 1, // Default to 1 year
      isActive: true, // Default to active
      description: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        universityId: universityId, // Add the universityId from props
      };
      await api.post(`${GlobalConfig.apiUrl}/v1/university-programs`, payload);
      alert("Program created successfully!");
      reset();
      onClose(true); // Close modal and trigger refresh
    } catch (error) {
      console.error("Error creating program:", error);
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          setError(key.toLowerCase(), {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
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
        <h2 className="font-bold text-lg">
          Create New Program at{" "}
          {universityId ? "this University" : "Unknown University"}
        </h2>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Program Name</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Software Engineering"
            {...register("name")}
            className="input input-bordered w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Program Type</span>
          </label>
          <select
            {...register("programTypeId")}
            className="select select-bordered w-full"
          >
            {programTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.programTypeId && (
            <p className="text-red-500 text-sm">
              {errors.programTypeId.message}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Duration (Years)</span>
          </label>
          <input
            type="number"
            min="1"
            placeholder="e.g., 4"
            {...register("durationYears")}
            className="input input-bordered w-full"
          />
          {errors.durationYears && (
            <p className="text-red-500 text-sm">
              {errors.durationYears.message}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              {...register("isActive")}
            />
            <span className="label-text">Is Active</span>
          </label>
          {errors.isActive && (
            <p className="text-red-500 text-sm">{errors.isActive.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description (Optional)</span>
          </label>
          <textarea
            placeholder="Brief description of the program"
            {...register("description")}
            className="textarea textarea-bordered w-full"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
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
            Create Program
          </button>
        </div>
      </form>
    </Modal>
  );
}
