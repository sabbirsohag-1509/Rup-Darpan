import { Link } from "react-router";

const EmptyState = ({ icon: Icon, title, description, actionText, actionTo }) => {
  return (
    <div className="rounded-2xl border border-primary/15 bg-base-100 p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-playfair text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-base-content/70">{description}</p>
      {actionText && actionTo && (
        <Link to={actionTo} className="btn btn-primary mt-5 text-primary-content">
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
