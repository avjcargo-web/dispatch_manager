import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";
import { locationData } from "@/lib/demo-sections";

export default function CustomerLocationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Locations"
        description="Named delivery and staging points attached to customers for fast dispatch selection."
      />
      <SectionCard title="Customer Location Map" description="Demo customer locations used across pickup and delivery planning.">
        <DataTable
          columns={[
            { key: "customer", label: "Customer" },
            { key: "location", label: "Location" },
            { key: "address", label: "Address" },
            { key: "type", label: "Type" },
            { key: "contact", label: "Contact" },
            { key: "phone", label: "Phone" },
          ]}
          rows={locationData.customerLocations}
        />
      </SectionCard>
    </div>
  );
}
