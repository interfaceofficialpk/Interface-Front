import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect } from "react";
import Modal from "../Modal.jsx";
import { useState } from "react";

const ALL_PERMISSIONS = [
  "Locations_Create",
  "Locations_Read",
  "Locations_Update",
  "Locations_Delete",
  "Nationalities_Create",
  "Nationalities_Read",
  "Nationalities_Update",
  "Nationalities_Delete",
  "IncomeTypes_Create",
  "IncomeTypes_Read",
  "IncomeTypes_Update",
  "IncomeTypes_Delete",
  "ExpenseTypes_Create",
  "ExpenseTypes_Read",
  "ExpenseTypes_Update",
  "ExpenseTypes_Delete",
  "Incomes_Create",
  "Incomes_Read",
  "Incomes_Update",
  "Incomes_Delete",
  "Expenses_Create",
  "Expenses_Read",
  "Expenses_Update",
  "Expenses_Delete",
  "UniversityTypes_Create",
  "UniversityTypes_Read",
  "UniversityTypes_Update",
  "UniversityTypes_Delete",
  "ProgramTypes_Create",
  "ProgramTypes_Read",
  "ProgramTypes_Update",
  "ProgramTypes_Delete",
  "DocumentTypes_Create",
  "DocumentTypes_Read",
  "DocumentTypes_Update",
  "DocumentTypes_Delete",
  "Employees_Create",
  "Employees_Read",
  "Employees_Update",
  "Employees_Delete",
  "Currencies_Create",
  "Currencies_Read",
  "Currencies_Update",
  "Currencies_Delete",
  "Students_Create",
  "Students_Read",
  "Students_Update",
  "Students_Delete",
  "Students_Own_Read",
  "Students_Own_Update",
  "Students_Own_Documents_Create",
  "Students_Own_Documents_Read",
  "Students_Own_Documents_Update",
  "Students_Own_Documents_Delete",
  "Students_Own_UniversityApplications_Create",
  "Students_Own_UniversityApplications_Read",
  "Students_Own_UniversityApplications_Update",
  "Students_Own_UniversityApplications_Delete",
  "Students_Own_VisaApplications_Create",
  "Students_Own_VisaApplications_Read",
  "Students_Own_VisaApplications_Update",
  "Students_Own_VisaApplications_Delete",
  "Partners_Create",
  "Partners_Read",
  "Partners_Update",
  "Partners_Delete",
  "ImmigrationClients_Create",
  "ImmigrationClients_Read",
  "ImmigrationClients_Update",
  "ImmigrationClients_Delete",
  "ImmigrationClients_Own_Read",
  "ImmigrationClients_Own_Update",
  "ImmigrationClients_Own_Documents_Create",
  "ImmigrationClients_Own_Documents_Read",
  "ImmigrationClients_Own_Documents_Update",
  "ImmigrationClients_Own_Documents_Delete",
  "ImmigrationClients_Own_VisaApplications_Create",
  "ImmigrationClients_Own_VisaApplications_Read",
  "ImmigrationClients_Own_VisaApplications_Update",
  "ImmigrationClients_Own_VisaApplications_Delete",
  "Universities_Create",
  "Universities_Read",
  "Universities_Update",
  "Universities_Delete",
  "UniversityPrograms_Create",
  "UniversityPrograms_Read",
  "UniversityPrograms_Update",
  "UniversityPrograms_Delete",
  "Documents_Create",
  "Documents_Read",
  "Documents_Update",
  "Documents_Delete",
  "Documents_Own_Create",
  "Documents_Own_Read",
  "Documents_Own_Update",
  "Documents_Own_Delete",
  "UniversityApplications_Create",
  "UniversityApplications_Read",
  "UniversityApplications_Update",
  "UniversityApplications_Delete",
  "UniversityApplications_Own_Create",
  "UniversityApplications_Own_Read",
  "VisaApplications_Create",
  "VisaApplications_Read",
  "VisaApplications_Update",
  "VisaApplications_Delete",
  "VisaApplications_Own_Read",
  "VisaApplicationTypes_Create",
  "VisaApplicationTypes_Read",
  "VisaApplicationTypes_Update",
  "VisaApplicationTypes_Delete",
  "ClientSources_Create",
  "ClientSources_Read",
  "ClientSources_Update",
  "ClientSources_Delete",
  "Portal_Overview",
  "Users_Overview",
  "Finances_Overview",
  "Communities_Create",
  "Communities_Read",
  "Communities_Update",
  "Communities_Delete",
  "Posts_Create",
  "Posts_Read",
  "Posts_Update",
  "Posts_Delete",
  "Posts_Own_Update",
  "Posts_Own_Delete",
  "Comments_Create",
  "Comments_Read",
  "Comments_Update",
  "Comments_Delete",
  "Comments_Own_Update",
  "Comments_Own_Delete",
  "CaseTypes_Create",
  "CaseTypes_Read",
  "CaseTypes_Update",
  "CaseTypes_Delete",
  "Services_Create",
  "Services_Read",
  "Services_Update",
  "Services_Delete",
];

// Renamed schema to be specific for a partner
const editPartnerSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  title: z.string().optional(),
  phoneNumber: z.string().optional(),
  isActive: z.boolean(),
  permissions: z.array(z.string()).default([]),
});

// Renamed component and destructured `partner` prop
export default function EditPartnerModal({ partner, onClose }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(editPartnerSchema),
  });

  useEffect(() => {
    // Check for `partner` and reset the form with its values
    if (partner) {
      reset({
        email: partner.email,
        firstName: partner.firstName,
        middleName: partner.middleName || "",
        lastName: partner.lastName,
        title: partner.title || "",
        phoneNumber: partner.phoneNumber || "",
        isActive: partner.isActive,
        permissions: partner.permissions || [],
      });
    }
  }, [partner, reset]);

  const onSubmit = async (data) => {
    const confirmed = window.confirm(
      "Are you sure you want to save these changes?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);

      const payload = {
        ...data,
        permissions: data.permissions || [],
      };

      // Updated API endpoint to /v1/partners
      await api.put(
        `${GlobalConfig.apiUrl}/v1/partners/${partner.id}`,
        payload
      );
      alert("Partner updated successfully!");
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
        console.error("Error updating partner:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete partner ${partner.firstName} ${partner.lastName}?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      // Updated API endpoint to /v1/partners
      await api.delete(`${GlobalConfig.apiUrl}/v1/partners/${partner.id}`);
      alert("Partner deleted successfully!");
      onClose(true);
    } catch (error) {
      console.error("Error deleting partner:", error);
      alert("Failed to delete partner. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box flex flex-col gap-4 border border-primary"
      >
        <h2 className="text-lg font-bold">
          Edit Partner: {partner?.firstName} {partner?.lastName}
        </h2>

        <div className="tabs tabs-border">
          <input
            type="radio"
            name="edit_partner_tabs" // Renamed form name
            className="tab"
            aria-label="Information"
            defaultChecked
          />
          <div className="tab-content">
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
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Middle Name (optional)</span>
              </label>
              <input
                type="text"
                placeholder="Middle Name"
                {...register("middleName")}
                className="input w-full"
              />
              {errors.middleName && (
                <p className="text-red-500 text-sm">
                  {errors.middleName.message}
                </p>
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
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Title (optional)</span>
              </label>
              <input
                type="text"
                placeholder="Title"
                {...register("title")}
                className="input w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
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
                <p className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Is Active?</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  {...register("isActive")}
                />
              </label>
              {errors.isActive && (
                <p className="text-red-500 text-sm">
                  {errors.isActive.message}
                </p>
              )}
            </div>
          </div>

          <input
            type="radio"
            name="edit_partner_tabs" // Renamed form name
            className="tab"
            aria-label="Permissions"
          />
          <div className="tab-content">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Permissions</span>
              </label>
              <div className="border p-3 rounded-md max-h-60 overflow-y-auto">
                {ALL_PERMISSIONS.map((permission) => (
                  <label key={permission} className="label">
                    <input
                      type="checkbox"
                      value={permission}
                      {...register("permissions")}
                      className="checkbox checkbox-primary"
                    />
                    <span className="label-text">
                      {permission.replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
              </div>
              {errors.permissions && (
                <p className="text-red-500 text-sm">
                  {errors.permissions.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="modal-action justify-between">
          <button
            type="button"
            className="btn btn-error btn-outline"
            onClick={onDelete}
            disabled={loading}
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-outline"
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-outline"
              disabled={loading}
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
