import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";
import MetricPill from "@/components/ui/MetricPill";
import { reportsData } from "@/lib/demo-sections";

export default function ProfitLossPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profit & Loss"
        description="Demo operating profit view with line-level income and expense categories."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reportsData.profitLoss.summary.map((item) => (
          <MetricPill key={item.label} {...item} />
        ))}
      </div>
      <SectionCard title="P&L Breakdown" description="Demo monthly profit and loss detail by category.">
        <DataTable
          columns={[
            { key: "category", label: "Category" },
            { key: "type", label: "Type", render: (value) => value.toUpperCase() },
            { key: "amount", label: "Amount" },
          ]}
          rows={reportsData.profitLoss.lines}
        />
      </SectionCard>
    </div>
  );
}
