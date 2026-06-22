import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";
import MetricPill from "@/components/ui/MetricPill";
import { billingData } from "@/lib/demo-sections";

export default function InvoiceListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoice List"
        description="Monitor invoice status, due dates, and collection progress across active customer accounts."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {billingData.paymentSummary.map((item) => (
          <MetricPill key={item.label} {...item} />
        ))}
      </div>
      <SectionCard title="Invoice Register" description="Demo invoice tracking list for current customer billing.">
        <DataTable
          columns={[
            { key: "invoice", label: "Invoice" },
            { key: "customer", label: "Customer" },
            { key: "dispatch", label: "Dispatch" },
            { key: "amount", label: "Amount" },
            { key: "dueDate", label: "Due Date" },
            { key: "status", label: "Status" },
          ]}
          rows={billingData.invoices}
        />
      </SectionCard>
    </div>
  );
}
