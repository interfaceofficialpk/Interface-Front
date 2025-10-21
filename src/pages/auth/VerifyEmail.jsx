import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalConfig } from "../../GlobalConfig.jsx";

const otpSchema = z.object({
  code: z.string().length(6, "OTP must be 6 digits"),
});

export default function VerifyEmail() {
  const { appName, apiUrl } = GlobalConfig;
  const title = `${appName} - Verify Email`;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/v1/auth/verify-email`, {
        email,
        code: data.code,
      });

      alert("Email verified successfully! You can now log in.");
      navigate("/auth/login");
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
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/v1/auth/resend-email-verification`, {
        email,
      });
      alert("Verification code resent! Check your email.");
    } catch {
      alert("Failed to resend verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <title>{title}</title>
      <div className="w-full max-w-md p-6 card border border-primary">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Verify Your Email
        </h1>
        <p className="mb-6 text-center">
          Please enter the 6-digit code sent to <strong>{email}</strong>.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <input
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              className="input input-bordered text-center tracking-widest text-lg w-full"
              {...register("code")}
              autoFocus
            />
            {errors.code && (
              <p className="text-error text-sm mt-1">{errors.code.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-outline btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={resendCode}
            disabled={loading}
            className="btn btn-link"
          >
            {loading ? "Resending..." : "Resend Verification Code"}
          </button>
        </div>
      </div>
    </div>
  );
}
