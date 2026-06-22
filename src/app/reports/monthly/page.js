import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";
import MetricPill from "@/components/ui/MetricPill";
import { reportsData } from "@/lib/demo-sections";

export default function MonthlyReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Monthly Report"
        description="Monthly operations and finance snapshot with demo trend data for the last six months."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reportsData.monthlyStats.map((item) => (
          <MetricPill key={item.label} label={item.label} value={item.value} tone="blue" />
        ))}
      </div>
      <SectionCard title="Monthly Performance" description="Demo revenue, margin, and on-time trends over time.">
        <DataTable
          columns={[
            { key: "month", label: "Month" },
            { key: "dispatches", label: "Dispatches" },
            { key: "revenue", label: "Revenue" },
            { key: "margin", label: "Margin" },
            { key: "onTime", label: "On-Time" },
          ]}
          rows={reportsData.monthlyPerformance}
        />
      </SectionCard>
    </div>
  );
}
