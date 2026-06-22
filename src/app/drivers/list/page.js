"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import AlertBanner from "@/components/ui/AlertBanner";
import { apiRequest, formatDriverName } from "@/lib/client-api";

export default function DriverListPage() {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadDrivers() {
      try {
        const response = await apiRequest("/api/drivers");

        if (active) {
          setDrivers(response.data ?? []);
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

    loadDrivers();

    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this driver?");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setAlert(null);

    try {
      await apiRequest(`/api/drivers/${id}`, { method: "DELETE" });
      setDrivers((current) => current.filter((driver) => driver.id !== id));
      setAlert({ type: "success", message: "Driver deleted successfully." });
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver List"
        description="Review driver roster details, truck assignments, and update operational status from one table."
      />

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Saved Drivers</h2>
            <p className="mt-1 text-sm text-slate-500">Driver data served directly from the API.</p>
          </div>
          <Link
            href="/drivers/add"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add Driver
          </Link>
        </div>

        {alert ? <div className="mb-5"><AlertBanner type={alert.type} message={alert.message} /></div> : null}

        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            Loading drivers...
          </div>
        ) : drivers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center">
            <p className="text-sm text-slate-500">No drivers found yet. Add the first driver to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                  <th className="pb-3 font-medium">Driver Name</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Driver Type</th>
                  <th className="pb-3 font-medium">Truck Number</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {drivers.map((driver) => (
                  <tr key={driver.id} className="align-top">
                    <td className="py-4 pr-4 font-semibold text-slate-900">{formatDriverName(driver) || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{driver.phone || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">
                      {driver.driver_type === "owner-operator" ? "Owner Operator" : "Company Driver"}
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{driver.truck_number || "-"}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          driver.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {driver.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/drivers/add?id=${driver.id}`}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(driver.id)}
                          disabled={deletingId === driver.id}
                          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === driver.id ? "Deleting..." : "Delete"}
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
