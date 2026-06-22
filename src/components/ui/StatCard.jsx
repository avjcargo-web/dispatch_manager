const toneClasses = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    accent: "text-blue-600",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600",
    accent: "text-orange-600",
  },
  yellow: {
    icon: "bg-yellow-50 text-yellow-600",
    accent: "text-yellow-600",
  },
  green: {
    icon: "bg-green-50 text-green-600",
    accent: "text-green-600",
  },
  slate: {
    icon: "bg-slate-100 text-slate-700",
    accent: "text-slate-700",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    accent: "text-emerald-600",
  },
};

export default function StatCard({ title, value, subtitle, icon: Icon, tone = "blue" }) {
  const palette = toneClasses[tone] ?? toneClasses.blue;

  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</h2>
        </div>
        <div className={`rounded-2xl p-3 ${palette.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className={`mt-4 text-sm font-medium ${palette.accent}`}>{subtitle}</p>
    </article>
  );
}
