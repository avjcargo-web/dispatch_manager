"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import AlertBanner from "@/components/ui/AlertBanner";
import FormField from "@/components/ui/FormField";
import { apiRequest } from "@/lib/client-api";
import { buildEmptyLocationForm, locationModules } from "@/lib/location-modules";

export default function LocationFormClient({ entityKey, recordId = null }) {
  const config = locationModules[entityKey];
  const isEditing = Boolean(recordId);
  const blankForm = buildEmptyLocationForm(entityKey);

  const [form, setForm] = useState(blankForm);
  const [initialForm, setInitialForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!recordId) {
      return;
    }

    let active = true;

    async function loadRecord() {
      setIsLoading(true);
      setAlert(null);

      try {
        const response = await apiRequest(`${config.endpoint}/${recordId}`);

        if (!active) {
          return;
        }

        const nextForm = config.fields.reduce((accumulator, field) => {
          accumulator[field.name] = response.data[field.name] ?? "";
          return accumulator;
        }, {});

        setForm(nextForm);
        setInitialForm(nextForm);
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

    loadRecord();

    return () => {
      active = false;
    };
  }, [config.endpoint, config.fields, recordId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    for (const field of config.fields) {
      if (field.required && !String(form[field.name] ?? "").trim()) {
        nextErrors[field.name] = `${field.label} is required.`;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleReset = () => {
    setForm(isEditing ? initialForm : blankForm);
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

    const payload = Object.fromEntries(
      config.fields.map((field) => [field.name, String(form[field.name] ?? "").trim()])
    );

    try {
      const response = await apiRequest(isEditing ? `${config.endpoint}/${recordId}` : config.endpoint, {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      const nextForm = config.fields.reduce((accumulator, field) => {
        accumulator[field.name] = response.data[field.name] ?? "";
        return accumulator;
      }, {});

      setForm(isEditing ? nextForm : blankForm);
      setInitialForm(nextForm);
      setErrors({});
      setAlert({
        type: "success",
        message: isEditing
          ? `${config.singular} updated successfully.`
          : `${config.singular} created successfully.`,
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
        title={isEditing ? `Edit ${config.singular}` : config.addTitle}
        description={config.description}
      />

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{config.addTitle}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {isEditing ? `Update the selected ${config.singular.toLowerCase()} record.` : `Create a new ${config.singular.toLowerCase()} record.`}
            </p>
          </div>
          <Link
            href={config.listPath}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            View {config.listTitle}
          </Link>
        </div>

        {alert ? <div className="mb-5"><AlertBanner type={alert.type} message={alert.message} /></div> : null}

        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            Loading {config.singular.toLowerCase()} data...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {config.fields.map((field) => (
                <div key={field.name} className={field.as === "textarea" ? "xl:col-span-2" : ""}>
                  <FormField
                    label={field.label}
                    name={field.name}
                    value={form[field.name] ?? ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    error={errors[field.name]}
                    as={field.as ?? "input"}
                    rows={field.rows}
                    options={field.options ?? []}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isSaving ? "Saving..." : isEditing ? `Update ${config.singular}` : `Save ${config.singular}`}
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
