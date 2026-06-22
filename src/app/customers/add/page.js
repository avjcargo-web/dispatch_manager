"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import AlertBanner from "@/components/ui/AlertBanner";
import FormField from "@/components/ui/FormField";
import { apiRequest } from "@/lib/client-api";

const emptyForm = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  billingAddress: "",
  warehousePhone: "",
};

export default function AddCustomerPage() {
  return (
    <Suspense fallback={<FormPageFallback title="Add Customer" description="Loading customer form..." />}>
      <CustomerFormPage />
    </Suspense>
  );
}

function CustomerFormPage() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("id");

  return <CustomerForm key={customerId ?? "new"} customerId={customerId} />;
}

function CustomerForm({ customerId }) {
  const isEditing = Boolean(customerId);

  const [form, setForm] = useState(emptyForm);
  const [initialForm, setInitialForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!customerId) {
      return;
    }

    let active = true;

    async function loadCustomer() {
      setIsLoading(true);
      setAlert(null);

      try {
        const response = await apiRequest(`/api/customers/${customerId}`);
        const record = response.data;
        const nextForm = {
          companyName: record.company_name ?? "",
          contactPerson: record.contact_name ?? "",
          email: record.email ?? "",
          phone: record.phone ?? "",
          billingAddress: record.address ?? "",
          warehousePhone: record.warehouse_phone ?? "",
        };

        if (active) {
          setForm(nextForm);
          setInitialForm(nextForm);
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

    loadCustomer();

    return () => {
      active = false;
    };
  }, [customerId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.companyName.trim()) {
      nextErrors.companyName = "Company name is required.";
    }

    if (!form.contactPerson.trim()) {
      nextErrors.contactPerson = "Contact person is required.";
    }

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleReset = () => {
    setForm(isEditing ? initialForm : emptyForm);
    setErrors({});
    setAlert(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setAlert(null);

    const payload = {
      company_name: form.companyName.trim(),
      contact_name: form.contactPerson.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.billingAddress.trim(),
      warehouse_phone: form.warehousePhone.trim(),
      status: "active",
    };

    try {
      const response = await apiRequest(isEditing ? `/api/customers/${customerId}` : "/api/customers", {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      const saved = response.data;
      const nextForm = {
        companyName: saved.company_name ?? "",
        contactPerson: saved.contact_name ?? "",
        email: saved.email ?? "",
        phone: saved.phone ?? "",
        billingAddress: saved.address ?? "",
        warehousePhone: saved.warehouse_phone ?? "",
      };

      setForm(isEditing ? nextForm : emptyForm);
      setInitialForm(nextForm);
      setErrors({});
      setAlert({
        type: "success",
        message: isEditing ? "Customer updated successfully." : "Customer saved successfully.",
      });
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit Customer" : "Add Customer"}
        description="Capture customer contact and billing information, then save it directly to the backend API."
      />

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Customer Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              {isEditing ? "Update the selected customer record." : "Create a new customer profile."}
            </p>
          </div>
          <Link
            href="/customers/list"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            View Customer List
          </Link>
        </div>

        {alert ? <div className="mb-5"><AlertBanner type={alert.type} message={alert.message} /></div> : null}

        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            Loading customer data...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Company Name"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Atlas Retail Group"
                required
                error={errors.companyName}
              />
              <FormField
                label="Contact Person"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                placeholder="Jordan Miles"
                required
                error={errors.contactPerson}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contact@example.com"
                error={errors.email}
              />
              <FormField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 555 0148"
              />
              <FormField
                label="Warehouse Phone"
                name="warehousePhone"
                value={form.warehousePhone}
                onChange={handleChange}
                placeholder="+1 555 0199"
              />
              <div className="hidden md:block" />
              <div className="md:col-span-2">
                <FormField
                  label="Billing Address"
                  name="billingAddress"
                  value={form.billingAddress}
                  onChange={handleChange}
                  placeholder="1450 Harbor Blvd, Long Beach, CA"
                  as="textarea"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isSaving ? "Saving..." : isEditing ? "Update Customer" : "Save Customer"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reset Form
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

function FormPageFallback({ title, description }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <section className="rounded-3xl bg-white p-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
        Loading...
      </section>
    </div>
  );
}
