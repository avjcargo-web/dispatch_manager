import {
  BarChart3,
  Box,
  LayoutDashboard,
  MapPinned,
  ReceiptText,
  Settings2,
  Truck,
  UserRound,
  Users,
} from "lucide-react";

export const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Dispatch",
    icon: Truck,
    items: [
      { label: "Create Dispatch", href: "/dispatch/create" },
      { label: "Dispatch List", href: "/dispatch/list" },
      { label: "Live Tracking", href: "/dispatch/tracking" },
    ],
  },
  {
    label: "Containers",
    icon: Box,
    items: [
      { label: "Add Container", href: "/containers/add" },
      { label: "Import Containers", href: "/containers/import" },
      { label: "Export Containers", href: "/containers/export" },
      { label: "Container List", href: "/containers/list" },
    ],
  },
  {
    label: "Customers",
    icon: Users,
    items: [
      { label: "Add Customer", href: "/customers/add" },
      { label: "Customer List", href: "/customers/list" },
    ],
  },
  {
    label: "Drivers",
    icon: UserRound,
    items: [
      { label: "Add Driver", href: "/drivers/add" },
      { label: "Driver List", href: "/drivers/list" },
      { label: "Owner Operators", href: "/drivers/owner-operators" },
    ],
  },
  {
    label: "Locations",
    icon: MapPinned,
    items: [
      { label: "Add Port", href: "/locations/ports/add" },
      { label: "Port List", href: "/locations/ports" },
      { label: "Add Yard", href: "/locations/yards/add" },
      { label: "Yard List", href: "/locations/yards" },
      { label: "Add Warehouse", href: "/locations/warehouses/add" },
      { label: "Warehouse List", href: "/locations/warehouses" },
      { label: "Customer Locations", href: "/locations/customer-locations" },
    ],
  },
  {
    label: "Billing",
    icon: ReceiptText,
    items: [
      { label: "Create Invoice", href: "/billing/create-invoice" },
      { label: "Invoice List", href: "/billing/invoice-list" },
      { label: "Payments", href: "/billing/payments" },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    items: [
      { label: "Monthly Report", href: "/reports/monthly" },
      { label: "Driver Report", href: "/reports/drivers" },
      { label: "Customer Report", href: "/reports/customers" },
      { label: "Profit & Loss", href: "/reports/profit-loss" },
    ],
  },
  {
    label: "Settings",
    icon: Settings2,
    items: [
      { label: "Company Profile", href: "/settings/company-profile" },
      { label: "Users & Roles", href: "/settings/users-roles" },
      { label: "System Settings", href: "/settings/system-settings" },
    ],
  },
];

export function getPageByPath(pathname) {
  for (const entry of navigation) {
    if (entry.href === pathname) {
      return entry;
    }

    if (entry.items) {
      const match = entry.items.find((item) => item.href === pathname);

      if (match) {
        return match;
      }
    }
  }

  return null;
}
