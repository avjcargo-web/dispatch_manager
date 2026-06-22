const statusClasses = {
  pending: "bg-amber-50 text-amber-700 ring-amber-100",
  assigned: "bg-blue-50 text-blue-700 ring-blue-100",
  in_transit: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  completed: "bg-green-50 text-green-700 ring-green-100",
  cancelled: "bg-red-50 text-red-700 ring-red-100",
};

export default function DispatchStatusBadge({ status }) {
  const className = statusClasses[status] ?? "bg-slate-100 text-slate-700 ring-slate-200";
  const label = status ? status.replaceAll("_", " ") : "unknown";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${className}`}>
      {label}
    </span>
  );
}
