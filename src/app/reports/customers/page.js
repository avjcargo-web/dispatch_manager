import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";
import { reportsData } from "@/lib/demo-sections";

export default function CustomerReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Report"
        description="Customer volume, billing totals, and account trends using demo reporting records."
      />
      <SectionCard title="Customer Revenue Report" description="Demo report showing customer contribution and outstanding balance.">
        <DataTable
          columns={[
            { key: "customer", label: "Customer" },
            { key: "dispatches", label: "Dispatches" },
            { key: "invoices", label: "Invoices" },
            { key: "balance", label: "Balance" },
            { key: "trend", label: "Trend" },
          ]}
          rows={reportsData.customerReport}
        />
      </SectionCard>
    </div>
  );
}
