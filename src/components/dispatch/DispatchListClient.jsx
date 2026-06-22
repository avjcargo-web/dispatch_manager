"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import AlertBanner from "@/components/ui/AlertBanner";
import DispatchStatusBadge from "@/components/dispatch/DispatchStatusBadge";
import { apiRequest } from "@/lib/client-api";

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-700">{value || "-"}</p>
    </div>
  );
}

export default function DispatchListClient() {
  const [dispatches, setDispatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadDispatches() {
      try {
        const response = await apiRequest("/api/dispatches");

        if (active) {
          setDispatches(response.data ?? []);
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

    loadDispatches();

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this dispatch?");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setAlert(null);

    try {
      await apiRequest(`/api/dispatches/${id}`, { method: "DELETE" });
      setDispatches((current) => current.filter((dispatch) => dispatch.id !== id));
      if (selectedDispatch?.id === id) {
        setSelectedDispatch(null);
      }
      setAlert({ type: "success", message: "Dispatch deleted successfully." });
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = async (id) => {
    setIsViewing(true);
    setAlert(null);

    try {
      const response = await apiRequest(`/api/dispatches/${id}`);
      setSelectedDispatch(response.data);
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setIsViewing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispatch List"
        description="Review all scheduled dispatches, inspect record details, and keep daily movement plans up to date."
      />

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Dispatch Records</h2>
            <p className="mt-1 text-sm text-slate-500">Live dispatch data stored in MySQL and served through the API.</p>
          </div>
          <Link
            href="/dispatch/create"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Create Dispatch
          </Link>
        </div>

        {alert ? <div className="mb-5"><AlertBanner type={alert.type} message={alert.message} /></div> : null}

        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            Loading dispatches...
          </div>
        ) : dispatches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center">
            <p className="text-sm text-slate-500">No dispatches found yet. Create the first dispatch to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                  <th className="pb-3 font-medium">Dispatch ID</th>
                  <th className="pb-3 font-medium">Dispatch Type</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Driver</th>
                  <th className="pb-3 font-medium">Container</th>
                  <th className="pb-3 font-medium">Pickup Location</th>
                  <th className="pb-3 font-medium">Delivery Location</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dispatches.map((dispatch) => (
                  <tr key={dispatch.id} className="align-top">
                    <td className="py-4 pr-4 font-semibold text-slate-900">{dispatch.dispatch_number}</td>
                    <td className="py-4 pr-4 capitalize text-slate-600">{dispatch.dispatch_type || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{dispatch.customer_name || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{dispatch.driver_name || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{dispatch.container_number || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{dispatch.pickup_location || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{dispatch.delivery_location || "-"}</td>
                    <td className="py-4 pr-4">
                      <DispatchStatusBadge status={dispatch.status} />
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleView(dispatch.id)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          View
                        </button>
                        <Link
                          href={`/dispatch/create?id=${dispatch.id}`}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(dispatch.id)}
                          disabled={deletingId === dispatch.id}
                          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === dispatch.id ? "Deleting..." : "Delete"}
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

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Dispatch Details</h2>
            <p className="mt-1 text-sm text-slate-500">Use View to inspect a full dispatch record.</p>
          </div>
          {isViewing ? <span className="text-sm font-medium text-slate-500">Loading...</span> : null}
        </div>

        {!selectedDispatch ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
            Select a dispatch to view its details.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-3xl bg-slate-50 p-5">
              <DetailRow label="Dispatch ID" value={selectedDispatch.dispatch_number} />
              <DetailRow label="Dispatch Type" value={selectedDispatch.dispatch_type} />
              <DetailRow label="Customer" value={selectedDispatch.customer_name} />
              <DetailRow label="Driver" value={selectedDispatch.driver_name} />
              <DetailRow label="Container" value={selectedDispatch.container_number} />
              <DetailRow label="Status" value={selectedDispatch.status?.replaceAll("_", " ")} />
            </div>
            <div className="space-y-4 rounded-3xl bg-slate-50 p-5">
              <DetailRow label="Pickup Location" value={selectedDispatch.pickup_location} />
              <DetailRow label="Pickup Address" value={selectedDispatch.pickup_address} />
              <DetailRow
                label="Pickup Schedule"
                value={`${selectedDispatch.pickup_date?.slice(0, 10) || "-"} ${String(selectedDispatch.pickup_time || "").slice(0, 5)}`}
              />
              <DetailRow label="Delivery Location" value={selectedDispatch.delivery_location} />
              <DetailRow label="Delivery Address" value={selectedDispatch.delivery_address} />
              <DetailRow
                label="Delivery Schedule"
                value={`${selectedDispatch.delivery_date?.slice(0, 10) || "-"} ${String(selectedDispatch.delivery_time || "").slice(0, 5)}`}
              />
              <DetailRow label="Notes" value={selectedDispatch.notes} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
