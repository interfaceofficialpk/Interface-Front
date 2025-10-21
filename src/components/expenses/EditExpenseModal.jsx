import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect } from "react";
import Modal from "../Modal.jsx";

const expenseSchema = z.object({
  amount: z.preprocess(
    (val) => parseFloat(val),
    z.number().positive("Amount must be a positive number")
  ),
  currencyId: z.string().min(1, "Currency is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  expenseTypeId: z.string().min(1, "Expense Type is required"),
});

export default function EditExpenseModal({
  expense,
  currencies,
  expenseTypes,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: expense.amount,
      currencyId: expense.currencyId,
      date: new Date(expense.date).toISOString().split("T")[0], // Format date for input type="date"
      description: expense.description,
      expenseTypeId: expense.expenseTypeId,
    },
  });

  useEffect(() => {
    if (expense) {
      reset({
        amount: expense.amount,
        currencyId: expense.currencyId,
        date: new Date(expense.date).toISOString().split("T")[0],
        description: expense.description,
        expenseTypeId: expense.expenseTypeId,
      });
    }
  }, [expense, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        amount: parseFloat(data.amount),
        date: new Date(data.date).toISOString(),
      };
      await api.put(
        `${GlobalConfig.apiUrl}/v1/expenses/${expense.id}`,
        payload
      );
      alert("Expense updated successfully!");
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
      "Are you sure you want to delete this expense?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`${GlobalConfig.apiUrl}/v1/expenses/${expense.id}`);
      alert("Expense deleted successfully!");
      reset();
      onClose(true); // refresh list
    } catch {
      alert("Failed to delete expense.");
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box flex flex-col gap-4 border border-primary"
      >
        <h2 className="text-lg font-bold">Edit Expense</h2>

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
            {...register("expenseTypeId")}
            className="select select-bordered w-full"
          >
            <option value="">Select Expense Type</option>
            {expenseTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.expenseTypeId && (
            <p className="text-red-500 text-sm">
              {errors.expenseTypeId.message}
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
