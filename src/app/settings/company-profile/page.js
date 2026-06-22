import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import InfoGrid from "@/components/ui/InfoGrid";
import { settingsData } from "@/lib/demo-sections";

export default function CompanyProfilePage() {
  const company = settingsData.companyProfile;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Profile"
        description="Core company identity and compliance settings shown with production-style demo content."
      />
      <SectionCard title="Business Details" description="Demo company settings for the logistics organization.">
        <InfoGrid
          items={[
            { label: "Legal Name", value: company.legalName },
            { label: "DBA Name", value: company.dbaName },
            { label: "MC Number", value: company.mcNumber },
            { label: "DOT Number", value: company.dotNumber },
            { label: "Phone", value: company.phone },
            { label: "Email", value: company.email },
            { label: "Address", value: company.address },
            { label: "Timezone", value: company.timezone },
            { label: "Currency", value: company.currency },
          ]}
          columns="md:grid-cols-2 xl:grid-cols-3"
        />
      </SectionCard>
    </div>
  );
}
