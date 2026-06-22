import {
  Boxes,
  CheckCircle2,
  CircleAlert,
  Truck,
  UserRound,
  Users,
} from "lucide-react";
import DispatchStatusBadge from "@/components/dispatch/DispatchStatusBadge";
import AlertBanner from "@/components/ui/AlertBanner";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { getDashboardOverview } from "@/lib/dashboard-data";
import { getMissingDatabaseEnvVars, isDatabaseConfigured } from "@/lib/db";

const statusBarClasses = {
  available: "bg-blue-600",
  in_transit: "bg-orange-500",
  delivered: "bg-green-500",
  maintenance: "bg-red-500",
};

const emptyOverview = {
  stats: {
    totalCustomers: 0,
    totalDrivers: 0,
    totalContainers: 0,
    totalDispatches: 0,
    pendingDispatches: 0,
    completedDispatches: 0,
  },
  recentDispatches: [],
  containerStatusSummary: [],
  driverActivitySummary: [],
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const missingDbVars = getMissingDatabaseEnvVars();
  const databaseConfigured = isDatabaseConfigured();

  let overview = emptyOverview;
  let dashboardErrorMessage = null;

  if (databaseConfigured) {
    try {
      overview = await getDashboardOverview();
    } catch (error) {
      console.error("Dashboard page data error:", error);
      dashboardErrorMessage = "The dashboard could not load live database data right now.";
    }
  } else {
    dashboardErrorMessage = `Add these Vercel environment variables to enable live dashboard data: ${missingDbVars.join(", ")}.`;
  }

  const stats = [
    {
      title: "Total Customers",
      value: String(overview.stats.totalCustomers),
      subtitle: "Customer accounts in the system",
      icon: Users,
      tone: "blue",
    },
    {
      title: "Total Drivers",
      value: String(overview.stats.totalDrivers),
      subtitle: "Drivers ready for dispatch planning",
      icon: UserRound,
      tone: "slate",
    },
    {
      title: "Total Containers",
      value: String(overview.stats.totalContainers),
      subtitle: "Tracked container records",
      icon: Boxes,
      tone: "orange",
    },
    {
      title: "Total Dispatches",
      value: String(overview.stats.totalDispatches),
      subtitle: "Dispatches created across operations",
      icon: Truck,
      tone: "blue",
    },
    {
      title: "Pending Dispatches",
      value: String(overview.stats.pendingDispatches),
      subtitle: "Dispatches awaiting completion",
      icon: CircleAlert,
      tone: "yellow",
    },
    {
      title: "Completed Dispatches",
      value: String(overview.stats.completedDispatches),
      subtitle: "Dispatches completed successfully",
      icon: CheckCircle2,
      tone: "green",
    },
  ];

  const maxContainerValue = Math.max(
    ...overview.containerStatusSummary.map((item) => Number(item.value) || 0),
    1
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Monitor live dispatch counts, recent movements, and fleet activity directly from MySQL-backed operations data."
      />

      {dashboardErrorMessage ? (
        <AlertBanner
          type="info"
          message={
            databaseConfigured
              ? dashboardErrorMessage
              : `Dashboard preview mode is active. ${dashboardErrorMessage}`
          }
        />
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Dispatches</h2>
              <p className="text-sm text-slate-500">The latest dispatch records created in the system.</p>
            </div>
            <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:block">
              Live MySQL data
            </div>
          </div>

          {overview.recentDispatches.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
              No dispatches yet. Create one from the dispatch module to populate the dashboard.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                    <th className="pb-3 font-medium">Dispatch ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Driver</th>
                    <th className="pb-3 font-medium">Container</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {overview.recentDispatches.map((dispatch) => (
                    <tr key={dispatch.dispatchId} className="align-top">
                      <td className="py-4 pr-4 font-semibold text-slate-900">{dispatch.dispatchId}</td>
                      <td className="py-4 pr-4 text-slate-700">{dispatch.customer}</td>
                      <td className="py-4 pr-4 text-slate-600">{dispatch.driver}</td>
                      <td className="py-4 pr-4 text-slate-600">{dispatch.container}</td>
                      <td className="py-4">
                        <DispatchStatusBadge status={dispatch.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Container Status Summary</h2>
            <p className="mt-1 text-sm text-slate-500">Current container volume grouped by status.</p>

            {overview.containerStatusSummary.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                No containers available yet.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {overview.containerStatusSummary.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium capitalize text-slate-700">{item.label}</span>
                      <span className="font-semibold text-slate-900">{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full ${statusBarClasses[item.label.replaceAll(" ", "_")] ?? "bg-slate-500"}`}
                        style={{ width: `${Math.max((Number(item.value) / maxContainerValue) * 100, 14)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Driver Activity Summary</h2>
            <p className="mt-1 text-sm text-slate-500">Top drivers ranked by dispatch workload and completions.</p>

            {overview.driverActivitySummary.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                No driver activity yet.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {overview.driverActivitySummary.map((driver) => (
                  <div key={`${driver.name}-${driver.totalDispatches}`} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{driver.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {driver.totalDispatches} total dispatches, {driver.completedDispatches} completed
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {driver.lastUpdate ? "Active" : "No Jobs"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
