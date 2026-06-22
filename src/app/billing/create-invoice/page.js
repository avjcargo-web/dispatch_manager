import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";
import InfoGrid from "@/components/ui/InfoGrid";
import { billingData } from "@/lib/demo-sections";

export default function CreateInvoicePage() {
  const invoice = billingData.draftInvoice;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Invoice"
        description="Draft billing records for completed dispatch work using realistic demo billing data."
      />
      <SectionCard title="Invoice Draft" description="Demo invoice layout for a completed/export dispatch.">
        <InfoGrid
          items={[
            { label: "Invoice Number", value: invoice.invoiceNumber },
            { label: "Bill To", value: invoice.billTo },
            { label: "Bill To Address", value: invoice.billToAddress },
            { label: "Issue Date", value: invoice.issueDate },
            { label: "Due Date", value: invoice.dueDate },
            { label: "Dispatch Reference", value: invoice.dispatchRef },
            { label: "Status", value: invoice.status },
          ]}
        />
        <div className="mt-6">
          <DataTable
            columns={[
              { key: "description", label: "Description" },
              { key: "quantity", label: "Qty" },
              { key: "rate", label: "Rate" },
              { key: "amount", label: "Amount" },
            ]}
            rows={invoice.lineItems}
          />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Subtotal</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{invoice.subtotal}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Tax</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{invoice.tax}</p>
          </div>
          <div className="rounded-2xl bg-blue-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Total</p>
            <p className="mt-2 text-lg font-semibold text-blue-700">{invoice.total}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
