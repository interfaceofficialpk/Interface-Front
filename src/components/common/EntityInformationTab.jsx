// src/components/common/EntityInformationForm.jsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const formatDateForInput = (isoDateString) => {
  if (!isoDateString) return "";
  try {
    return new Date(isoDateString).toISOString().split("T")[0];
  } catch (e) {
    console.error("Error formatting date:", e);
    return "";
  }
};

const baseEntityDetailsSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().nullable().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  phoneNumber: z.string().nullable().optional(),
  isActive: z.boolean(),
  dateOfBirth: z.string().nullable().optional(),
  locationId: z
    .string()
    .transform((e) => (e === "" ? null : e))
    .pipe(z.uuid("Invalid Location ID format").nullable().optional()),
  nationalityId: z
    .string()
    .transform((e) => (e === "" ? null : e))
    .pipe(z.uuid("Invalid Nationality ID format").nullable().optional()),
  admissionAssociateId: z
    .string()
    .transform((e) => (e === "" ? null : e))
    .pipe(
      z.uuid("Invalid Admission Associate ID format").nullable().optional()
    ),
  // counselorId: z
  //   .string()
  //   .transform((e) => (e === "" ? null : e))
  //   .pipe(z.uuid("Invalid Counselor ID format").nullable().optional()),
  sopWriterId: z
    .string()
    .transform((e) => (e === "" ? null : e))
    .pipe(z.uuid("Invalid SOP Writer ID format").nullable().optional()),
  registeredById: z
    .string()
    .transform((e) => (e === "" ? null : e))
    .pipe(z.uuid("Invalid Registered By ID format").nullable().optional()),
  registrationDate: z.string().nullable().optional(),
  clientSourceId: z
    .string()
    .transform((e) => (e === "" ? null : e))
    .pipe(z.uuid("Invalid Client Source ID format").nullable().optional()),
  caseTypeId: z
    .string()
    .transform((e) => (e === "" ? null : e))
    .pipe(z.uuid("Invalid Case Type ID format").nullable().optional()),
  services: z.array(z.string().uuid("Invalid Service ID format")).optional(),
});

export default function EntityInformationTab({
  entity,
  entityType,
  fetchData,
}) {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [employeeUsers, setEmployeeUsers] = useState([]);
  const [clientSources, setClientSources] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [dropdownsLoading, setDropdownsLoading] = useState(false);
  const [dropdownsError, setDropdownsError] = useState(null);
  const [isReadonly, setIsReadonly] = useState(true);
  const [dropdownsFetched, setDropdownsFetched] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError: setFormError,
    getValues,
  } = useForm({
    resolver: zodResolver(baseEntityDetailsSchema),
  });

  useEffect(() => {
    if (entity) {
      reset({
        email: entity.email,
        firstName: entity.firstName,
        middleName: entity.middleName,
        lastName: entity.lastName,
        phoneNumber: entity.phoneNumber,
        isActive: entity.isActive,
        dateOfBirth: formatDateForInput(entity.dateOfBirth),
        locationId: entity.locationId || "",
        nationalityId: entity.nationalityId || "",
        admissionAssociateId: entity.admissionAssociateId || "",
        // counselorId: entity.counselorId || "",
        sopWriterId: entity.sopWriterId || "",
        registeredById: entity.registeredById || "",
        registrationDate: formatDateForInput(entity.registrationDate),
        clientSourceId: entity.clientSourceId || "",
        caseTypeId: entity.caseTypeId || "",
        services: entity.services ? entity.services.map((s) => s.id) : [],
      });
    }
  }, [entity, reset]);

  useEffect(() => {
    if (!isReadonly && !dropdownsFetched) {
      const fetchDropdowns = async () => {
        try {
          setDropdownsLoading(true);
          const [
            locationsResponse,
            nationalitiesResponse,
            employeesResponse,
            clientSourcesResponse,
            caseTypesResponse,
            servicesResponse,
          ] = await Promise.all([
            api.get(`${GlobalConfig.apiUrl}/v1/public/locations`),
            api.get(`${GlobalConfig.apiUrl}/v1/public/nationalities`),
            api.get(`${GlobalConfig.apiUrl}/v1/employees/all`),
            api.get(`${GlobalConfig.apiUrl}/v1/client-sources`),
            api.get(
              `${GlobalConfig.apiUrl}/v1/immigration-client-case-types/all`
            ),
            api.get(`${GlobalConfig.apiUrl}/v1/services/all`),
          ]);

          setLocations(locationsResponse.data);
          setNationalities(nationalitiesResponse.data);
          setEmployeeUsers(employeesResponse.data.employees);
          setClientSources(clientSourcesResponse.data.clientSources);
          setCaseTypes(caseTypesResponse.data);
          setServices(servicesResponse.data.services);
          setDropdownsFetched(true);
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
      fetchDropdowns();
    }
  }, [isReadonly, dropdownsFetched]);

  const onSubmit = async (data) => {
    try {
      const dataToSend = {
        ...data,
        locationId: data.locationId || null,
        nationalityId: data.nationalityId || null,
        admissionAssociateId: data.admissionAssociateId || null,
        counselorId: data.counselorId || null,
        sopWriterId: data.sopWriterId || null,
        registeredById: data.registeredById || null,
        registrationDate: data.registrationDate
          ? new Date(data.registrationDate).toISOString()
          : null,
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString()
          : null,
        clientSourceId: data.clientSourceId || null,
        caseTypeId: data.caseTypeId || null,
        serviceIds: getValues("services") || [],
      };

      await api.put(
        `${GlobalConfig.apiUrl}/v1/${entityType}s/${entity.id}`,
        dataToSend
      );
      alert(`${entityType} updated successfully!`);
      if (fetchData) {
        fetchData();
      }
      setIsReadonly(true);
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          setFormError(key, {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
        console.error(`Error updating ${entityType}:`, err);
        alert(`An unexpected error occurred. Please try again later.`);
      }
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${entityType}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`${GlobalConfig.apiUrl}/v1/${entityType}s/${entity.id}`);
      alert(`${entityType} deleted successfully!`);
      navigate(`/dashboard/users/${entityType}s`);
    } catch (err) {
      console.error(`Error deleting ${entityType}:`, err);
      alert(
        `Failed to delete ${entityType}. Please try again later. ` +
          (err.response?.data?.title || err.message)
      );
    }
  };

  if (dropdownsLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="loading loading-spinner"></div>
        <p className="ml-2">Loading dropdowns...</p>
      </div>
    );
  }

  if (dropdownsError) {
    return <p className="text-red-500 text-center">{dropdownsError}</p>;
  }

  return (
    <div className="border-base-300 p-4">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="input w-full"
              disabled={isReadonly}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          {/* First Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              placeholder="First Name"
              {...register("firstName")}
              className="input w-full"
              disabled={isReadonly}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          {/* Middle Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Middle Name (optional)</span>
            </label>
            <input
              type="text"
              placeholder="Middle Name"
              {...register("middleName")}
              className="input w-full"
              disabled={isReadonly}
            />
            {errors.middleName && (
              <p className="text-red-500 text-sm">
                {errors.middleName.message}
              </p>
            )}
          </div>
          {/* Last Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              placeholder="Last Name"
              {...register("lastName")}
              className="input w-full"
              disabled={isReadonly}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
          {/* Phone Number */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone Number (optional)</span>
            </label>
            <input
              type="tel"
              placeholder="Phone Number"
              {...register("phoneNumber")}
              className="input w-full"
              disabled={isReadonly}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          {/* Date of Birth */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date of Birth (optional)</span>
            </label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className="input w-full"
              disabled={isReadonly}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>
        </div>

        <div className="divider">Additional Details</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location Dropdown */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Location (optional)</span>
            </label>
            <select
              {...register("locationId")}
              className="select select-bordered w-full"
              disabled={isReadonly}
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

          {/* Nationality Dropdown */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nationality (optional)</span>
            </label>
            <select
              {...register("nationalityId")}
              className="select select-bordered w-full"
              disabled={isReadonly}
            >
              <option value="">-- Select Nationality --</option>
              {nationalities.map((nat) => (
                <option key={nat.id} value={nat.id}>
                  {nat.name}
                </option>
              ))}
            </select>
            {errors.nationalityId && (
              <p className="text-red-500 text-sm">
                {errors.nationalityId.message}
              </p>
            )}
          </div>

          {/* Admission Associate Dropdown */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Admission Associate (optional)</span>
            </label>
            <select
              {...register("admissionAssociateId")}
              className="select select-bordered w-full"
              disabled={isReadonly}
            >
              <option value="">-- Select Admission Associate --</option>
              {employeeUsers.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.email})
                </option>
              ))}
            </select>
            {errors.admissionAssociateId && (
              <p className="text-red-500 text-sm">
                {errors.admissionAssociateId.message}
              </p>
            )}
          </div>

          {/* Counselor Dropdown */}
          {/* <div className="form-control">
            <label className="label">
              <span className="label-text">Counselor (optional)</span>
            </label>
            <select
              {...register("counselorId")}
              className="select select-bordered w-full"
              disabled={isReadonly}
            >
              <option value="">-- Select Counselor --</option>
              {employeeUsers.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.email})
                </option>
              ))}
            </select>
            {errors.counselorId && (
              <p className="text-red-500 text-sm">
                {errors.counselorId.message}
              </p>
            )}
          </div> */}

          {/* New SOP Writer Dropdown */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">SOP Writer (optional)</span>
            </label>
            <select
              {...register("sopWriterId")}
              className="select select-bordered w-full"
              disabled={isReadonly}
            >
              <option value="">-- Select SOP Writer --</option>
              {employeeUsers.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.email})
                </option>
              ))}
            </select>
            {errors.sopWriterId && (
              <p className="text-red-500 text-sm">
                {errors.sopWriterId.message}
              </p>
            )}
          </div>

          {/* Registered By Dropdown */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Registered By (optional)</span>
            </label>
            <select
              {...register("registeredById")}
              className="select select-bordered w-full"
              disabled={isReadonly}
            >
              <option value="">-- Select Registered By --</option>
              {employeeUsers.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.email})
                </option>
              ))}
            </select>
            {errors.registeredById && (
              <p className="text-red-500 text-sm">
                {errors.registeredById.message}
              </p>
            )}
          </div>

          {/* Registration Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Registration Date (optional)</span>
            </label>
            <input
              type="date"
              {...register("registrationDate")}
              className="input w-full"
              disabled={isReadonly}
            />
            {errors.registrationDate && (
              <p className="text-red-500 text-sm">
                {errors.registrationDate.message}
              </p>
            )}
          </div>

          {/* New Client Source Dropdown */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Client Source (optional)</span>
            </label>
            <select
              {...register("clientSourceId")}
              className="select select-bordered w-full"
              disabled={isReadonly}
            >
              <option value="">-- Select Client Source --</option>
              {clientSources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>
            {errors.clientSourceId && (
              <p className="text-red-500 text-sm">
                {errors.clientSourceId.message}
              </p>
            )}
          </div>

          {entityType == "immigration-client" && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Case Type (optional)</span>
              </label>
              <select
                {...register("caseTypeId")}
                className="select select-bordered w-full"
                disabled={isReadonly}
              >
                <option value="">-- Select Case Type --</option>
                {caseTypes.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {ct.name}
                  </option>
                ))}
              </select>
              {errors.caseTypeId && (
                <p className="text-red-500 text-sm">
                  {errors.caseTypeId.message}
                </p>
              )}
            </div>
          )}
        </div>

        {entityType === "student" && (
          <>
            <div className="divider">Services</div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Services</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        value={service.id}
                        {...register("services")}
                        className="checkbox checkbox-primary"
                        disabled={isReadonly}
                      />
                      <span className="label-text">{service.name}</span>
                    </label>
                  </div>
                ))}
              </div>
              {errors.services && (
                <p className="text-red-500 text-sm">
                  {errors.services.message}
                </p>
              )}
            </div>
          </>
        )}

        <div className="divider">Verification & Status</div>
        {/* Is Active? */}
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Is Active?</span>
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              {...register("isActive")}
              disabled={isReadonly}
            />
          </label>
          {errors.isActive && (
            <p className="text-red-500 text-sm">{errors.isActive.message}</p>
          )}
        </div>

        {/* Is Email Verified? (Read-only for display) */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email Verified:</span>
            <span className="font-medium">
              {entity.isEmailVerified ? "Yes" : "No"}
            </span>
          </label>
        </div>

        {/* Is Phone Verified? (Read-only for display) */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone Verified:</span>
            <span className="font-medium">
              {entity.isPhoneVerified ? "Yes" : "No"}
            </span>
          </label>
        </div>

        <div
          className={`flex ${
            isReadonly ? "justify-end" : "justify-between"
          } mt-6`}
        >
          {/* Conditionally render the buttons */}
          {isReadonly ? (
            <button
              type="button"
              className="btn btn-primary btn-outline"
              onClick={() => setIsReadonly(false)}
            >
              Edit
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-error btn-outline"
                onClick={onDelete}
                disabled={isSubmitting}
              >
                Delete {entityType}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-secondary btn-outline"
                  onClick={() => {
                    // Revert to read-only mode
                    setIsReadonly(true);
                    // Reset the form fields to the original entity values
                    reset({
                      email: entity.email,
                      firstName: entity.firstName,
                      middleName: entity.middleName,
                      lastName: entity.lastName,
                      phoneNumber: entity.phoneNumber,
                      isActive: entity.isActive,
                      dateOfBirth: formatDateForInput(entity.dateOfBirth),
                      locationId: entity.locationId || "",
                      nationalityId: entity.nationalityId || "",
                      admissionAssociateId: entity.admissionAssociateId || "",
                      counselorId: entity.counselorId || "",
                      sopWriterId: entity.sopWriterId || "",
                      registeredById: entity.registeredById || "",
                      registrationDate: formatDateForInput(
                        entity.registrationDate
                      ),
                      clientSourceId: entity.clientSourceId || "",
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-outline"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
