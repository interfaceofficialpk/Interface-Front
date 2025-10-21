import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import Modal from "../Modal.jsx";

const expenseSchema = z.object({
  amount: z.preprocess(
    (val) => parseFloat(val),
    z.number().positive("Amount must be a positive number")
  ),
  currencyId: z.string().min(1, "Currency is required"), // GUIDs are strings in JS forms
  date: z.string().min(1, "Date is required"), // Use string for date input type="date"
  description: z.string().optional(),
  expenseTypeId: z.string().min(1, "Expense Type is required"), // GUIDs are strings in JS forms
});

export default function CreateExpenseModal({
  currencies,
  expenseTypes,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(expenseSchema),
  });

  const onSubmit = async (data) => {
    try {
      // Ensure amount is parsed as a number and date is in a consistent format if needed by API
      const payload = {
        ...data,
        amount: parseFloat(data.amount),
        date: new Date(data.date).toISOString(), // Convert to ISO string for backend
      };
      await api.post(`${GlobalConfig.apiUrl}/v1/expenses`, payload);
      alert("Expense created successfully!");
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
      }
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box border border-primary flex flex-col gap-4"
      >
        <h2 className="font-bold text-lg">Create Expense</h2>
        <div className="form-control">
          <input
            type="number"
            step="0.01" // Allow decimal input
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
