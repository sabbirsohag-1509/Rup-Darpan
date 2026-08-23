import { NavLink, useLocation, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  LogIn,
  Mail,
  X,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const API_URL = "http://localhost:5000";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // =========================================================
  // LOGIN
  // =========================================================

  const onSubmit = async (data) => {
    try {
      const { email, password, rememberMe } = data;

      const loggedInUser = await login(
        email,
        password,
        rememberMe,
      );

      if (loggedInUser) {
        toast.success(
          "Login successful! Welcome back, " +
            loggedInUser.name +
            "!",
        );

        console.log("Logged in user:", loggedInUser);
        console.log("Remember Me:", rememberMe);

        reset();

        const destination = location.state?.from || "/";

        navigate(destination, {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        toast.error("Invalid email or password.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Login failed. Please try again.",
        );
      }
    }
  };

  // =========================================================
  // OPEN FORGOT PASSWORD MODAL
  // =========================================================

  const handleOpenForgotModal = () => {
    setForgotEmail("");
    setShowForgotModal(true);
  };

  // =========================================================
  // CLOSE FORGOT PASSWORD MODAL
  // =========================================================

  const handleCloseForgotModal = () => {
    if (isSendingReset) return;

    setForgotEmail("");
    setShowForgotModal(false);
  };

  // =========================================================
  // SEND RESET EMAIL
  // =========================================================

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    const email = forgotEmail.trim();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setIsSendingReset(true);

      const response = await fetch(
        `${API_URL}/users/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      // Backend response JSON
      const data = await response.json();

      console.log("Forgot password response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to send password reset email.",
        );
      }

      toast.success(
        data.message ||
          "Password reset instructions have been sent to your email.",
      );

      setShowForgotModal(false);
      setForgotEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        error.message ||
          "Failed to send password reset email.",
      );
    } finally {
      setIsSendingReset(false);
    }
  };

  // =========================================================
  // ESC KEY
  // =========================================================

  const handleForgotModalKeyDown = (event) => {
    if (event.key === "Escape" && !isSendingReset) {
      handleCloseForgotModal();
    }
  };

  return (
    <>
      <title>Login | Rup Darpon</title>
      {/* =====================================================
          LOGIN PAGE
      ===================================================== */}

      <div className="w-full">
        {/* HEADER */}

        <div className="mb-6">
          <h1 className="font-playfair text-3xl font-semibold md:text-4xl">
            Welcome Back
          </h1>

          <p className="mt-2 text-base-content/70">
            Sign in to continue your journey with Rup Darpon.
          </p>
        </div>

        {/* LOGIN FORM */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 rounded-2xl border border-primary/15 bg-base-100 p-6 md:p-8"
        >
          {/* EMAIL */}

          <fieldset className="space-y-2">
            <label className="text-sm font-semibold">
              Email Address
            </label>

            <input
              type="email"
              placeholder="youexample@gmail.com"
              autoComplete="email"
              className={`input input-bordered w-full ${
                errors.email
                  ? "input-error"
                  : "focus-within:border-primary"
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
              <p className="text-sm text-error">
                {errors.email.message}
              </p>
            )}
          </fieldset>

          {/* PASSWORD */}

          <fieldset className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold">
                Password
              </label>

              {/* FORGOT PASSWORD */}

              <button
                type="button"
                onClick={handleOpenForgotModal}
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`input input-bordered w-full pr-12 ${
                  errors.password
                    ? "input-error"
                    : "focus-within:border-primary"
                }`}
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 8,
                    message:
                      "Password must be at least 8 characters.",
                  },
                })}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="btn btn-ghost btn-xs absolute right-2 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-primary"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                ) : (
                  <Eye
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-error">
                {errors.password.message}
              </p>
            )}
          </fieldset>

          {/* REMEMBER ME */}

          <div className="flex items-center justify-between gap-3">
            <label className="label cursor-pointer justify-start gap-2 p-0">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                {...register("rememberMe")}
              />

              <span className="label-text text-sm text-base-content/85">
                Remember Me
              </span>
            </label>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary mt-2 w-full font-semibold text-primary-content"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                Login
              </>
            )}
          </button>

          {/* DIVIDER */}

          <div className="divider my-2 text-xs uppercase tracking-wider text-base-content/50">
            OR
          </div>

          {/* GOOGLE LOGIN */}

          <button
            type="button"
            onClick={() => {
              window.location.href =
                `${API_URL}/auth/google`;
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
                d="M43.611 20.083H42V20H24v8h11.303C33.651 32.657 29.193 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />

              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691z"
              />

              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.145 35.091 26.715 36 24 36c-5.173 0-9.621-3.329-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />

              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-.793 2.237-2.231 4.166-4.094 5.571l.003-.002 6.19 5.238C36.971 39.194 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>

            Continue with Google
          </button>
        </form>

        {/* REGISTER */}

        <p className="mt-5 text-sm text-base-content/75">
          Don't have an account?{" "}
          <NavLink
            to="/register"
            className="font-semibold text-primary hover:underline"
          >
            Register
          </NavLink>
        </p>
      </div>

      {/* =====================================================
          FORGOT PASSWORD MODAL
      ===================================================== */}

      {showForgotModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isSendingReset
            ) {
              handleCloseForgotModal();
            }
          }}
          onKeyDown={handleForgotModalKeyDown}
        >
          {/* MODAL */}

          <div
            className="w-full max-w-md rounded-3xl border border-primary/10 bg-base-100 shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-base-300 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <KeyRound className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h2 className="font-playfair text-xl font-semibold sm:text-2xl">
                    Forgot Password?
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-base-content/50 sm:text-sm">
                    Enter your email and we'll send you a
                    password reset link.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseForgotModal}
                disabled={isSendingReset}
                className="btn btn-circle btn-ghost btn-sm"
                aria-label="Close forgot password modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MODAL BODY */}

            <form
              onSubmit={handleForgotPassword}
              className="space-y-5 p-5 sm:p-6"
            >
              {/* INFO */}

              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <p className="text-sm leading-6 text-base-content/70">
                    No worries! Enter the email address
                    associated with your account. We'll help
                    you reset your password.
                  </p>
                </div>
              </div>

              {/* EMAIL */}

              <fieldset className="space-y-2">
                <label className="text-sm font-semibold">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />

                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(event) =>
                      setForgotEmail(event.target.value)
                    }
                    placeholder="youexample@gmail.com"
                    autoComplete="email"
                    autoFocus
                    disabled={isSendingReset}
                    className="input input-bordered w-full pl-10 focus:border-primary"
                  />
                </div>
              </fieldset>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-base-300 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseForgotModal}
                  disabled={isSendingReset}
                  className="btn btn-outline rounded-full"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="btn btn-primary rounded-full px-6"
                >
                  {isSendingReset ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Reset Link
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

export default Login;