// src/components/universities/CreateUniversityModal.jsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import Modal from "../Modal.jsx"; // Assuming path to your Modal component
import { useState, useEffect } from "react"; // Needed for dropdowns

const createUniversitySchema = z.object({
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
    // .uuid("Invalid University Type ID format")
    .nullable()
    .optional(),
  locationId: z
    .string()
    // .uuid("Invalid Location ID format")
    .nullable()
    .optional(),
});

export default function CreateUniversityModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [universityTypes, setUniversityTypes] = useState([]);
  const [dropdownsLoading, setDropdownsLoading] = useState(true);
  const [dropdownsError, setDropdownsError] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createUniversitySchema),
    defaultValues: {
      // Set default values for optional number fields to empty string
      numOfCampuses: "",
      totalStudents: "",
      yearFounded: "",
      description: "",
      universityTypeId: "",
      locationId: "",
    },
  });

  // Fetch dropdown data on component mount
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        setDropdownsLoading(true);
        const [locationsResponse, universityTypesResponse] = await Promise.all([
          api.get(`${GlobalConfig.apiUrl}/v1/public/locations`),
          api.get(`${GlobalConfig.apiUrl}/v1/university-types`),
        ]);

        setLocations(locationsResponse.data);
        setUniversityTypes(universityTypesResponse.data.items);
      } catch (err) {
        console.error(
          "Error fetching dropdowns for Create University Modal:",
          err
        );
        setDropdownsError(
          "Failed to load dropdown data. " +
            (err.response?.data?.title || err.message)
        );
      } finally {
        setDropdownsLoading(false);
      }
    };
    loadDropdownData();
  }, []);

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

      await api.post(`${GlobalConfig.apiUrl}/v1/universities`, dataToSend);
      alert("University created successfully!");
      reset(); // Clear form fields
      onClose(true); // Close modal and trigger refresh
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1); // Convert PascalCase to camelCase
          const formFieldName =
            Object.keys(createUniversitySchema.shape).find(
              (schemaKey) => schemaKey.toLowerCase() === fieldName.toLowerCase()
            ) || fieldName;

          setError(formFieldName, {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
        console.error("Error creating university:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  if (dropdownsLoading) {
    return (
      <Modal onClose={() => onClose(false)}>
        <div className="modal-box border border-primary flex flex-col gap-4 text-center">
          <div className="loading loading-spinner"></div>
          <p>Loading dropdown options...</p>
        </div>
      </Modal>
    );
  }

  if (dropdownsError) {
    return (
      <Modal onClose={() => onClose(false)}>
        <div className="modal-box border border-error flex flex-col gap-4">
          <h2 className="font-bold text-lg text-error">Error Loading Data</h2>
          <p className="text-red-500">{dropdownsError}</p>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-secondary btn-outline"
              onClick={() => onClose(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={() => onClose(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box border border-primary flex flex-col gap-4"
      >
        <h2 className="font-bold text-lg">Create New University</h2>

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
            <p className="text-red-500 text-sm">{errors.yearFounded.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description (optional)</span>
          </label>
          <textarea
            placeholder="A brief description of the university..."
            {...register("description")}
            className="textarea textarea-bordered h-24"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

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
            <p className="text-red-500 text-sm">{errors.locationId.message}</p>
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
          <button
            type="submit"
            className="btn btn-primary btn-outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create University"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
