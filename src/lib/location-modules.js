export const locationModules = {
  ports: {
    entityKey: "ports",
    singular: "Port",
    plural: "Ports",
    endpoint: "/api/ports",
    addPath: "/locations/ports/add",
    listPath: "/locations/ports",
    title: "Ports",
    addTitle: "Add Port",
    listTitle: "Port List",
    description: "Create and manage port terminal records used in dispatch and container pickup workflows.",
    emptyMessage: "No ports found yet. Add the first port to get started.",
    fields: [
      { name: "code", label: "Port Code", placeholder: "PRT-001", required: true },
      { name: "name", label: "Port Name", placeholder: "OICT(SSA)", required: true },
      { name: "city", label: "City", placeholder: "Long Beach, CA", required: true },
      { name: "contact_phone", label: "Contact Phone", placeholder: "+1 562 555 1011" },
      { name: "operating_hours", label: "Operating Hours", placeholder: "05:00 AM - 11:00 PM" },
      { name: "avg_turn_time", label: "Average Turn Time", placeholder: "42 min" },
      {
        name: "status",
        label: "Status",
        as: "select",
        required: true,
        options: [
          { value: "Operational", label: "Operational" },
          { value: "High Volume", label: "High Volume" },
          { value: "Maintenance", label: "Maintenance" },
        ],
      },
    ],
    columns: [
      { key: "code", label: "Code" },
      { key: "name", label: "Port Name" },
      { key: "city", label: "City" },
      { key: "contact_phone", label: "Contact" },
      { key: "operating_hours", label: "Hours" },
      { key: "avg_turn_time", label: "Avg Turn" },
      { key: "status", label: "Status" },
    ],
  },
  yards: {
    entityKey: "yards",
    singular: "Yard",
    plural: "Yards",
    endpoint: "/api/yards",
    addPath: "/locations/yards/add",
    listPath: "/locations/yards",
    title: "Yards",
    addTitle: "Add Yard",
    listTitle: "Yard List",
    description: "Create and track storage yard records, staging capacity, and yard-level operational status.",
    emptyMessage: "No yards found yet. Add the first yard to get started.",
    fields: [
      { name: "code", label: "Yard Code", placeholder: "YRD-011", required: true },
      { name: "name", label: "Yard Name", placeholder: "Harbor Chassis Yard", required: true },
      { name: "city", label: "City", placeholder: "Long Beach, CA", required: true },
      { name: "capacity", label: "Capacity", placeholder: "280 units" },
      { name: "utilization", label: "Utilization", placeholder: "78%" },
      { name: "manager", label: "Manager", placeholder: "Chris Nolan" },
      {
        name: "status",
        label: "Status",
        as: "select",
        required: true,
        options: [
          { value: "Available", label: "Available" },
          { value: "Near Capacity", label: "Near Capacity" },
          { value: "Restricted", label: "Restricted" },
        ],
      },
    ],
    columns: [
      { key: "code", label: "Code" },
      { key: "name", label: "Yard Name" },
      { key: "city", label: "City" },
      { key: "capacity", label: "Capacity" },
      { key: "utilization", label: "Utilization" },
      { key: "manager", label: "Manager" },
      { key: "status", label: "Status" },
    ],
  },
  warehouses: {
    entityKey: "warehouses",
    singular: "Warehouse",
    plural: "Warehouses",
    endpoint: "/api/warehouses",
    addPath: "/locations/warehouses/add",
    listPath: "/locations/warehouses",
    title: "Warehouses",
    addTitle: "Add Warehouse",
    listTitle: "Warehouse List",
    description: "Create warehouse records for delivery, staging, and receiving operations.",
    emptyMessage: "No warehouses found yet. Add the first warehouse to get started.",
    fields: [
      { name: "code", label: "Warehouse Code", placeholder: "WH-200", required: true },
      { name: "name", label: "Warehouse Name", placeholder: "Pacific Freight Warehousing", required: true },
      { name: "city", label: "City", placeholder: "Long Beach, CA", required: true },
      {
        name: "address",
        label: "Address",
        placeholder: "1450 Harbor Blvd, Long Beach, CA 90813",
        required: true,
        as: "textarea",
        rows: 3,
      },
      { name: "docks", label: "Docks", placeholder: "18 docks" },
      { name: "contact_phone", label: "Contact Phone", placeholder: "+1 310 555 0191" },
      {
        name: "status",
        label: "Status",
        as: "select",
        required: true,
        options: [
          { value: "Open", label: "Open" },
          { value: "Busy", label: "Busy" },
          { value: "Closed", label: "Closed" },
        ],
      },
    ],
    columns: [
      { key: "code", label: "Code" },
      { key: "name", label: "Warehouse Name" },
      { key: "city", label: "City" },
      { key: "address", label: "Address" },
      { key: "docks", label: "Docks" },
      { key: "contact_phone", label: "Contact" },
      { key: "status", label: "Status" },
    ],
  },
};

export function buildEmptyLocationForm(entityKey) {
  const config = locationModules[entityKey];

  return config.fields.reduce((accumulator, field) => {
    if (field.as === "select" && field.options?.length) {
      accumulator[field.name] = field.options[0].value;
      return accumulator;
    }

    accumulator[field.name] = "";
    return accumulator;
  }, {});
}
