import { NavLink } from "react-router";
import { useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data;
    console.log("Register payload:", payload, "confirmPassword:", confirmPassword);
    toast.success("Registration form submitted successfully.");
    reset();
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="font-playfair text-3xl md:text-4xl font-semibold">
          Create Your Account
        </h1>
        <p className="mt-2 text-base-content/70">
          Join Rup Darpan to manage bookings and memories with style.
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
            placeholder="Your full name"
            className={`input input-bordered w-full ${
              errors.name ? "input-error" : "focus-within:border-primary"
            }`}
            {...register("name", {
              required: "Full name is required.",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters.",
              },
            })}
          />
          {errors.name && (
            <p className="text-sm text-error">{errors.name.message}</p>
          )}
        </fieldset>

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
            placeholder="Create a strong password"
            className={`input input-bordered w-full ${
              errors.password ? "input-error" : "focus-within:border-primary"
            }`}
            {...register("password", {
              required: "Password is required.",
              pattern: {
                value: passwordRegex,
                message:
                  "Password must be 8+ chars with uppercase, lowercase, number, and symbol.",
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-error">{errors.password.message}</p>
          )}
        </fieldset>

        <fieldset className="space-y-2">
          <label className="text-sm font-semibold">Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter your password"
            className={`input input-bordered w-full ${
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
          {errors.confirmPassword && (
            <p className="text-sm text-error">{errors.confirmPassword.message}</p>
          )}
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full text-primary-content font-semibold mt-2"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Creating Account..." : "Register"}
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
