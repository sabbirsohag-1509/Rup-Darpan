import { Link } from "react-router";

const SectionHeader = ({ title, description, actionLabel, actionTo }) => {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-playfair text-2xl font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-base-content/70">{description}</p>}
      </div>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-outline btn-primary btn-sm rounded-xl">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
