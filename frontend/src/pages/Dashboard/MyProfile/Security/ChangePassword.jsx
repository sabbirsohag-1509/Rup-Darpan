import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Save,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000";

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
      badgeClass: "bg-error text-error-content",
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
    badgeClass: "bg-success text-success-content",
  };
};

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");

  // =========================================
  // PASSWORD CHECKS
  // =========================================

  const passwordChecks = useMemo(
    () => getPasswordChecks(newPasswordValue),
    [newPasswordValue],
  );

  const passwordStrength = useMemo(
    () => getPasswordStrength(passwordChecks),
    [passwordChecks],
  );

  // =========================================
  // SUBMIT
  // =========================================

  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(
        `${API_URL}/users/change-password`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(
        response.data?.message || "Password changed successfully! 🔐",
      );

      reset();
    } catch (error) {
      console.error("Change password error:", error);

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 401) {
        toast.error(message || "Current password is incorrect.");
      } else if (status === 400) {
        toast.error(message || "Please check your password.");
      } else if (status === 404) {
        toast.error("User account not found.");
      } else {
        toast.error(message || "Failed to change password. Please try again.");
      }
    }
  };

  return (
    <section className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm sm:p-7">
      {/* =========================================
          HEADER
      ========================================== */}

      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h2 className="font-playfair text-xl font-semibold sm:text-2xl">
            Change Password
          </h2>

          <p className="mt-1 text-sm text-base-content/55">
            Keep your account secure by using a strong password.
          </p>
        </div>
      </div>

      {/* =========================================
          FORM
      ========================================== */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        {/* =========================================
            CURRENT PASSWORD
        ========================================== */}

        <fieldset className="space-y-2">
          <label className="text-sm font-semibold">
            Current Password
          </label>

          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />

            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter your current password"
              autoComplete="current-password"
              className={`input input-bordered w-full pl-10 pr-11 ${
                errors.currentPassword
                  ? "input-error"
                  : "focus-within:border-primary"
              }`}
              {...register("currentPassword", {
                required: "Current password is required.",
              })}
            />

            <button
              type="button"
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-base-content/60 transition-colors hover:text-base-content"
              onClick={() =>
                setShowCurrentPassword((prev) => !prev)
              }
              aria-label={
                showCurrentPassword
                  ? "Hide current password"
                  : "Show current password"
              }
            >
              {showCurrentPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.currentPassword && (
            <p className="text-sm text-error">
              {errors.currentPassword.message}
            </p>
          )}
        </fieldset>

        {/* =========================================
            NEW PASSWORD
        ========================================== */}

        <fieldset className="space-y-2">
          <label className="text-sm font-semibold">
            New Password
          </label>

          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />

            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Create a strong new password"
              autoComplete="new-password"
              className={`input input-bordered w-full pl-10 pr-11 ${
                errors.newPassword
                  ? "input-error"
                  : "focus-within:border-primary"
              }`}
              {...register("newPassword", {
                required: "New password is required.",

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
              onClick={() => setShowNewPassword((prev) => !prev)}
              aria-label={
                showNewPassword
                  ? "Hide new password"
                  : "Show new password"
              }
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password Strength */}

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
                      isMet
                        ? "text-success"
                        : "text-base-content/60"
                    }`}
                  >
                    <span
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-300 ${
                        isMet ? "bg-success/20" : "bg-base-300"
                      }`}
                    >
                      {isMet && (
                        <Check className="h-3 w-3" />
                      )}
                    </span>

                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>

          {errors.newPassword && (
            <p className="text-sm text-error">
              {errors.newPassword.message}
            </p>
          )}
        </fieldset>

        {/* =========================================
            CONFIRM PASSWORD
        ========================================== */}

        <fieldset className="space-y-2">
          <label className="text-sm font-semibold">
            Confirm New Password
          </label>

          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              className={`input input-bordered w-full pl-10 pr-11 ${
                errors.confirmPassword
                  ? "input-error"
                  : "focus-within:border-primary"
              }`}
              {...register("confirmPassword", {
                required: "Please confirm your new password.",

                validate: (value) =>
                  value === newPasswordValue ||
                  "Passwords do not match.",
              })}
            />

            <button
              type="button"
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-base-content/60 transition-colors hover:text-base-content"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-sm text-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </fieldset>

        {/* =========================================
            INFO
        ========================================== */}

        <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4">
          <p className="text-xs leading-5 text-base-content/70">
            After changing your password, make sure you remember the new
            password and never share it with anyone.
          </p>
        </div>

        {/* =========================================
            BUTTON
        ========================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-base-300 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => reset()}
            disabled={isSubmitting}
            className="btn btn-ghost rounded-full"
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary rounded-full px-7"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Changing Password...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Change Password
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ChangePassword;