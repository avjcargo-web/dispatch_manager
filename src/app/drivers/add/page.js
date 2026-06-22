"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import AlertBanner from "@/components/ui/AlertBanner";
import FormField from "@/components/ui/FormField";
import { apiRequest, formatDriverName, splitDriverName } from "@/lib/client-api";

const emptyForm = {
  driverName: "",
  phone: "",
  email: "",
  licenseNumber: "",
  driverType: "company",
  truckNumber: "",
  status: "active",
};

export default function AddDriverPage() {
  return (
    <Suspense fallback={<FormPageFallback title="Add Driver" description="Loading driver form..." />}>
      <DriverFormPage />
    </Suspense>
  );
}

function DriverFormPage() {
  const searchParams = useSearchParams();
  const driverId = searchParams.get("id");

  return <DriverForm key={driverId ?? "new"} driverId={driverId} />;
}

function DriverForm({ driverId }) {
  const isEditing = Boolean(driverId);

  const [form, setForm] = useState(emptyForm);
  const [initialForm, setInitialForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!driverId) {
      return;
    }

    let active = true;

    async function loadDriver() {
      setIsLoading(true);
      setAlert(null);

      try {
        const response = await apiRequest(`/api/drivers/${driverId}`);
        const record = response.data;
        const nextForm = {
          driverName: formatDriverName(record),
          phone: record.phone ?? "",
          email: record.email ?? "",
          licenseNumber: record.license_number ?? "",
          driverType: record.driver_type ?? "company",
          truckNumber: record.truck_number ?? "",
          status: record.status ?? "active",
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

    loadDriver();

    return () => {
      active = false;
    };
  }, [driverId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.driverName.trim()) {
      nextErrors.driverName = "Driver name is required.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone is required.";
    }

    if (!form.licenseNumber.trim()) {
      nextErrors.licenseNumber = "License number is required.";
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

    const nameParts = splitDriverName(form.driverName);
    const payload = {
      ...nameParts,
      phone: form.phone.trim(),
      email: form.email.trim(),
      license_number: form.licenseNumber.trim(),
      driver_type: form.driverType,
      truck_number: form.truckNumber.trim(),
      status: form.status,
    };

    try {
      const response = await apiRequest(isEditing ? `/api/drivers/${driverId}` : "/api/drivers", {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      const saved = response.data;
      const nextForm = {
        driverName: formatDriverName(saved),
        phone: saved.phone ?? "",
        email: saved.email ?? "",
        licenseNumber: saved.license_number ?? "",
        driverType: saved.driver_type ?? "company",
        truckNumber: saved.truck_number ?? "",
        status: saved.status ?? "active",
      };

      setForm(isEditing ? nextForm : emptyForm);
      setInitialForm(nextForm);
      setErrors({});
      setAlert({
        type: "success",
        message: isEditing ? "Driver updated successfully." : "Driver saved successfully.",
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
        title={isEditing ? "Edit Driver" : "Add Driver"}
        description="Create or update driver records and send them straight to the backend API with built-in validation."
      />

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Driver Profile</h2>
            <p className="mt-1 text-sm text-slate-500">Save driver, truck, and availability details.</p>
          </div>
          <Link
            href="/drivers/list"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            View Driver List
          </Link>
        </div>

        {alert ? <div className="mb-5"><AlertBanner type={alert.type} message={alert.message} /></div> : null}

        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            Loading driver data...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Driver Name"
                name="driverName"
                value={form.driverName}
                onChange={handleChange}
                placeholder="James Porter"
                required
                error={errors.driverName}
              />
              <FormField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 555 0172"
                required
                error={errors.phone}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="driver@example.com"
                error={errors.email}
              />
              <FormField
                label="License Number"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="CDL-482993"
                required
                error={errors.licenseNumber}
              />
              <FormField
                label="Driver Type"
                name="driverType"
                value={form.driverType}
                onChange={handleChange}
                as="select"
                options={[
                  { value: "company", label: "Company Driver" },
                  { value: "owner-operator", label: "Owner Operator" },
                ]}
              />
              <FormField
                label="Truck Number"
                name="truckNumber"
                value={form.truckNumber}
                onChange={handleChange}
                placeholder="TRK-204"
              />
              <FormField
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                as="select"
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isSaving ? "Saving..." : isEditing ? "Update Driver" : "Save Driver"}
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
