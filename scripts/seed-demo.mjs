import mysql from "mysql2/promise";

const demoCustomers = [
  {
    company_name: "Pacific Freight Warehousing",
    contact_name: "Maya Thompson",
    email: "maya@pacificfreight.demo",
    phone: "+1 310 555 0101",
    address: "1450 Harbor Blvd, Long Beach, CA 90813",
    warehouse_phone: "+1 310 555 0191",
    status: "active",
  },
  {
    company_name: "Atlas Retail Group",
    contact_name: "Jordan Miles",
    email: "jordan@atlasretail.demo",
    phone: "+1 213 555 0144",
    address: "2210 Warehouse Row, Riverside, CA 92507",
    warehouse_phone: "+1 951 555 0110",
    status: "active",
  },
  {
    company_name: "Northline Imports",
    contact_name: "Sofia Reyes",
    email: "sofia@northline.demo",
    phone: "+1 714 555 0130",
    address: "88 Commerce Park, Anaheim, CA 92806",
    warehouse_phone: "+1 714 555 0180",
    status: "active",
  },
];

const demoDrivers = [
  {
    first_name: "James",
    last_name: "Porter",
    phone: "+1 562 555 0201",
    email: "james.porter@demo.local",
    license_number: "DEMO-CDL-1001",
    truck_number: "TRK-204",
    driver_type: "company",
    status: "active",
  },
  {
    first_name: "Maria",
    last_name: "Lopez",
    phone: "+1 562 555 0202",
    email: "maria.lopez@demo.local",
    license_number: "DEMO-CDL-1002",
    truck_number: "TRK-308",
    driver_type: "owner-operator",
    status: "active",
  },
  {
    first_name: "Kevin",
    last_name: "Reed",
    phone: "+1 562 555 0203",
    email: "kevin.reed@demo.local",
    license_number: "DEMO-CDL-1003",
    truck_number: "TRK-412",
    driver_type: "company",
    status: "active",
  },
];

const demoContainers = [
  {
    customer_name: "Atlas Retail Group",
    container_number: "MSCU7654321",
    container_type: "import",
    equipment_type: "dry",
    booking_number: null,
    vessel_eta: "2026-06-24",
    size: "40FT",
    shipping_line: "Maersk",
    pickup_port: "OICT(SSA)",
    pickup_lfd: "2026-06-26",
    port_pickup_datetime: "2026-06-24 09:30:00",
    warehouse_name: "Pacific Freight Warehousing",
    scac_code: "MAEU",
    seal_number: "SEAL-8801",
    gate_code: "GT-551",
    pin_code: "PIN-2201",
    checked_in_code: "CHK-901",
    status: "available",
  },
  {
    customer_name: "Northline Imports",
    container_number: "TEMU4829103",
    container_type: "import",
    equipment_type: "fazer",
    booking_number: null,
    vessel_eta: "2026-06-25",
    size: "20FT",
    shipping_line: "Evergreen",
    pickup_port: "Everport",
    pickup_lfd: "2026-06-27",
    port_pickup_datetime: "2026-06-25 13:00:00",
    warehouse_name: "Northline Imports",
    scac_code: "EGLV",
    seal_number: "SEAL-8802",
    gate_code: "GT-552",
    pin_code: "PIN-2202",
    checked_in_code: "CHK-902",
    status: "in_transit",
  },
  {
    customer_name: "Atlas Retail Group",
    container_number: "OOLU1948302",
    container_type: "export",
    equipment_type: "dry",
    booking_number: "BK-204918",
    vessel_eta: "2026-06-28",
    size: "45FT",
    shipping_line: "OOCL",
    pickup_port: "Trapac",
    pickup_lfd: "2026-06-29",
    port_pickup_datetime: "2026-06-28 07:45:00",
    warehouse_name: "Atlas Retail Group",
    scac_code: "OOLU",
    seal_number: "SEAL-8803",
    gate_code: "GT-553",
    pin_code: "PIN-2203",
    checked_in_code: "CHK-903",
    status: "available",
  },
];

const demoDispatches = [
  {
    dispatch_number: "DEMO-DSP-1001",
    customer_name: "Atlas Retail Group",
    driver_license: "DEMO-CDL-1001",
    container_number: "MSCU7654321",
    dispatch_type: "import",
    pickup_location: "OICT(SSA)",
    pickup_address: "1100 Pier F Ave, Long Beach, CA 90802",
    pickup_date: "2026-06-24",
    pickup_time: "09:30:00",
    delivery_location: "Pacific Freight Warehousing",
    delivery_address: "1450 Harbor Blvd, Long Beach, CA 90813",
    delivery_date: "2026-06-24",
    delivery_time: "13:00:00",
    status: "assigned",
    notes: "Gate release confirmed. Driver to check in before 9:15 AM.",
  },
  {
    dispatch_number: "DEMO-DSP-1002",
    customer_name: "Northline Imports",
    driver_license: "DEMO-CDL-1002",
    container_number: "TEMU4829103",
    dispatch_type: "import",
    pickup_location: "Everport",
    pickup_address: "389 Terminal Island Way, San Pedro, CA 90731",
    pickup_date: "2026-06-25",
    pickup_time: "13:00:00",
    delivery_location: "Northline Imports",
    delivery_address: "88 Commerce Park, Anaheim, CA 92806",
    delivery_date: "2026-06-25",
    delivery_time: "16:30:00",
    status: "in_transit",
    notes: "Container already out-gated. Update ETA after freeway checkpoint.",
  },
  {
    dispatch_number: "DEMO-DSP-1003",
    customer_name: "Atlas Retail Group",
    driver_license: "DEMO-CDL-1003",
    container_number: "OOLU1948302",
    dispatch_type: "export",
    pickup_location: "Atlas Retail Group",
    pickup_address: "2210 Warehouse Row, Riverside, CA 92507",
    pickup_date: "2026-06-26",
    pickup_time: "08:00:00",
    delivery_location: "Trapac",
    delivery_address: "301 New Dock St, San Pedro, CA 90731",
    delivery_date: "2026-06-26",
    delivery_time: "12:30:00",
    status: "pending",
    notes: "Export booking verified. Confirm final seal number before gate-in.",
  },
  {
    dispatch_number: "DEMO-DSP-1004",
    customer_name: "Pacific Freight Warehousing",
    driver_license: "DEMO-CDL-1001",
    container_number: "MSCU7654321",
    dispatch_type: "delivery",
    pickup_location: "Pacific Freight Warehousing",
    pickup_address: "1450 Harbor Blvd, Long Beach, CA 90813",
    pickup_date: "2026-06-20",
    pickup_time: "07:30:00",
    delivery_location: "Atlas Retail Group",
    delivery_address: "2210 Warehouse Row, Riverside, CA 92507",
    delivery_date: "2026-06-20",
    delivery_time: "10:45:00",
    status: "completed",
    notes: "Completed demo delivery for dashboard history.",
  },
];

const demoPorts = [
  {
    code: "PRT-001",
    name: "OICT(SSA)",
    city: "Long Beach, CA",
    contact_phone: "+1 562 555 1011",
    operating_hours: "05:00 AM - 11:00 PM",
    avg_turn_time: "42 min",
    status: "Operational",
  },
  {
    code: "PRT-002",
    name: "Trapac",
    city: "San Pedro, CA",
    contact_phone: "+1 310 555 1012",
    operating_hours: "06:00 AM - 10:00 PM",
    avg_turn_time: "55 min",
    status: "High Volume",
  },
  {
    code: "PRT-003",
    name: "Everport",
    city: "Los Angeles, CA",
    contact_phone: "+1 310 555 1013",
    operating_hours: "24 Hours",
    avg_turn_time: "38 min",
    status: "Operational",
  },
];

const demoYards = [
  {
    code: "YRD-011",
    name: "Harbor Chassis Yard",
    city: "Long Beach, CA",
    capacity: "280 units",
    utilization: "78%",
    manager: "Chris Nolan",
    status: "Available",
  },
  {
    code: "YRD-012",
    name: "Gateway Storage Yard",
    city: "Compton, CA",
    capacity: "190 units",
    utilization: "91%",
    manager: "Leah Kim",
    status: "Near Capacity",
  },
  {
    code: "YRD-013",
    name: "Valley Rail Transfer Yard",
    city: "Riverside, CA",
    capacity: "340 units",
    utilization: "64%",
    manager: "Marco Diaz",
    status: "Available",
  },
];

const demoWarehouses = [
  {
    code: "WH-200",
    name: "Pacific Freight Warehousing",
    city: "Long Beach, CA",
    address: "1450 Harbor Blvd, Long Beach, CA 90813",
    docks: "18 docks",
    contact_phone: "+1 310 555 0191",
    status: "Open",
  },
  {
    code: "WH-201",
    name: "Atlas Retail Group DC",
    city: "Riverside, CA",
    address: "2210 Warehouse Row, Riverside, CA 92507",
    docks: "26 docks",
    contact_phone: "+1 951 555 0110",
    status: "Busy",
  },
  {
    code: "WH-202",
    name: "Northline Imports Hub",
    city: "Anaheim, CA",
    address: "88 Commerce Park, Anaheim, CA 92806",
    docks: "14 docks",
    contact_phone: "+1 714 555 0180",
    status: "Open",
  },
];

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1988",
    database: process.env.DB_NAME || "dispatcher",
  });

  try {
    await connection.beginTransaction();

    await connection.query(
      "DELETE FROM dispatches WHERE dispatch_number IN (?, ?, ?, ?)",
      demoDispatches.map((item) => item.dispatch_number)
    );
    await connection.query(
      "DELETE FROM containers WHERE container_number IN (?, ?, ?)",
      demoContainers.map((item) => item.container_number)
    );
    await connection.query(
      "DELETE FROM drivers WHERE license_number IN (?, ?, ?)",
      demoDrivers.map((item) => item.license_number)
    );
    await connection.query(
      "DELETE FROM customers WHERE company_name IN (?, ?, ?)",
      demoCustomers.map((item) => item.company_name)
    );
    await connection.query(
      "DELETE FROM ports WHERE code IN (?, ?, ?)",
      demoPorts.map((item) => item.code)
    );
    await connection.query(
      "DELETE FROM yards WHERE code IN (?, ?, ?)",
      demoYards.map((item) => item.code)
    );
    await connection.query(
      "DELETE FROM warehouses WHERE code IN (?, ?, ?)",
      demoWarehouses.map((item) => item.code)
    );

    for (const customer of demoCustomers) {
      await connection.execute(
        `
          INSERT INTO customers
            (company_name, contact_name, email, phone, address, warehouse_phone, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          customer.company_name,
          customer.contact_name,
          customer.email,
          customer.phone,
          customer.address,
          customer.warehouse_phone,
          customer.status,
        ]
      );
    }

    for (const driver of demoDrivers) {
      await connection.execute(
        `
          INSERT INTO drivers
            (first_name, last_name, phone, email, license_number, truck_number, driver_type, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          driver.first_name,
          driver.last_name,
          driver.phone,
          driver.email,
          driver.license_number,
          driver.truck_number,
          driver.driver_type,
          driver.status,
        ]
      );
    }

    for (const port of demoPorts) {
      await connection.execute(
        `
          INSERT INTO ports
            (code, name, city, contact_phone, operating_hours, avg_turn_time, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          port.code,
          port.name,
          port.city,
          port.contact_phone,
          port.operating_hours,
          port.avg_turn_time,
          port.status,
        ]
      );
    }

    for (const yard of demoYards) {
      await connection.execute(
        `
          INSERT INTO yards
            (code, name, city, capacity, utilization, manager, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          yard.code,
          yard.name,
          yard.city,
          yard.capacity,
          yard.utilization,
          yard.manager,
          yard.status,
        ]
      );
    }

    for (const warehouse of demoWarehouses) {
      await connection.execute(
        `
          INSERT INTO warehouses
            (code, name, city, address, docks, contact_phone, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          warehouse.code,
          warehouse.name,
          warehouse.city,
          warehouse.address,
          warehouse.docks,
          warehouse.contact_phone,
          warehouse.status,
        ]
      );
    }

    const [customerRows] = await connection.query(
      "SELECT id, company_name, address FROM customers WHERE company_name IN (?, ?, ?)",
      demoCustomers.map((item) => item.company_name)
    );
    const customerMap = new Map(customerRows.map((row) => [row.company_name, row]));

    const [driverRows] = await connection.query(
      "SELECT id, license_number FROM drivers WHERE license_number IN (?, ?, ?)",
      demoDrivers.map((item) => item.license_number)
    );
    const driverMap = new Map(driverRows.map((row) => [row.license_number, row]));

    for (const container of demoContainers) {
      const customer = customerMap.get(container.customer_name);
      const warehouse = customerMap.get(container.warehouse_name);

      await connection.execute(
        `
          INSERT INTO containers (
            customer_id,
            container_number,
            container_type,
            equipment_type,
            booking_number,
            vessel_eta,
            size,
            shipping_line,
            pickup_port,
            pickup_lfd,
            port_pickup_datetime,
            warehouse_customer_id,
            warehouse_address,
            scac_code,
            seal_number,
            gate_code,
            pin_code,
            checked_in_code,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          customer.id,
          container.container_number,
          container.container_type,
          container.equipment_type,
          container.booking_number,
          container.vessel_eta,
          container.size,
          container.shipping_line,
          container.pickup_port,
          container.pickup_lfd,
          container.port_pickup_datetime,
          warehouse.id,
          warehouse.address,
          container.scac_code,
          container.seal_number,
          container.gate_code,
          container.pin_code,
          container.checked_in_code,
          container.status,
        ]
      );
    }

    const [containerRows] = await connection.query(
      "SELECT id, container_number FROM containers WHERE container_number IN (?, ?, ?)",
      demoContainers.map((item) => item.container_number)
    );
    const containerMap = new Map(containerRows.map((row) => [row.container_number, row]));

    for (const dispatch of demoDispatches) {
      const customer = customerMap.get(dispatch.customer_name);
      const driver = driverMap.get(dispatch.driver_license);
      const container = containerMap.get(dispatch.container_number);
      const scheduledDate = `${dispatch.pickup_date} ${dispatch.pickup_time}`;

      await connection.execute(
        `
          INSERT INTO dispatches (
            dispatch_number,
            customer_id,
            driver_id,
            container_id,
            dispatch_type,
            pickup_location,
            pickup_address,
            pickup_date,
            pickup_time,
            delivery_location,
            delivery_address,
            delivery_date,
            delivery_time,
            dropoff_location,
            scheduled_date,
            status,
            notes
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          dispatch.dispatch_number,
          customer.id,
          driver.id,
          container.id,
          dispatch.dispatch_type,
          dispatch.pickup_location,
          dispatch.pickup_address,
          dispatch.pickup_date,
          dispatch.pickup_time,
          dispatch.delivery_location,
          dispatch.delivery_address,
          dispatch.delivery_date,
          dispatch.delivery_time,
          dispatch.delivery_location,
          scheduledDate,
          dispatch.status,
          dispatch.notes,
        ]
      );
    }

    await connection.commit();

    console.log("Demo data seeded successfully.");
    console.log(`Customers: ${demoCustomers.length}`);
    console.log(`Drivers: ${demoDrivers.length}`);
    console.log(`Containers: ${demoContainers.length}`);
    console.log(`Dispatches: ${demoDispatches.length}`);
    console.log(`Ports: ${demoPorts.length}`);
    console.log(`Yards: ${demoYards.length}`);
    console.log(`Warehouses: ${demoWarehouses.length}`);
  } catch (error) {
    await connection.rollback();
    console.error("Failed to seed demo data:", error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

main();
