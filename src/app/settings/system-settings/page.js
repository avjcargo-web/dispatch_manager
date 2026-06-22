import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";
import { settingsData } from "@/lib/demo-sections";

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Operational defaults, notification controls, and security preferences in demo form."
      />
      <SectionCard title="Configuration Registry" description="Demo system-level settings for dispatch, billing, and security behavior.">
        <DataTable
          columns={[
            { key: "section", label: "Section" },
            { key: "setting", label: "Setting" },
            { key: "value", label: "Value" },
          ]}
          rows={settingsData.systemSettings}
        />
      </SectionCard>
    </div>
  );
}
