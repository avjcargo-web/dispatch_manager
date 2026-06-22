"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import AlertBanner from "@/components/ui/AlertBanner";
import FormField from "@/components/ui/FormField";
import { apiRequest, formatDriverName } from "@/lib/client-api";

const emptyForm = {
  dispatchType: "import",
  customerId: "",
  driverId: "",
  containerId: "",
  pickupLocation: "",
  pickupAddress: "",
  pickupDate: "",
  pickupTime: "",
  deliveryLocation: "",
  deliveryAddress: "",
  deliveryDate: "",
  deliveryTime: "",
  status: "pending",
  notes: "",
};

export default function DispatchFormClient({ dispatchId = null }) {
  const isEditing = Boolean(dispatchId);
  const [form, setForm] = useState(emptyForm);
  const [initialForm, setInitialForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState({ customers: [], drivers: [], containers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [customersResponse, driversResponse, containersResponse, dispatchResponse] = await Promise.all([
          apiRequest("/api/customers"),
          apiRequest("/api/drivers"),
          apiRequest("/api/containers"),
          isEditing ? apiRequest(`/api/dispatches/${dispatchId}`) : Promise.resolve(null),
        ]);

        if (!active) {
          return;
        }

        setOptions({
          customers: customersResponse.data ?? [],
          drivers: driversResponse.data ?? [],
          containers: containersResponse.data ?? [],
        });

        if (dispatchResponse?.data) {
          const record = dispatchResponse.data;
          const nextForm = {
            dispatchType: record.dispatch_type ?? "import",
            customerId: record.customer_id ? String(record.customer_id) : "",
            driverId: record.driver_id ? String(record.driver_id) : "",
            containerId: record.container_id ? String(record.container_id) : "",
            pickupLocation: record.pickup_location ?? "",
            pickupAddress: record.pickup_address ?? "",
            pickupDate: record.pickup_date ? record.pickup_date.slice(0, 10) : "",
            pickupTime: record.pickup_time ? String(record.pickup_time).slice(0, 5) : "",
            deliveryLocation: record.delivery_location ?? "",
            deliveryAddress: record.delivery_address ?? "",
            deliveryDate: record.delivery_date ? record.delivery_date.slice(0, 10) : "",
            deliveryTime: record.delivery_time ? String(record.delivery_time).slice(0, 5) : "",
            status: record.status ?? "pending",
            notes: record.notes ?? "",
          };

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

    loadData();

    return () => {
      active = false;
    };
  }, [dispatchId, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const requiredFields = [
      ["dispatchType", "Dispatch type is required."],
      ["customerId", "Customer is required."],
      ["driverId", "Driver is required."],
      ["containerId", "Container is required."],
      ["pickupLocation", "Pickup location is required."],
      ["pickupAddress", "Pickup address is required."],
      ["pickupDate", "Pickup date is required."],
      ["pickupTime", "Pickup time is required."],
      ["deliveryLocation", "Delivery location is required."],
      ["deliveryAddress", "Delivery address is required."],
      ["deliveryDate", "Delivery date is required."],
      ["deliveryTime", "Delivery time is required."],
    ];

    for (const [field, message] of requiredFields) {
      if (!String(form[field] ?? "").trim()) {
        nextErrors[field] = message;
      }
    }

    if (form.pickupDate && form.deliveryDate && form.pickupDate > form.deliveryDate) {
      nextErrors.deliveryDate = "Delivery date cannot be earlier than pickup date.";
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
      dispatch_type: form.dispatchType,
      customer_id: Number(form.customerId),
      driver_id: Number(form.driverId),
      container_id: Number(form.containerId),
      pickup_location: form.pickupLocation.trim(),
      pickup_address: form.pickupAddress.trim(),
      pickup_date: form.pickupDate,
      pickup_time: form.pickupTime,
      delivery_location: form.deliveryLocation.trim(),
      delivery_address: form.deliveryAddress.trim(),
      delivery_date: form.deliveryDate,
      delivery_time: form.deliveryTime,
      status: form.status,
      notes: form.notes.trim(),
    };

    try {
      const response = await apiRequest(isEditing ? `/api/dispatches/${dispatchId}` : "/api/dispatches", {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      if (isEditing) {
        const saved = response.data;
        const nextForm = {
          dispatchType: saved.dispatch_type ?? "import",
          customerId: saved.customer_id ? String(saved.customer_id) : "",
          driverId: saved.driver_id ? String(saved.driver_id) : "",
          containerId: saved.container_id ? String(saved.container_id) : "",
          pickupLocation: saved.pickup_location ?? "",
          pickupAddress: saved.pickup_address ?? "",
          pickupDate: saved.pickup_date ? saved.pickup_date.slice(0, 10) : "",
          pickupTime: saved.pickup_time ? String(saved.pickup_time).slice(0, 5) : "",
          deliveryLocation: saved.delivery_location ?? "",
          deliveryAddress: saved.delivery_address ?? "",
          deliveryDate: saved.delivery_date ? saved.delivery_date.slice(0, 10) : "",
          deliveryTime: saved.delivery_time ? String(saved.delivery_time).slice(0, 5) : "",
          status: saved.status ?? "pending",
          notes: saved.notes ?? "",
        };

        setForm(nextForm);
        setInitialForm(nextForm);
      } else {
        setForm(emptyForm);
      }

      setErrors({});
      setAlert({
        type: "success",
        message: isEditing ? "Dispatch updated successfully." : "Dispatch created successfully.",
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
        title={isEditing ? "Edit Dispatch" : "Create Dispatch"}
        description="Create and manage live dispatch records with linked customers, drivers, and containers."
      />

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Dispatch Form</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select linked records and schedule the pickup and delivery workflow.
            </p>
          </div>
          <Link
            href="/dispatch/list"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            View Dispatch List
          </Link>
        </div>

        {alert ? <div className="mb-5"><AlertBanner type={alert.type} message={alert.message} /></div> : null}

        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            Loading customers, drivers, containers, and dispatch details...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <FormField
                label="Dispatch Type"
                name="dispatchType"
                value={form.dispatchType}
                onChange={handleChange}
                as="select"
                error={errors.dispatchType}
                options={[
                  { value: "import", label: "Import" },
                  { value: "export", label: "Export" },
                  { value: "transfer", label: "Transfer" },
                  { value: "delivery", label: "Delivery" },
                ]}
              />
              <FormField
                label="Customer"
                name="customerId"
                value={form.customerId}
                onChange={handleChange}
                as="select"
                error={errors.customerId}
                options={[
                  { value: "", label: "Select customer" },
                  ...options.customers.map((customer) => ({
                    value: String(customer.id),
                    label: customer.company_name,
                  })),
                ]}
              />
              <FormField
                label="Driver"
                name="driverId"
                value={form.driverId}
                onChange={handleChange}
                as="select"
                error={errors.driverId}
                options={[
                  { value: "", label: "Select driver" },
                  ...options.drivers.map((driver) => ({
                    value: String(driver.id),
                    label: formatDriverName(driver) || `Driver #${driver.id}`,
                  })),
                ]}
              />
              <FormField
                label="Container"
                name="containerId"
                value={form.containerId}
                onChange={handleChange}
                as="select"
                error={errors.containerId}
                options={[
                  { value: "", label: "Select container" },
                  ...options.containers.map((container) => ({
                    value: String(container.id),
                    label: `${container.container_number} (${container.container_type})`,
                  })),
                ]}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Pickup Details</h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    label="Pickup Location"
                    name="pickupLocation"
                    value={form.pickupLocation}
                    onChange={handleChange}
                    placeholder="Los Angeles Port"
                    error={errors.pickupLocation}
                  />
                  <FormField
                    label="Pickup Date"
                    name="pickupDate"
                    type="date"
                    value={form.pickupDate}
                    onChange={handleChange}
                    error={errors.pickupDate}
                  />
                  <div className="md:col-span-2">
                    <FormField
                      label="Pickup Address"
                      name="pickupAddress"
                      value={form.pickupAddress}
                      onChange={handleChange}
                      placeholder="301 Ocean Gate Ave, Long Beach, CA"
                      as="textarea"
                      rows={3}
                      error={errors.pickupAddress}
                    />
                  </div>
                  <FormField
                    label="Pickup Time"
                    name="pickupTime"
                    type="time"
                    value={form.pickupTime}
                    onChange={handleChange}
                    error={errors.pickupTime}
                  />
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Delivery Details</h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    label="Delivery Location"
                    name="deliveryLocation"
                    value={form.deliveryLocation}
                    onChange={handleChange}
                    placeholder="Riverside Warehouse"
                    error={errors.deliveryLocation}
                  />
                  <FormField
                    label="Delivery Date"
                    name="deliveryDate"
                    type="date"
                    value={form.deliveryDate}
                    onChange={handleChange}
                    error={errors.deliveryDate}
                  />
                  <div className="md:col-span-2">
                    <FormField
                      label="Delivery Address"
                      name="deliveryAddress"
                      value={form.deliveryAddress}
                      onChange={handleChange}
                      placeholder="1450 Commerce Dr, Riverside, CA"
                      as="textarea"
                      rows={3}
                      error={errors.deliveryAddress}
                    />
                  </div>
                  <FormField
                    label="Delivery Time"
                    name="deliveryTime"
                    type="time"
                    value={form.deliveryTime}
                    onChange={handleChange}
                    error={errors.deliveryTime}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                as="select"
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "assigned", label: "Assigned" },
                  { value: "in_transit", label: "In Transit" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
              <div className="md:col-span-2">
                <FormField
                  label="Notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  as="textarea"
                  rows={4}
                  placeholder="Gate instructions, customer references, delivery notes..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isSaving ? "Saving..." : isEditing ? "Update Dispatch" : "Create Dispatch"}
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
