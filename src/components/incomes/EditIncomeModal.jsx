import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect } from "react";
import Modal from "../Modal.jsx";

// Define the IncomeStatus enum options for the frontend
const IncomeStatusOptions = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Received" },
];

const incomeSchema = z.object({
  amount: z.preprocess(
    (val) => parseFloat(val),
    z.number().positive("Amount must be a positive number")
  ),
  currencyId: z.string().min(1, "Currency is required"),
  date: z.string().min(1, "Date is required"),
  incomeStatus: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().int().min(0).max(1, "Invalid Income Status")
  ),
  description: z.string().optional(),
  incomeTypeId: z.string().min(1, "Income Type is required"),
});

export default function EditIncomeModal({
  income,
  currencies,
  incomeTypes,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount: income.amount,
      currencyId: income.currencyId,
      date: new Date(income.date).toISOString().split("T")[0], // Format date for input type="date"
      incomeStatus: income.incomeStatus,
      description: income.description,
      incomeTypeId: income.incomeTypeId,
    },
  });

  useEffect(() => {
    if (income) {
      reset({
        amount: income.amount,
        currencyId: income.currencyId,
        date: new Date(income.date).toISOString().split("T")[0],
        incomeStatus: income.incomeStatus,
        description: income.description,
        incomeTypeId: income.incomeTypeId,
      });
    }
  }, [income, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        amount: parseFloat(data.amount),
        date: new Date(data.date).toISOString(),
        incomeStatus: parseInt(data.incomeStatus, 10),
      };
      await api.put(`${GlobalConfig.apiUrl}/v1/incomes/${income.id}`, payload);
      alert("Income updated successfully!");
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
        alert("An unexpected error occurred.");
      }
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this income?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`${GlobalConfig.apiUrl}/v1/incomes/${income.id}`);
      alert("Income deleted successfully!");
      reset();
      onClose(true); // refresh list
    } catch {
      alert("Failed to delete income.");
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box flex flex-col gap-4 border border-primary"
      >
        <h2 className="text-lg font-bold">Edit Income</h2>

        <div className="form-control">
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            {...register("amount")}
            className="input w-full"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>

        <div className="form-control">
          <select
            {...register("currencyId")}
            className="select select-bordered w-full"
          >
            <option value="">Select Currency</option>
            {currencies.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.name} ({currency.code})
              </option>
            ))}
          </select>
          {errors.currencyId && (
            <p className="text-red-500 text-sm">{errors.currencyId.message}</p>
          )}
        </div>

        <div className="form-control">
          <input
            type="date"
            placeholder="Date"
            {...register("date")}
            className="input w-full"
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>

        <div className="form-control">
          <select
            {...register("incomeStatus")}
            className="select select-bordered w-full"
          >
            <option value="">Select Status</option>
            {IncomeStatusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          {errors.incomeStatus && (
            <p className="text-red-500 text-sm">
              {errors.incomeStatus.message}
            </p>
          )}
        </div>

        <div className="form-control">
          <textarea
            placeholder="Description (optional)"
            {...register("description")}
            className="textarea w-full"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div className="form-control">
          <select
            {...register("incomeTypeId")}
            className="select select-bordered w-full"
          >
            <option value="">Select Income Type</option>
            {incomeTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.incomeTypeId && (
            <p className="text-red-500 text-sm">
              {errors.incomeTypeId.message}
            </p>
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
