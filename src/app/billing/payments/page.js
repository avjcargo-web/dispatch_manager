import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";
import { billingData } from "@/lib/demo-sections";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Track received payments, remittance methods, and deposit status using demo finance records."
      />
      <SectionCard title="Payment Activity" description="Demo payment application history for invoices in the billing section.">
        <DataTable
          columns={[
            { key: "paymentId", label: "Payment ID" },
            { key: "customer", label: "Customer" },
            { key: "invoice", label: "Invoice" },
            { key: "method", label: "Method" },
            { key: "amount", label: "Amount" },
            { key: "receivedOn", label: "Received On" },
            { key: "status", label: "Status" },
          ]}
          rows={billingData.payments}
        />
      </SectionCard>
    </div>
  );
}
