const StatCard = ({ icon: Icon, label, value, description }) => {
  return (
    <div className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-base-content/70">{description}</p>
    </div>
  );
};

export default StatCard;
