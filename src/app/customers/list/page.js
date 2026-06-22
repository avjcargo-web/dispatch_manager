"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import AlertBanner from "@/components/ui/AlertBanner";
import { apiRequest } from "@/lib/client-api";

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadCustomers() {
      try {
        const response = await apiRequest("/api/customers");

        if (active) {
          setCustomers(response.data ?? []);
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

    loadCustomers();

    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this customer?");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setAlert(null);

    try {
      await apiRequest(`/api/customers/${id}`, { method: "DELETE" });
      setCustomers((current) => current.filter((customer) => customer.id !== id));
      setAlert({ type: "success", message: "Customer deleted successfully." });
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer List"
        description="Manage saved customer accounts, review contact details, and update records as operations evolve."
      />

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Saved Customers</h2>
            <p className="mt-1 text-sm text-slate-500">All customer records from the MySQL-backed API.</p>
          </div>
          <Link
            href="/customers/add"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add Customer
          </Link>
        </div>

        {alert ? <div className="mb-5"><AlertBanner type={alert.type} message={alert.message} /></div> : null}

        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center">
            <p className="text-sm text-slate-500">No customers found yet. Add the first one to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                  <th className="pb-3 font-medium">Company Name</th>
                  <th className="pb-3 font-medium">Contact Person</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Billing Address</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="align-top">
                    <td className="py-4 pr-4 font-semibold text-slate-900">{customer.company_name}</td>
                    <td className="py-4 pr-4 text-slate-600">{customer.contact_name || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{customer.email || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{customer.phone || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{customer.address || "-"}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/customers/add?id=${customer.id}`}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(customer.id)}
                          disabled={deletingId === customer.id}
                          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === customer.id ? "Deleting..." : "Delete"}
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
