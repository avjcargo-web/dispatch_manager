export default function DataTable({ columns, rows, emptyMessage = "No data available." }) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
            {columns.map((column) => (
              <th key={column.key} className="pb-3 pr-4 font-medium last:pr-0">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <tr key={row.id ?? row.code ?? row.name ?? row.invoice ?? row.customer ?? index} className="align-top">
              {columns.map((column) => (
                <td key={column.key} className="py-4 pr-4 text-slate-600 last:pr-0">
                  {column.render ? column.render(row[column.key], row) : row[column.key] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
