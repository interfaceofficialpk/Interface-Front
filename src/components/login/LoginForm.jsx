import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, LockKeyhole } from "lucide-react";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const apiUrl = GlobalConfig.apiUrl;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/v1/auth/login`, data);
      const { accessToken, refreshToken } = response.data;
      login(accessToken, refreshToken);
      navigate("/dashboard");
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

  return (
    <div className="card w-full max-w-md border border-primary">
      <form className="card-body gap-2" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl text-center">Welcome Back!</h2>
        <p className="text-md text-center">Log in to access your dashboard.</p>
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
            <p className="text-error text-sm mt-1">{errors.email.message}</p>
          )}
          {errors.email?.message.includes("not verified") && (
            <Link
              to={`/auth/verify-email?email=${encodeURIComponent(
                errors.email.ref?.value || ""
              )}`}
              className="link link-primary text-sm"
            >
              Verify email
            </Link>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="password" className="input w-full">
            <LockKeyhole size={20} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
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
          {errors.password && (
            <p className="text-error text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <Link
          to="/auth/forgot-password"
          className="link link-primary link-hover text-right"
        >
          Forgot password?
        </Link>

        {/* Submit Button */}
        <div className="form-control">
          <button
            type="submit"
            className="btn btn-outline btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/auth/signup" className="link link-primary font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
