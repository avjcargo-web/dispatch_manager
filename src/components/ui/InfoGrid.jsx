export default function InfoGrid({ items, columns = "md:grid-cols-2" }) {
  return (
    <div className={`grid gap-4 ${columns}`}>
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
