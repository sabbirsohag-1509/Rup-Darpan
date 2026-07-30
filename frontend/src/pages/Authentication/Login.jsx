import { NavLink } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

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

  const onSubmit = async (data) => {
    console.log("Login payload:", data);
    toast.success("Login form submitted successfully.");
    reset();
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="font-playfair text-3xl md:text-4xl font-semibold">
          Welcome Back
        </h1>
        <p className="mt-2 text-base-content/70">
          Sign in to continue your journey with Rup Darpon.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4 rounded-2xl border border-primary/15 bg-base-100 p-6 md:p-8"
      >
        <fieldset className="space-y-2">
          <label className="text-sm font-semibold">Email Address</label>
          <input
            type="email"
            placeholder="youexample@gmail.com"
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
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-semibold">Password</label>
            <NavLink
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot Password?
            </NavLink>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`input input-bordered w-full pr-12 ${
                errors.password ? "input-error" : "focus-within:border-primary"
              }`}
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters.",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="btn btn-ghost btn-xs absolute right-2 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-primary"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-error">{errors.password.message}</p>
          )}
        </fieldset>

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
          <span className="text-sm text-transparent select-none">
            Forgot Password?
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full text-primary-content font-semibold mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-xs" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Login
            </>
          )}
        </button>

        <div className="divider my-2 text-xs uppercase tracking-wider text-base-content/50">
          OR
        </div>

        <button
          type="button"
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
              c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.194,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Continue with Google
        </button>
      </form>

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
  );
};

export default Login;
