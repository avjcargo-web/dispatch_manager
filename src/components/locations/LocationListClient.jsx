"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import AlertBanner from "@/components/ui/AlertBanner";
import { apiRequest } from "@/lib/client-api";
import { locationModules } from "@/lib/location-modules";

export default function LocationListClient({ entityKey }) {
  const config = locationModules[entityKey];
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadRecords() {
      try {
        const response = await apiRequest(config.endpoint);

        if (active) {
          setRecords(response.data ?? []);
        }
      } catch (error) {
        if (active) {
          setAlert({ type: "error", message: error.message });
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadRecords();

    return () => {
      active = false;
    };
  }, [config.endpoint]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(`Delete this ${config.singular.toLowerCase()}?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setAlert(null);

    try {
      await apiRequest(`${config.endpoint}/${id}`, { method: "DELETE" });
      setRecords((current) => current.filter((record) => record.id !== id));
      setAlert({ type: "success", message: `${config.singular} deleted successfully.` });
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={config.listTitle} description={config.description} />

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{config.plural} Directory</h2>
            <p className="mt-1 text-sm text-slate-500">Manage saved {config.plural.toLowerCase()} records from the local API.</p>
          </div>
          <Link
            href={config.addPath}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {config.addTitle}
          </Link>
        </div>

        {alert ? <div className="mb-5"><AlertBanner type={alert.type} message={alert.message} /></div> : null}

        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            Loading {config.plural.toLowerCase()}...
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
            {config.emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                  {config.columns.map((column) => (
                    <th key={column.key} className="pb-3 pr-4 font-medium last:pr-0">
                      {column.label}
                    </th>
                  ))}
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr key={record.id} className="align-top">
                    {config.columns.map((column) => (
                      <td key={column.key} className="py-4 pr-4 text-slate-600 last:pr-0">
                        {record[column.key] || "-"}
                      </td>
                    ))}
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`${config.addPath}?id=${record.id}`}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(record.id)}
                          disabled={deletingId === record.id}
                          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === record.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
