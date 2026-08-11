import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000";

const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /\d/;
const specialCharRegex = /[^\w\s]/;

const passwordRequirementItems = [
  {
    key: "minLength",
    label: "At least 8 characters",
  },
  {
    key: "uppercase",
    label: "One uppercase letter",
  },
  {
    key: "lowercase",
    label: "One lowercase letter",
  },
  {
    key: "number",
    label: "One number",
  },
  {
    key: "special",
    label: "One special character",
  },
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
  const [isOpen, setIsOpen] = useState(false);

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

  // ======================================================
  // PASSWORD CHECKS
  // ======================================================

  const passwordChecks = useMemo(
    () => getPasswordChecks(newPasswordValue),
    [newPasswordValue],
  );

  const passwordStrength = useMemo(
    () => getPasswordStrength(passwordChecks),
    [passwordChecks],
  );

  // ======================================================
  // OPEN MODAL
  // ======================================================

  const handleOpen = () => {
    setIsOpen(true);
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const handleClose = () => {
    if (isSubmitting) return;

    reset();

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setIsOpen(false);
  };

  // ======================================================
  // ESC KEY
  // ======================================================

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isSubmitting]);

  // ======================================================
  // SUBMIT
  // ======================================================

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

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setIsOpen(false);
    } catch (error) {
      console.error("Change password error:", error);

      console.log("STATUS:", error.response?.status);
      console.log("RESPONSE DATA:", error.response?.data);
      console.log("MESSAGE:", error.response?.data?.message);

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 401) {
        toast.error(message || "Current password is incorrect.");
      } else if (status === 400) {
        toast.error(message || "Please check your password.");
      } else if (status === 404) {
        toast.error(message || "User account not found.");
      } else {
        toast.error(message || "Failed to change password. Please try again.");
      }
    }
  };

  return (
    <>
      {/* ==================================================
          CHANGE PASSWORD CARD
      ================================================== */}

      <section className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Left */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h2 className="font-playfair text-xl font-semibold sm:text-2xl">
                Change Your Password{" "}
                <span className="font-normal opacity-80">
                  (পাসওয়ার্ড পরিবর্তন)
                </span>
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/55">
                Update your password regularly to keep your account secure.
                (আপনার অ্যাকাউন্ট নিরাপদ রাখতে নিয়মিত পাসওয়ার্ড পরিবর্তন করুন।)
              </p>
            </div>
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleOpen}
            className="btn btn-primary rounded-full px-6"
          >
            <LockKeyhole className="h-4 w-4" />
            Change Password
          </button>
        </div>
      </section>

      {/* ==================================================
          MODAL
      ================================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          {/* Modal */}
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-primary/10 bg-base-100 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-base-300 bg-base-100 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h2 className="font-playfair text-xl font-semibold sm:text-2xl">
                    Change Password
                  </h2>

                  <p className="mt-1 text-xs text-base-content/50 sm:text-sm">
                    Create a strong password for your account.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="btn btn-circle btn-ghost btn-sm"
                aria-label="Close change password modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5 p-5 sm:p-6"
            >
              {/* ==================================================
                  CURRENT PASSWORD
              ================================================== */}

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
                        : "focus:border-primary"
                    }`}
                    {...register("currentPassword", {
                      required: "Current password is required.",
                    })}
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-base-content/60 transition-colors hover:text-base-content"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
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

              {/* ==================================================
                  NEW PASSWORD
              ================================================== */}

              <fieldset className="space-y-2">
                <label className="text-sm font-semibold">New Password</label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />

                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Create a strong new password"
                    autoComplete="new-password"
                    className={`input input-bordered w-full pl-10 pr-11 ${
                      errors.newPassword
                        ? "input-error"
                        : "focus:border-primary"
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

                <div className="space-y-2 rounded-2xl border border-primary/10 bg-base-200/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-base-content/70">
                      Password strength
                    </span>

                    <span
                      className={`badge badge-sm border-0 ${passwordStrength.badgeClass}`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  <progress
                    className={`progress h-2 w-full ${passwordStrength.progressClass}`}
                    value={passwordStrength.value}
                    max="100"
                  />

                  <ul className="grid gap-1.5 sm:grid-cols-2">
                    {passwordRequirementItems.map((item) => {
                      const isMet = passwordChecks[item.key];

                      return (
                        <li
                          key={item.key}
                          className={`flex items-center gap-2 text-xs ${
                            isMet ? "text-success" : "text-base-content/60"
                          }`}
                        >
                          <span
                            className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                              isMet ? "bg-success/20" : "bg-base-300"
                            }`}
                          >
                            {isMet && <Check className="h-3 w-3" />}
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

              {/* ==================================================
                  CONFIRM PASSWORD
              ================================================== */}

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
                        : "focus:border-primary"
                    }`}
                    {...register("confirmPassword", {
                      required: "Please confirm your new password.",

                      validate: (value) =>
                        value === newPasswordValue || "Passwords do not match.",
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

              {/* ==================================================
                  SECURITY NOTICE
              ================================================== */}

              <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4">
                <p className="text-xs leading-5 text-base-content/70">
                  Never share your password with anyone. Make sure your new
                  password is something you can remember.
                </p>
              </div>

              {/* ==================================================
                  BUTTONS
              ================================================== */}

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
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="btn btn-outline rounded-full"
                >
                  Cancel
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
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
