import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect } from "react";
import Modal from "../Modal.jsx"; // Assuming your Modal component path

const editProgramSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  durationYears: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().int().positive("Duration must be a positive number of years")
  ),
  isActive: z.boolean(),
  description: z.string().optional(),
  programTypeId: z.string().min(1, "Program type is required"), // Add validation for ProgramTypeId
});

export default function EditProgramModal({ program, programTypes, onClose }) {
  // Accept programTypes prop
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(editProgramSchema),
    defaultValues: {
      name: program.name,
      durationYears: program.durationYears,
      isActive: program.isActive,
      description: program.description || "",
      programTypeId: program.programTypeId, // Set default value from the program object
    },
  });

  useEffect(() => {
    if (program) {
      reset({
        name: program.name,
        durationYears: program.durationYears,
        isActive: program.isActive,
        description: program.description || "",
        programTypeId: program.programTypeId, // Update on program change
      });
    }
  }, [program, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        universityId: program.universityId,
      };
      await api.put(
        `${GlobalConfig.apiUrl}/v1/university-programs/${program.id}`,
        payload
      );
      alert("Program updated successfully!");
      onClose(true);
    } catch (error) {
      console.error("Error updating program:", error);
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

  const onDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the program "${program.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await api.delete(
        `${GlobalConfig.apiUrl}/v1/university-programs/${program.id}`
      );
      alert("Program deleted successfully!");
      onClose(true);
    } catch (error) {
      console.error("Error deleting program:", error);
      alert("Failed to delete program. Please try again.");
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box flex flex-col gap-4 border border-primary"
      >
        <h2 className="text-lg font-bold">Edit Program: {program.name}</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Program Name</span>
          </label>
          <input
            type="text"
            placeholder="Program Name"
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
            placeholder="Duration (Years)"
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
            placeholder="Description of the program"
            {...register("description")}
            className="textarea textarea-bordered w-full"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        <div className="modal-action justify-between">
          <button
            type="button"
            className="btn btn-error btn-outline"
            onClick={onDelete}
          >
            Delete Program
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
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
