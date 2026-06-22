"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import AlertBanner from "@/components/ui/AlertBanner";
import FormField from "@/components/ui/FormField";
import { apiRequest } from "@/lib/client-api";

const emptyForm = {
  customerId: "",
  movementType: "import",
  containerNumber: "",
  equipmentType: "dry",
  bookingNumber: "",
  vesselEta: "",
  size: "20FT",
  shippingLine: "",
  pickupPort: "OICT(SSA)",
  pickupLfd: "",
  portPickupDateTime: "",
  warehouseCustomerId: "",
  warehouseAddress: "",
  scacCode: "",
  sealNumber: "",
  gateCode: "",
  pinCode: "",
  checkedInCode: "",
  status: "available",
};

export default function AddContainerPage() {
  return (
    <Suspense fallback={<FormPageFallback title="Add Container" description="Loading container form..." />}>
      <ContainerFormPage />
    </Suspense>
  );
}

function ContainerFormPage() {
  const searchParams = useSearchParams();
  const containerId = searchParams.get("id");

  return <ContainerForm key={containerId ?? "new"} containerId={containerId} />;
}

function ContainerForm({ containerId }) {
  const isEditing = Boolean(containerId);

  const [form, setForm] = useState(emptyForm);
  const [initialForm, setInitialForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadContainer() {
      setIsLoading(true);
      setAlert(null);

      try {
        const [customersResponse, containerResponse] = await Promise.all([
          apiRequest("/api/customers"),
          containerId ? apiRequest(`/api/containers/${containerId}`) : Promise.resolve(null),
        ]);

        if (active) {
          const customerRecords = customersResponse.data ?? [];
          setCustomers(customerRecords);

          if (containerResponse?.data) {
            const record = containerResponse.data;
            const selectedWarehouse =
              customerRecords.find((customer) => customer.id === record.warehouse_customer_id) ?? null;
            const nextForm = {
              customerId: record.customer_id ? String(record.customer_id) : "",
              movementType: record.container_type ?? "import",
              containerNumber: record.container_number ?? "",
              equipmentType: record.equipment_type ?? "dry",
              bookingNumber: record.booking_number ?? "",
              vesselEta: record.vessel_eta ? String(record.vessel_eta).slice(0, 10) : "",
              size: record.size ?? "20FT",
              shippingLine: record.shipping_line ?? "",
              pickupPort: record.pickup_port ?? "OICT(SSA)",
              pickupLfd: record.pickup_lfd ? String(record.pickup_lfd).slice(0, 10) : "",
              portPickupDateTime: record.port_pickup_datetime
                ? String(record.port_pickup_datetime).replace(" ", "T").slice(0, 16)
                : "",
              warehouseCustomerId: record.warehouse_customer_id ? String(record.warehouse_customer_id) : "",
              warehouseAddress:
                record.warehouse_address ?? selectedWarehouse?.address ?? "",
              scacCode: record.scac_code ?? "",
              sealNumber: record.seal_number ?? "",
              gateCode: record.gate_code ?? "",
              pinCode: record.pin_code ?? "",
              checkedInCode: record.checked_in_code ?? "",
              status: record.status ?? "available",
            };

            setForm(nextForm);
            setInitialForm(nextForm);
          }
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

    loadContainer();

    return () => {
      active = false;
    };
  }, [containerId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      if (name === "warehouseCustomerId") {
        const selectedWarehouse = customers.find((customer) => String(customer.id) === value);

        return {
          ...current,
          warehouseCustomerId: value,
          warehouseAddress: selectedWarehouse?.address ?? "",
        };
      }

      return { ...current, [name]: value };
    });
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.customerId.trim()) {
      nextErrors.customerId = "Customer name is required.";
    }

    if (!form.movementType.trim()) {
      nextErrors.movementType = "Import/Export type is required.";
    }

    if (!form.containerNumber.trim()) {
      nextErrors.containerNumber = "Container number is required.";
    }

    if (!form.equipmentType.trim()) {
      nextErrors.equipmentType = "Dry/Fazer type is required.";
    }

    if (form.movementType === "export" && !form.bookingNumber.trim()) {
      nextErrors.bookingNumber = "Booking number is required for export containers.";
    }

    if (!form.size.trim()) {
      nextErrors.size = "Size is required.";
    }

    if (!form.pickupPort.trim()) {
      nextErrors.pickupPort = "Pick up port is required.";
    }

    if (!form.warehouseCustomerId.trim()) {
      nextErrors.warehouseCustomerId = "Warehouse name is required.";
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
      customer_id: Number(form.customerId),
      container_type: form.movementType,
      container_number: form.containerNumber.trim(),
      equipment_type: form.equipmentType,
      booking_number: form.bookingNumber.trim(),
      vessel_eta: form.vesselEta || null,
      size: form.size.trim(),
      shipping_line: form.shippingLine.trim(),
      pickup_port: form.pickupPort.trim(),
      pickup_lfd: form.pickupLfd || null,
      port_pickup_datetime: form.portPickupDateTime || null,
      warehouse_customer_id: form.warehouseCustomerId ? Number(form.warehouseCustomerId) : null,
      warehouse_address: form.warehouseAddress.trim(),
      scac_code: form.scacCode.trim(),
      seal_number: form.sealNumber.trim(),
      gate_code: form.gateCode.trim(),
      pin_code: form.pinCode.trim(),
      checked_in_code: form.checkedInCode.trim(),
      status: form.status,
    };

    try {
      const response = await apiRequest(isEditing ? `/api/containers/${containerId}` : "/api/containers", {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      const saved = response.data;
      const selectedWarehouse =
        customers.find((customer) => customer.id === saved.warehouse_customer_id) ?? null;
      const nextForm = {
        customerId: saved.customer_id ? String(saved.customer_id) : "",
        movementType: saved.container_type ?? "import",
        containerNumber: saved.container_number ?? "",
        equipmentType: saved.equipment_type ?? "dry",
        bookingNumber: saved.booking_number ?? "",
        vesselEta: saved.vessel_eta ? String(saved.vessel_eta).slice(0, 10) : "",
        size: saved.size ?? "20FT",
        shippingLine: saved.shipping_line ?? "",
        pickupPort: saved.pickup_port ?? "OICT(SSA)",
        pickupLfd: saved.pickup_lfd ? String(saved.pickup_lfd).slice(0, 10) : "",
        portPickupDateTime: saved.port_pickup_datetime
          ? String(saved.port_pickup_datetime).replace(" ", "T").slice(0, 16)
          : "",
        warehouseCustomerId: saved.warehouse_customer_id ? String(saved.warehouse_customer_id) : "",
        warehouseAddress: saved.warehouse_address ?? selectedWarehouse?.address ?? "",
        scacCode: saved.scac_code ?? "",
        sealNumber: saved.seal_number ?? "",
        gateCode: saved.gate_code ?? "",
        pinCode: saved.pin_code ?? "",
        checkedInCode: saved.checked_in_code ?? "",
        status: saved.status ?? "available",
      };

      setForm(isEditing ? nextForm : emptyForm);
      setInitialForm(nextForm);
      setErrors({});
      setAlert({
        type: "success",
        message: isEditing ? "Container updated successfully." : "Container saved successfully.",
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
        title={isEditing ? "Edit Container" : "Add Container"}
        description="Capture container movement details and connect each record directly to the backend API."
      />

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Container Details</h2>
            <p className="mt-1 text-sm text-slate-500">Save import and export container metadata.</p>
          </div>
          <Link
            href="/containers/list"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            View Container List
          </Link>
        </div>

        {alert ? <div className="mb-5"><AlertBanner type={alert.type} message={alert.message} /></div> : null}

        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            Loading container data...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                label="Customer Name"
                name="customerId"
                value={form.customerId}
                onChange={handleChange}
                as="select"
                options={[
                  { value: "", label: "Select customer" },
                  ...customers.map((customer) => ({
                    value: String(customer.id),
                    label: customer.company_name,
                  })),
                ]}
                required
                error={errors.customerId}
              />
              <FormField
                label="Container Type"
                name="movementType"
                value={form.movementType}
                onChange={handleChange}
                as="select"
                options={[
                  { value: "import", label: "Import" },
                  { value: "export", label: "Export" },
                ]}
                required
                error={errors.movementType}
              />
              <FormField
                label="Container Number"
                name="containerNumber"
                value={form.containerNumber}
                onChange={handleChange}
                placeholder="MSCU1234567"
                required
                error={errors.containerNumber}
              />
              <FormField
                label="Container Type: Dry / Fazer"
                name="equipmentType"
                value={form.equipmentType}
                onChange={handleChange}
                as="select"
                options={[
                  { value: "dry", label: "Dry" },
                  { value: "fazer", label: "Fazer" },
                ]}
                required
                error={errors.equipmentType}
              />
              <FormField
                label="Booking Number"
                name="bookingNumber"
                value={form.bookingNumber}
                onChange={handleChange}
                placeholder="BK-204918"
                error={errors.bookingNumber}
              />
              <FormField
                label="Vessel ETA"
                name="vesselEta"
                type="date"
                value={form.vesselEta}
                onChange={handleChange}
              />
              <FormField
                label="Container Size"
                name="size"
                value={form.size}
                onChange={handleChange}
                as="select"
                options={[
                  { value: "20FT", label: "20 FT" },
                  { value: "40FT", label: "40 FT" },
                  { value: "45FT", label: "45 FT" },
                ]}
                required
                error={errors.size}
              />
              <FormField
                label="Shipping Line"
                name="shippingLine"
                value={form.shippingLine}
                onChange={handleChange}
                placeholder="Maersk"
              />
              <FormField
                label="Pick Up Port"
                name="pickupPort"
                value={form.pickupPort}
                onChange={handleChange}
                as="select"
                options={[
                  { value: "OICT(SSA)", label: "OICT(SSA)" },
                  { value: "Trapac", label: "Trapac" },
                  { value: "Everport", label: "Everport" },
                ]}
                required
                error={errors.pickupPort}
              />
              <FormField
                label="Pick Up LFD"
                name="pickupLfd"
                type="date"
                value={form.pickupLfd}
                onChange={handleChange}
              />
              <FormField
                label="Pick Up Date & Time From Port"
                name="portPickupDateTime"
                type="datetime-local"
                value={form.portPickupDateTime}
                onChange={handleChange}
              />
              <FormField
                label="Warehouse Name"
                name="warehouseCustomerId"
                value={form.warehouseCustomerId}
                onChange={handleChange}
                as="select"
                options={[
                  { value: "", label: "Select warehouse customer" },
                  ...customers.map((customer) => ({
                    value: String(customer.id),
                    label: customer.company_name,
                  })),
                ]}
                required
                error={errors.warehouseCustomerId}
              />
              <div className="xl:col-span-2">
                <FormField
                  label="Warehouse Address"
                  name="warehouseAddress"
                  value={form.warehouseAddress}
                  onChange={handleChange}
                  as="textarea"
                  rows={3}
                  readOnly
                  placeholder="Warehouse address will appear after selection"
                />
              </div>
              <FormField
                label="Gate Code"
                name="gateCode"
                value={form.gateCode}
                onChange={handleChange}
                placeholder="GT-881"
              />
              <FormField
                label="Pin"
                name="pinCode"
                value={form.pinCode}
                onChange={handleChange}
                placeholder="PIN-1145"
              />
              <FormField
                label="Seal Number"
                name="sealNumber"
                value={form.sealNumber}
                onChange={handleChange}
                placeholder="SL-4018"
              />
              <FormField
                label="Checked In Code"
                name="checkedInCode"
                value={form.checkedInCode}
                onChange={handleChange}
                placeholder="CHK-92"
              />
              <FormField
                label="SCAC ID"
                name="scacCode"
                value={form.scacCode}
                onChange={handleChange}
                placeholder="MAEU"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isSaving ? "Saving..." : isEditing ? "Update Container" : "Save Container"}
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
