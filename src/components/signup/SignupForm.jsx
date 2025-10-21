import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalConfig } from "../../GlobalConfig.jsx";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["student", "immigrationclient"], "Please select a role"),
    locationId: z.string().optional(),
    nationalityId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUpForm() {
  const apiUrl = GlobalConfig.apiUrl;
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [dropdownsLoading, setDropdownsLoading] = useState(true);
  const [dropdownsError, setDropdownsError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    const loadDropdowns = async () => {
      setDropdownsLoading(true);
      setDropdownsError(null);

      try {
        // for now
        // throw new Error("Signups are disabled. Contact an administrator");
        // end for now

        const [locationsResponse, nationalitiesResponse] = await Promise.all([
          axios.get(`${apiUrl}/v1/public/locations`),
          axios.get(`${apiUrl}/v1/public/nationalities`),
        ]);

        setLocations(locationsResponse.data);
        setNationalities(nationalitiesResponse.data);
      } catch (err) {
        setDropdownsError(err.message);
      } finally {
        setDropdownsLoading(false);
      }
    };

    loadDropdowns();
  }, [apiUrl]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.post(`${apiUrl}/v1/auth/register`, data);

      alert("Account created successfully! Please verify your email.");
      navigate(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
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

  if (dropdownsError) {
    return (
      <div className="card w-full max-w-md border border-primary p-6">
        <p className="text-center text-error text-lg">{dropdownsError}</p>
      </div>
    );
  }

  if (dropdownsLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="card w-full max-w-md border border-primary">
      <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl text-center mb-4">Create Your Account</h2>

        <div className="form-control">
          <label className="input input-bordered w-full flex items-center gap-2">
            <User size={20} />
            <input
              type="text"
              placeholder="First Name"
              {...register("firstName")}
            />
          </label>
          {errors.firstName && (
            <p className="text-error text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="input input-bordered w-full flex items-center gap-2">
            <User size={20} />
            <input
              type="text"
              placeholder="Middle Name (optional)"
              {...register("middleName")}
            />
          </label>
        </div>

        <div className="form-control">
          <label className="input input-bordered w-full flex items-center gap-2">
            <User size={20} />
            <input
              type="text"
              placeholder="Last Name"
              {...register("lastName")}
            />
          </label>
          {errors.lastName && (
            <p className="text-error text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="input input-bordered w-full flex items-center gap-2">
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
        </div>

        <div className="form-control">
          <label className="input input-bordered w-full flex items-center gap-2">
            <LockKeyhole size={20} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
            />
            <label className="swap swap-rotate cursor-pointer">
              <input
                type="checkbox"
                onClick={() => setShowPassword(!showPassword)}
                className="hidden"
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

        <div className="form-control">
          <label className="input input-bordered w-full flex items-center gap-2">
            <LockKeyhole size={20} />
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />
            <label className="swap swap-rotate cursor-pointer">
              <input
                type="checkbox"
                onClick={() => setShowConfirm(!showConfirm)}
                className="hidden"
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

        {/* Selects without icons */}
        <div className="form-control">
          <select
            className="select select-bordered w-full"
            {...register("role")}
            defaultValue=""
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="student">Student</option>
            <option value="immigrationclient">Immigration Client</option>
          </select>
          {errors.role && (
            <p className="text-error text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        <div className="form-control">
          <select
            className="select select-bordered w-full"
            {...register("locationId")}
            defaultValue=""
          >
            <option value="">Select Location (optional)</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <select
            className="select select-bordered w-full"
            {...register("nationalityId")}
            defaultValue=""
          >
            <option value="">Select Nationality (optional)</option>
            {nationalities.map((nat) => (
              <option key={nat.id} value={nat.id}>
                {nat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-outline btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/auth/login" className="link link-primary font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
