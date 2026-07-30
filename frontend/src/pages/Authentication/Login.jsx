import { NavLink } from "react-router";
import { useForm } from "react-hook-form";
import { LogIn } from "lucide-react";
import toast from "react-hot-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
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
          Sign in to continue your journey with Rup Darpan.
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
            placeholder="you@example.com"
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
          <input
            type="password"
            placeholder="Enter your password"
            className={`input input-bordered w-full ${
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
          {errors.password && (
            <p className="text-sm text-error">{errors.password.message}</p>
          )}
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full text-primary-content font-semibold mt-2"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Signing In..." : "Login"}
        </button>
      </form>

      <p className="mt-5 text-sm text-base-content/75">
        Don't have you an account register here?{" "}
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
