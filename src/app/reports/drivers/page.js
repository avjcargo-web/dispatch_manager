import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";
import { reportsData } from "@/lib/demo-sections";

export default function DriverReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Report"
        description="Driver productivity and completed-job performance using current demo operating data."
      />
      <SectionCard title="Driver Performance" description="Demo report ranking drivers by utilization, completions, and revenue handled.">
        <DataTable
          columns={[
            { key: "driver", label: "Driver" },
            { key: "dispatches", label: "Dispatches" },
            { key: "completed", label: "Completed" },
            { key: "utilization", label: "Utilization" },
            { key: "revenue", label: "Revenue" },
          ]}
          rows={reportsData.driverReport}
        />
      </SectionCard>
    </div>
  );
}
