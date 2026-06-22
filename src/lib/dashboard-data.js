import { query } from "@/lib/db";

export async function getDashboardStats() {
  const [
    customerCountRows,
    driverCountRows,
    containerCountRows,
    dispatchCountRows,
    pendingCountRows,
    completedCountRows,
  ] = await Promise.all([
    query("SELECT COUNT(*) AS totalCustomers FROM customers"),
    query("SELECT COUNT(*) AS totalDrivers FROM drivers"),
    query("SELECT COUNT(*) AS totalContainers FROM containers"),
    query("SELECT COUNT(*) AS totalDispatches FROM dispatches"),
    query("SELECT COUNT(*) AS pendingDispatches FROM dispatches WHERE status IN ('pending', 'assigned')"),
    query("SELECT COUNT(*) AS completedDispatches FROM dispatches WHERE status = 'completed'"),
  ]);

  return {
    totalCustomers: customerCountRows[0]?.totalCustomers ?? 0,
    totalDrivers: driverCountRows[0]?.totalDrivers ?? 0,
    totalContainers: containerCountRows[0]?.totalContainers ?? 0,
    totalDispatches: dispatchCountRows[0]?.totalDispatches ?? 0,
    pendingDispatches: pendingCountRows[0]?.pendingDispatches ?? 0,
    completedDispatches: completedCountRows[0]?.completedDispatches ?? 0,
  };
}

export async function getDashboardOverview() {
  const [stats, recentDispatchesRows, containerStatusRows, driverActivityRows] = await Promise.all([
    getDashboardStats(),
    query(
      `
        SELECT
          d.dispatch_number,
          c.company_name AS customer_name,
          dr.first_name AS driver_first_name,
          dr.last_name AS driver_last_name,
          ct.container_number,
          d.status
        FROM dispatches d
        LEFT JOIN customers c ON c.id = d.customer_id
        LEFT JOIN drivers dr ON dr.id = d.driver_id
        LEFT JOIN containers ct ON ct.id = d.container_id
        ORDER BY d.created_at DESC, d.id DESC
        LIMIT 6
      `
    ),
    query(
      `
        SELECT status, COUNT(*) AS total
        FROM containers
        GROUP BY status
        ORDER BY total DESC
      `
    ),
    query(
      `
        SELECT
          dr.id,
          dr.first_name,
          dr.last_name,
          COUNT(d.id) AS total_dispatches,
          SUM(CASE WHEN d.status = 'completed' THEN 1 ELSE 0 END) AS completed_dispatches,
          MAX(d.updated_at) AS last_update
        FROM drivers dr
        LEFT JOIN dispatches d ON d.driver_id = dr.id
        GROUP BY dr.id, dr.first_name, dr.last_name
        ORDER BY total_dispatches DESC, completed_dispatches DESC, dr.first_name ASC
        LIMIT 5
      `
    ),
  ]);

  const recentDispatches = recentDispatchesRows.map((row) => ({
    dispatchId: row.dispatch_number,
    customer: row.customer_name || "-",
    driver: `${row.driver_first_name ?? ""} ${row.driver_last_name ?? ""}`.trim() || "-",
    container: row.container_number || "-",
    status: row.status,
  }));

  const containerStatusSummary = containerStatusRows.map((row) => ({
    label: row.status.replaceAll("_", " "),
    value: row.total,
  }));

  const driverActivitySummary = driverActivityRows.map((row) => ({
    name: `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() || "Unassigned",
    totalDispatches: row.total_dispatches ?? 0,
    completedDispatches: row.completed_dispatches ?? 0,
    lastUpdate: row.last_update,
  }));

  return {
    stats,
    recentDispatches,
    containerStatusSummary,
    driverActivitySummary,
  };
}
