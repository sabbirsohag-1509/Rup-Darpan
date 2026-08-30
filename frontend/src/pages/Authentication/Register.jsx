import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Check, Eye, EyeOff, UploadCloud, User, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /\d/;
const specialCharRegex = /[^\w\s]/;

const passwordRequirementItems = [
  { key: "minLength", label: "At least 8 characters" },
  { key: "uppercase", label: "One uppercase letter" },
  { key: "lowercase", label: "One lowercase letter" },
  { key: "number", label: "One number" },
  { key: "special", label: "One special character" },
];

const getPasswordChecks = (password = "") => ({
  minLength: password.length >= 8,
  uppercase: uppercaseRegex.test(password),
  lowercase: lowercaseRegex.test(password),
  number: numberRegex.test(password),
  special: specialCharRegex.test(password),
});

const getPasswordStrength = (checks) => {
  const score = Object.values(checks).filter(Boolean).length;

  if (score <= 2) {
    return {
      label: "Weak",
      value: 35,
      progressClass: "progress-error",
      badgeClass: "bg-error",
    };
  }

  if (score <= 4) {
    return {
      label: "Medium",
      value: 70,
      progressClass: "progress-warning",
      badgeClass: "bg-warning text-warning-content",
    };
  }

  return {
    label: "Strong",
    value: 100,
    progressClass: "progress-success",
    badgeClass: "bg-success",
  };
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      profilePhoto: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const passwordValue = watch("password");
  const profilePhoto = watch("profilePhoto");
  const acceptTerms = watch("acceptTerms");
  const navigate = useNavigate();
  const passwordChecks = useMemo(
    () => getPasswordChecks(passwordValue),
    [passwordValue],
  );
  const passwordStrength = useMemo(
    () => getPasswordStrength(passwordChecks),
    [passwordChecks],
  );

  const handleProfilePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "rup_darpon");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dgshzmhyk/image/upload",
        formData,
      );

      const imageUrl = response.data.secure_url;
      setValue("profilePhoto", imageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  //on Submit function btn

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, acceptTerms, ...userData } = data;

      const response = await axios.post(
        "http://localhost:5000/register",
        userData,
      );

      if (response.data.insertedId) {
        toast.success("Account created successfully! 🎉");

        reset();
        navigate("/login");
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 409) {
        toast.error("This email is already registered.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      }
    }
  };

  return (
    <div className="w-full">
      <title>Register | Rup Darpon</title>
      <div className="mb-6">
        <h1 className="font-playfair text-3xl md:text-4xl font-semibold">
          Create Your Account
        </h1>
        <p className="mt-2 text-base-content/70">
          Join Rup Darpon to manage bookings and memories with style.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4 rounded-2xl border border-primary/15 bg-base-100 p-6 md:p-8"
      >
        <fieldset className="space-y-2">
          <label className="text-sm font-semibold">Full Name</label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            autoComplete="name"
            className={`input input-bordered w-full ${
              errors.name ? "input-error" : "focus-within:border-primary"
            }`}
            {...register("name", {
              required: "Full name is required.",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters.",
              },
            })}
          />
          {errors.name && (
            <p className="text-sm text-error">{errors.name.message}</p>
          )}
        </fieldset>

        <fieldset className="space-y-2">
          <label className="text-sm font-semibold">
            Profile Photo{" "}
            <span className="text-base-content/60">(Optional)</span>
          </label>
          <label
            htmlFor="profile-photo-upload"
            className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-primary/20 p-4 text-center transition-all hover:border-primary/50 hover:bg-base-200/60"
          >
            <input
              id="profile-photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePhotoUpload}
              disabled={isUploadingPhoto}
            />
            {isUploadingPhoto ? (
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <span className="loading loading-spinner loading-sm"></span>
                Uploading to Cloudinary...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <UploadCloud className="h-4 w-4" aria-hidden="true" />
                Upload profile photo
              </span>
            )}
          </label>
          <input type="hidden" {...register("profilePhoto")} />
          <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-base-200/40 p-3">
            <div className="avatar">
              <div className="w-14 rounded-full ring ring-primary/20 ring-offset-2 ring-offset-base-100">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile preview" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-base-300 text-base-content/60">
                    <User className="h-6 w-6" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-base-content/70">
              {profilePhoto
                ? "Profile photo uploaded successfully."
                : "No photo uploaded Yet. A default avatar will be used."}
            </p>
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <label className="text-sm font-semibold">Email Address</label>
          <input
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            className={`input input-bordered w-full ${
              errors.email ? "input-error" : "focus-within:border-primary"
            }`}
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: emailRegex,
                message: "Please enter a valid email address.",
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-error">{errors.email.message}</p>
          )}
        </fieldset>

        <fieldset className="space-y-2">
          <label className="text-sm font-semibold">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
              className={`input input-bordered w-full pr-11 ${
                errors.password ? "input-error" : "focus-within:border-primary"
              }`}
              {...register("password", {
                required: "Password is required.",
                validate: {
                  minLength: (value) =>
                    value.length >= 8 ||
                    "Password must be at least 8 characters.",
                  uppercase: (value) =>
                    uppercaseRegex.test(value) ||
                    "Password must include at least one uppercase letter.",
                  lowercase: (value) =>
                    lowercaseRegex.test(value) ||
                    "Password must include at least one lowercase letter.",
                  number: (value) =>
                    numberRegex.test(value) ||
                    "Password must include at least one number.",
                  specialCharacter: (value) =>
                    specialCharRegex.test(value) ||
                    "Password must include at least one special character.",
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-base-content/60 transition-colors hover:text-base-content"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="space-y-2 rounded-xl border border-primary/10 bg-base-200/40 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-base-content/70">
                Password strength
              </span>
              <span
                className={`badge badge-sm border-0 transition-all duration-300 ${passwordStrength.badgeClass}`}
              >
                {passwordStrength.label}
              </span>
            </div>
            <progress
              className={`progress h-2 w-full transition-all duration-300 ${passwordStrength.progressClass}`}
              value={passwordStrength.value}
              max="100"
            />
            <ul className="space-y-1.5">
              {passwordRequirementItems.map((item) => {
                const isMet = passwordChecks[item.key];
                return (
                  <li
                    key={item.key}
                    className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
                      isMet ? "text-success" : "text-base-content/60"
                    }`}
                  >
                    <span
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-300 ${
                        isMet ? "bg-success/20" : "bg-base-300"
                      }`}
                    >
                      {isMet && (
                        <Check className="h-3 w-3" aria-hidden="true" />
                      )}
                    </span>
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>
          {errors.password && (
            <p className="text-sm text-error">{errors.password.message}</p>
          )}
        </fieldset>

        <fieldset className="space-y-2">
          <label className="text-sm font-semibold">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className={`input input-bordered w-full pr-11 ${
                errors.confirmPassword
                  ? "input-error"
                  : "focus-within:border-primary"
              }`}
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match.",
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-base-content/60 transition-colors hover:text-base-content"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </fieldset>

        <fieldset className="space-y-1">
          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              className={`checkbox checkbox-primary ${
                errors.acceptTerms ? "checkbox-error" : ""
              }`}
              {...register("acceptTerms", {
                required: "You must agree before creating an account.",
              })}
            />
            <span className="label-text text-sm">
              I agree to the Terms of Service and Privacy Policy.
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-sm text-error">{errors.acceptTerms.message}</p>
          )}
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting || isUploadingPhoto || !acceptTerms}
          className="btn btn-primary w-full text-primary-content font-semibold mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Create Account
            </>
          )}
        </button>

        <div className="divider text-xs text-base-content/60">OR</div>
        {/* Google Sign in btn  */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "http://localhost:5000/auth/google";
          }}
          className="btn btn-outline w-full border-primary/30 hover:border-primary hover:bg-primary/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303C33.651,32.657,29.193,36,24,36c-6.627,0-12-5.373-12-12
      s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039
      l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.145,35.091,26.715,36,24,36
      c-5.173,0-9.621-3.329-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.793,2.237-2.231,4.166-4.094,5.571
      c0.001-0.001,0.002-0.002,0.003-0.002l6.19,5.238C36.971,39.194,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Continue with Google
        </button>
      </form>

      <p className="mt-5 text-sm text-base-content/75">
        Already have an account?{" "}
        <NavLink
          to="/login"
          className="font-semibold text-primary hover:underline"
        >
          Login
        </NavLink>
      </p>
    </div>
  );
};

export default Register;
