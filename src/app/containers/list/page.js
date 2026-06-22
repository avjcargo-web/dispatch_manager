"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import AlertBanner from "@/components/ui/AlertBanner";
import { apiRequest } from "@/lib/client-api";

export default function ContainerListPage() {
  const [containers, setContainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadContainers() {
      try {
        const response = await apiRequest("/api/containers");

        if (active) {
          setContainers(response.data ?? []);
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

    loadContainers();

    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this container?");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setAlert(null);

    try {
      await apiRequest(`/api/containers/${id}`, { method: "DELETE" });
      setContainers((current) => current.filter((container) => container.id !== id));
      setAlert({ type: "success", message: "Container deleted successfully." });
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Container List"
        description="Track saved container records, shipment metadata, and update operational details as needed."
      />

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Saved Containers</h2>
            <p className="mt-1 text-sm text-slate-500">Container records coming from the API.</p>
          </div>
          <Link
            href="/containers/add"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add Container
          </Link>
        </div>

        {alert ? <div className="mb-5"><AlertBanner type={alert.type} message={alert.message} /></div> : null}

        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            Loading containers...
          </div>
        ) : containers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center">
            <p className="text-sm text-slate-500">No containers found yet. Add the first record to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Container Number</th>
                  <th className="pb-3 font-medium">Booking Number</th>
                  <th className="pb-3 font-medium">Size</th>
                  <th className="pb-3 font-medium">Shipping Line</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {containers.map((container) => (
                  <tr key={container.id} className="align-top">
                    <td className="py-4 pr-4 font-semibold capitalize text-slate-900">
                      {container.container_type || "-"}
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{container.container_number || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{container.booking_number || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{container.size || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{container.shipping_line || "-"}</td>
                    <td className="py-4 pr-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {container.status?.replaceAll("_", " ") || "-"}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/containers/add?id=${container.id}`}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(container.id)}
                          disabled={deletingId === container.id}
                          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === container.id ? "Deleting..." : "Delete"}
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
