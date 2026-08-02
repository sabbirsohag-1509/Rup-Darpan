const statusClassMap = {
  confirmed: "border-success/30 bg-success/10 text-success",
  pending: "border-warning/30 bg-warning/10 text-warning",
  completed: "border-info/30 bg-info/10 text-info",
  cancelled: "border-error/30 bg-error/10 text-error",
  paid: "border-success/30 bg-success/10 text-success",
  unpaid: "border-warning/30 bg-warning/10 text-warning",
};

const BookingStatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();
  const badgeClass =
    statusClassMap[normalizedStatus] ||
    "border-base-content/20 bg-base-200 text-base-content/80";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${badgeClass}`}
    >
      {status}
    </span>
  );
};

export default BookingStatusBadge;
