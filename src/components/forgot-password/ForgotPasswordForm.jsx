import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import axios from "axios";
import { Mail } from "lucide-react"; // Importing Mail icon from lucide-react
import { GlobalConfig } from "../../GlobalConfig.jsx"; // Assuming GlobalConfig is in a parent directory

// Zod schema for email validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordForm() {
  const apiUrl = GlobalConfig.apiUrl; // Get API URL from GlobalConfig

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // State to display success/error messages
  const [isSuccess, setIsSuccess] = useState(false); // State to track if the operation was successful

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset, // To clear the form after successful submission
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage(""); // Clear previous messages
    setIsSuccess(false); // Reset success state

    try {
      // Make an API call to your backend's forgot password endpoint
      await axios.post(`${apiUrl}/v1/auth/forgot-password`, data);

      setMessage(
        "If your email is registered, a password reset link has been sent to your inbox."
      );
      setIsSuccess(true);
      reset(); // Clear the form fields
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          setError(key, {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
        setMessage("Please correct the errors above.");
        setIsSuccess(false);
      } else {
        setMessage("An unexpected error occurred. Please try again later.");
        setIsSuccess(false);
        console.error("Forgot password error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md border border-primary">
      <form className="card-body gap-4" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        <p className="text-md text-center">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {/* Message display area */}
        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              isSuccess ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="form-control">
          <label htmlFor="email" className="input w-full">
            <Mail size={20} />
            <input
              id="email"
              type="text"
              placeholder="you@example.com"
              {...register("email")}
            />
          </label>
          {errors.email && (
            <p className="text-error text-sm mt-1 ml-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-control mt-4">
          <button
            type="submit"
            className="btn btn-primary btn-outline w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </div>

        {/* Back to Login Link */}
        <p className="text-center text-sm">
          Remember your password?{" "}
          <Link to="/auth/login" className="link link-primary font-semibold">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}
