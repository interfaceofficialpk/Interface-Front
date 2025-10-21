import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { GlobalConfig } from "../../GlobalConfig";

// Update the validation schema to remove the email field
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirmation password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordForm({ token }) {
  const apiUrl = GlobalConfig.apiUrl;
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setShowError(false);

      const payload = {
        token: token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };

      await axios.post(`${apiUrl}/v1/auth/reset-password`, payload);

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          if (
            key === "Invalid token." ||
            key ===
              "Password reset token has expired. Please request a new one."
          ) {
            // Note: We can't map this to the email field anymore. We'll use a generic error message.
            setShowError(true);
          } else {
            setError(key, { type: "server", message: serverErrors[key] });
          }
        });
      } else {
        setShowError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md border border-primary">
      {showSuccess ? (
        <div className="card-body text-center">
          <h2 className="text-xl">Success!</h2>
          <p>Your password has been reset. Redirecting to login...</p>
        </div>
      ) : (
        <form className="card-body gap-2" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl text-center">Reset Password</h2>
          <p className="text-md text-center">Enter your new password.</p>

          <div className="form-control">
            <label htmlFor="newPassword" className="input w-full">
              <LockKeyhole size={20} />
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                {...register("newPassword")}
              />
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  onClick={() => setShowPassword(!showPassword)}
                />
                <div className="swap-on">
                  <Eye size={20} />
                </div>
                <div className="swap-off">
                  <EyeOff size={20} />
                </div>
              </label>
            </label>
            {errors.newPassword && (
              <p className="text-error text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="confirmPassword" className="input w-full">
              <LockKeyhole size={20} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
                <div className="swap-on">
                  <Eye size={20} />
                </div>
                <div className="swap-off">
                  <EyeOff size={20} />
                </div>
              </label>
            </label>
            {errors.confirmPassword && (
              <p className="text-error text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-outline btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
          {showError && (
            <p className="text-error text-center mt-2">
              An unexpected error occurred. The token may be invalid or expired.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
