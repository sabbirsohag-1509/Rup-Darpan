import { Link } from "react-router";

const QuickActionCard = ({ to, title, description, icon: Icon }) => {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-base-content/70">{description}</p>
    </Link>
  );
};

export default QuickActionCard;
