import { FileCheck2 } from "lucide-react";
import PageHeader from "./PageHeader";

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />

      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                This page is ready for form/table development.
              </p>
            </div>
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Placeholder Ready
          </div>
        </div>
      </section>
    </div>
  );
}
