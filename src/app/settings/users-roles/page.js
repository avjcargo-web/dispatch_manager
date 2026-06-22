import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";
import { settingsData } from "@/lib/demo-sections";

export default function UsersRolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Roles"
        description="User access overview and role definition screens using realistic demo administration data."
      />
      <SectionCard title="System Users" description="Demo user directory and access state.">
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "status", label: "Status" },
            { key: "lastLogin", label: "Last Login" },
          ]}
          rows={settingsData.users}
        />
      </SectionCard>
      <SectionCard title="Role Permissions" description="Demo access policies for each application role.">
        <DataTable
          columns={[
            { key: "role", label: "Role" },
            { key: "permissions", label: "Permissions" },
          ]}
          rows={settingsData.rolePermissions}
        />
      </SectionCard>
    </div>
  );
}
