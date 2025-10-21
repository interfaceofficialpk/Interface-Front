// src/components/universities/UniversityInformationTab.jsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the schema for University details
const universityDetailsSchema = z.object({
  name: z.string().min(1, "University Name is required"),
  numOfCampuses: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z
      .number()
      .int()
      .min(0, "Must be a non-negative number")
      .nullable()
      .optional()
  ),
  totalStudents: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z
      .number()
      .int()
      .min(0, "Must be a non-negative number")
      .nullable()
      .optional()
  ),
  yearFounded: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z
      .number()
      .int()
      .min(1000, "Invalid year")
      .max(new Date().getFullYear(), "Cannot be in the future")
      .nullable()
      .optional()
  ),
  description: z.string().nullable().optional(),
  universityTypeId: z
    .string()
    .uuid("Invalid University Type ID format")
    .nullable()
    .optional(),
  locationId: z
    .string()
    .uuid("Invalid Location ID format")
    .nullable()
    .optional(),
});

export default function UniversityInformationTab({
  university,
  fetchUniversityData,
}) {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [universityTypes, setUniversityTypes] = useState([]);
  const [dropdownsLoading, setDropdownsLoading] = useState(true);
  const [dropdownsError, setDropdownsError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(universityDetailsSchema),
  });

  // Effect to load dropdown data and populate form when university prop changes
  useEffect(() => {
    const loadDropdownDataAndResetForm = async () => {
      try {
        setDropdownsLoading(true);
        const [locationsResponse, universityTypesResponse] = await Promise.all([
          api.get(`${GlobalConfig.apiUrl}/v1/public/locations`),
          api.get(`${GlobalConfig.apiUrl}/v1/university-types`),
        ]);

        setLocations(locationsResponse.data);
        setUniversityTypes(universityTypesResponse.data.items);

        // Reset form with university data after dropdowns are loaded
        if (university) {
          reset({
            name: university.name,
            numOfCampuses: university.numOfCampuses || "",
            totalStudents: university.totalStudents || "",
            yearFounded: university.yearFounded || "",
            description: university.description || "",
            universityTypeId: university.universityTypeId || "",
            locationId: university.locationId || "",
          });
        }
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
        setDropdownsError(
          "Failed to load dropdown data. " +
            (err.response?.data?.title || err.message)
        );
      } finally {
        setDropdownsLoading(false);
      }
    };

    if (university) {
      loadDropdownDataAndResetForm();
    }
  }, [university, reset]);

  const onSubmit = async (data) => {
    try {
      const dataToSend = {
        ...data,
        numOfCampuses: data.numOfCampuses === "" ? null : data.numOfCampuses,
        totalStudents: data.totalStudents === "" ? null : data.totalStudents,
        yearFounded: data.yearFounded === "" ? null : data.yearFounded,
        universityTypeId: data.universityTypeId || null,
        locationId: data.locationId || null,
      };

      await api.put(
        `${GlobalConfig.apiUrl}/v1/universities/${university.id}`,
        dataToSend
      );
      alert("University updated successfully!");
      if (fetchUniversityData) {
        fetchUniversityData(); // Re-fetch university data to update the parent component
      }
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1); // Convert PascalCase to camelCase
          const formFieldName =
            Object.keys(universityDetailsSchema.shape).find(
              (schemaKey) => schemaKey.toLowerCase() === fieldName.toLowerCase()
            ) || fieldName;

          setFormError(formFieldName, {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
        console.error("Error updating university:", err);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete university ${university.name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await api.delete(
        `${GlobalConfig.apiUrl}/v1/universities/${university.id}`
      );
      alert("University deleted successfully!");
      navigate("/dashboard/universities"); // Redirect after deletion
    } catch (err) {
      console.error("Error deleting university:", err);
      alert(
        "Failed to delete university. Please try again later. " +
          (err.response?.data?.title || err.message)
      );
    }
  };

  if (dropdownsLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="loading loading-spinner"></div>
        <p className="ml-2">Loading form data...</p>
      </div>
    );
  }

  if (dropdownsError) {
    return <p className="text-red-500 text-center">{dropdownsError}</p>;
  }

  return (
    <div className="tab-content border-base-300 p-4">
      <h2 className="text-xl font-semibold mb-4">University Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">University Name</span>
            </label>
            <input
              type="text"
              placeholder="University Name"
              {...register("name")}
              className="input w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          {/* Number of Campuses */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Number of Campuses (optional)</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 5"
              {...register("numOfCampuses")}
              className="input w-full"
            />
            {errors.numOfCampuses && (
              <p className="text-red-500 text-sm">
                {errors.numOfCampuses.message}
              </p>
            )}
          </div>
          {/* Total Students */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Total Students (optional)</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 25000"
              {...register("totalStudents")}
              className="input w-full"
            />
            {errors.totalStudents && (
              <p className="text-red-500 text-sm">
                {errors.totalStudents.message}
              </p>
            )}
          </div>
          {/* Year Founded */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Year Founded (optional)</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 1850"
              {...register("yearFounded")}
              className="input w-full"
            />
            {errors.yearFounded && (
              <p className="text-red-500 text-sm">
                {errors.yearFounded.message}
              </p>
            )}
          </div>
        </div>

        <div className="form-control col-span-full">
          <label className="label">
            <span className="label-text">Description (optional)</span>
          </label>
          <br />
          <textarea
            placeholder="A brief description of the university..."
            {...register("description")}
            className="textarea textarea-bordered h-24"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div className="divider">Categorization</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* University Type Dropdown */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">University Type (optional)</span>
            </label>
            <select
              {...register("universityTypeId")}
              className="select select-bordered w-full"
            >
              <option value="">-- Select University Type --</option>
              {universityTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.universityTypeId && (
              <p className="text-red-500 text-sm">
                {errors.universityTypeId.message}
              </p>
            )}
          </div>

          {/* Location Dropdown */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Location (optional)</span>
            </label>
            <select
              {...register("locationId")}
              className="select select-bordered w-full"
            >
              <option value="">-- Select Location --</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            {errors.locationId && (
              <p className="text-red-500 text-sm">
                {errors.locationId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="btn btn-error btn-outline"
            onClick={onDelete}
            disabled={isSubmitting}
          >
            Delete University
          </button>

          <div className="flex gap-2">
            <button
              type="submit"
              className="btn btn-primary btn-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
