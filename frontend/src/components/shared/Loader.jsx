const spinnerSizeClasses = {
  xs: "h-3 w-3 border-2",
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
  xl: "h-16 w-16 border-4",
};

const Loader = ({ size = "md", label = "", className = "", fullScreen = false }) => {
  const sizeClass = spinnerSizeClasses[size] || spinnerSizeClasses.md;

  return (
    <div
      className={`flex items-center justify-center gap-3 ${fullScreen ? "min-h-screen" : ""} ${className}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`inline-block animate-spin rounded-full border-solid border-primary/20 border-t-primary ${sizeClass}`}
        aria-hidden="true"
      />
      {label ? <span className="text-sm text-base-content/75">{label}</span> : null}
      <span className="sr-only">{label || "Loading"}</span>
    </div>
  );
};

export default Loader;