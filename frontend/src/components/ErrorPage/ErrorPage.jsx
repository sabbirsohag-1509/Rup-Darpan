import { Link } from "react-router";
import { ArrowLeft, Home } from "lucide-react";
import ErrorImg from "../../assets/error-img.jpg";
import Logo from "../shared/Logo";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Full Screen Image Section */}
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Background Image */}
        <img
          src={ErrorImg}
          alt="404 Page Not Found"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Content on Image */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
          <div className="w-full max-w-3xl text-center text-white">

            {/* Rup Darpon Branding */}
            <div className="flex items-center justify-center text-primary">
              <Logo />
            </div>

            {/* Error Title */}
            <h1 className="mt-6 font-playfair text-4xl font-bold sm:text-5xl md:text-6xl">
              Oops! Page Not Found
            </h1>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              The page you are looking for does not exist or has been moved.
            </p>

            {/* Buttons */}
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="btn btn-primary px-6 text-primary-content shadow-lg"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Link>

              <button
                type="button"
                onClick={() => window.history.back()}
                className="btn border-primary bg-transparent px-6 text-primary hover:bg-primary hover:text-primary-content"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            </div>

            {/* Footer */}
            <p className="mt-10 text-xs text-white/50">
              © {new Date().getFullYear()} Rup Darpon. Capturing moments,
              creating memories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;