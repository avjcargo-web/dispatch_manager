import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

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
  {
    company_name: "Harbor Fresh Logistics",
    contact_name: "Derrick Cole",
    email: "derrick@harborfresh.demo",
    phone: "+1 562 555 0168",
    address: "410 Seaside Produce Way, Wilmington, CA 90744",
    warehouse_phone: "+1 562 555 0172",
    status: "active",
  },
  {
    company_name: "Summit Appliance Distribution",
    contact_name: "Priya Nair",
    email: "priya@summitappliance.demo",
    phone: "+1 909 555 0195",
    address: "725 Meridian Loop, Fontana, CA 92335",
    warehouse_phone: "+1 909 555 0177",
    status: "active",
  },
  {
    company_name: "BluePeak Manufacturing",
    contact_name: "Evan Brooks",
    email: "evan@bluepeak.demo",
    phone: "+1 951 555 0231",
    address: "980 Industry Parkway, Moreno Valley, CA 92551",
    warehouse_phone: "+1 951 555 0240",
    status: "active",
  },
  {
    company_name: "Redwood Commerce Imports",
    contact_name: "Tina Alvarez",
    email: "tina@redwoodcommerce.demo",
    phone: "+1 626 555 0188",
    address: "55 Canyon Trade Center, City of Industry, CA 91748",
    warehouse_phone: "+1 626 555 0189",
    status: "inactive",
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
  {
    first_name: "Daniel",
    last_name: "Brooks",
    phone: "+1 562 555 0204",
    email: "daniel.brooks@demo.local",
    license_number: "DEMO-CDL-1004",
    truck_number: "TRK-517",
    driver_type: "company",
    status: "active",
  },
  {
    first_name: "Aisha",
    last_name: "Khan",
    phone: "+1 562 555 0205",
    email: "aisha.khan@demo.local",
    license_number: "DEMO-CDL-1005",
    truck_number: "TRK-623",
    driver_type: "owner-operator",
    status: "active",
  },
  {
    first_name: "Victor",
    last_name: "Chen",
    phone: "+1 562 555 0206",
    email: "victor.chen@demo.local",
    license_number: "DEMO-CDL-1006",
    truck_number: "TRK-731",
    driver_type: "company",
    status: "inactive",
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
  {
    code: "PRT-004",
    name: "APM Terminals Pier 400",
    city: "Los Angeles, CA",
    contact_phone: "+1 310 555 1014",
    operating_hours: "05:00 AM - 01:00 AM",
    avg_turn_time: "48 min",
    status: "Operational",
  },
  {
    code: "PRT-005",
    name: "Yusen Terminal",
    city: "San Pedro, CA",
    contact_phone: "+1 310 555 1015",
    operating_hours: "06:00 AM - 11:00 PM",
    avg_turn_time: "51 min",
    status: "Gate Delays",
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
  {
    code: "YRD-014",
    name: "Inland Empire Staging Yard",
    city: "Fontana, CA",
    capacity: "420 units",
    utilization: "57%",
    manager: "Alicia Romero",
    status: "Available",
  },
  {
    code: "YRD-015",
    name: "South Bay Empty Depot",
    city: "Carson, CA",
    capacity: "245 units",
    utilization: "83%",
    manager: "Noah Patel",
    status: "Busy",
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
  {
    code: "WH-203",
    name: "Harbor Fresh Cold Storage",
    city: "Wilmington, CA",
    address: "410 Seaside Produce Way, Wilmington, CA 90744",
    docks: "12 docks",
    contact_phone: "+1 562 555 0172",
    status: "Open",
  },
  {
    code: "WH-204",
    name: "Summit Appliance Fulfillment",
    city: "Fontana, CA",
    address: "725 Meridian Loop, Fontana, CA 92335",
    docks: "22 docks",
    contact_phone: "+1 909 555 0177",
    status: "High Throughput",
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
    current_location: "OICT(SSA)",
  },
  {
    customer_name: "Northline Imports",
    container_number: "TEMU4829103",
    container_type: "import",
    equipment_type: "reefer",
    booking_number: null,
    vessel_eta: "2026-06-23",
    size: "20FT",
    shipping_line: "Evergreen",
    pickup_port: "Everport",
    pickup_lfd: "2026-06-25",
    port_pickup_datetime: "2026-06-23 13:00:00",
    warehouse_name: "Northline Imports",
    scac_code: "EGLV",
    seal_number: "SEAL-8802",
    gate_code: "GT-552",
    pin_code: "PIN-2202",
    checked_in_code: "CHK-902",
    status: "in_transit",
    current_location: "I-710 Corridor",
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
    port_pickup_datetime: "2026-06-26 07:45:00",
    warehouse_name: "Atlas Retail Group",
    scac_code: "OOLU",
    seal_number: "SEAL-8803",
    gate_code: "GT-553",
    pin_code: "PIN-2203",
    checked_in_code: "CHK-903",
    status: "available",
    current_location: "Atlas Retail Group DC",
  },
  {
    customer_name: "Pacific Freight Warehousing",
    container_number: "CMAU5512098",
    container_type: "delivery",
    equipment_type: "dry",
    booking_number: null,
    vessel_eta: "2026-06-18",
    size: "40FT",
    shipping_line: "CMA CGM",
    pickup_port: "APM Terminals Pier 400",
    pickup_lfd: "2026-06-19",
    port_pickup_datetime: "2026-06-18 08:10:00",
    warehouse_name: "Pacific Freight Warehousing",
    scac_code: "CMDU",
    seal_number: "SEAL-8804",
    gate_code: "GT-554",
    pin_code: "PIN-2204",
    checked_in_code: "CHK-904",
    status: "delivered",
    current_location: "Pacific Freight Warehousing",
  },
  {
    customer_name: "Harbor Fresh Logistics",
    container_number: "HLCU8451207",
    container_type: "export",
    equipment_type: "reefer",
    booking_number: "BK-778144",
    vessel_eta: "2026-06-27",
    size: "40FT HC",
    shipping_line: "Hapag-Lloyd",
    pickup_port: "Yusen Terminal",
    pickup_lfd: "2026-06-28",
    port_pickup_datetime: "2026-06-25 06:30:00",
    warehouse_name: "Harbor Fresh Logistics",
    scac_code: "HLCU",
    seal_number: "SEAL-8805",
    gate_code: "GT-555",
    pin_code: "PIN-2205",
    checked_in_code: "CHK-905",
    status: "available",
    current_location: "Harbor Fresh Cold Storage",
  },
  {
    customer_name: "Summit Appliance Distribution",
    container_number: "FCIU3301945",
    container_type: "import",
    equipment_type: "dry",
    booking_number: null,
    vessel_eta: "2026-06-22",
    size: "40FT",
    shipping_line: "COSCO",
    pickup_port: "Trapac",
    pickup_lfd: "2026-06-24",
    port_pickup_datetime: "2026-06-22 11:15:00",
    warehouse_name: "Summit Appliance Distribution",
    scac_code: "COSU",
    seal_number: "SEAL-8806",
    gate_code: "GT-556",
    pin_code: "PIN-2206",
    checked_in_code: "CHK-906",
    status: "maintenance",
    current_location: "Gateway Storage Yard",
  },
  {
    customer_name: "Harbor Fresh Logistics",
    container_number: "TRHU6612044",
    container_type: "import",
    equipment_type: "reefer",
    booking_number: null,
    vessel_eta: "2026-06-19",
    size: "20FT",
    shipping_line: "Textainer",
    pickup_port: "OICT(SSA)",
    pickup_lfd: "2026-06-20",
    port_pickup_datetime: "2026-06-19 05:50:00",
    warehouse_name: "Harbor Fresh Logistics",
    scac_code: "TGHU",
    seal_number: "SEAL-8807",
    gate_code: "GT-557",
    pin_code: "PIN-2207",
    checked_in_code: "CHK-907",
    status: "delivered",
    current_location: "Harbor Fresh Cold Storage",
  },
  {
    customer_name: "BluePeak Manufacturing",
    container_number: "MSKU4102290",
    container_type: "export",
    equipment_type: "flat rack",
    booking_number: "BK-903144",
    vessel_eta: "2026-06-30",
    size: "40FT",
    shipping_line: "MSC",
    pickup_port: "APM Terminals Pier 400",
    pickup_lfd: "2026-07-01",
    port_pickup_datetime: "2026-06-27 14:30:00",
    warehouse_name: "BluePeak Manufacturing",
    scac_code: "MSCU",
    seal_number: "SEAL-8808",
    gate_code: "GT-558",
    pin_code: "PIN-2208",
    checked_in_code: "CHK-908",
    status: "available",
    current_location: "BluePeak Manufacturing",
  },
  {
    customer_name: "Summit Appliance Distribution",
    container_number: "BEAU9301457",
    container_type: "import",
    equipment_type: "dry",
    booking_number: null,
    vessel_eta: "2026-06-24",
    size: "53FT",
    shipping_line: "ONE",
    pickup_port: "Everport",
    pickup_lfd: "2026-06-26",
    port_pickup_datetime: "2026-06-24 15:45:00",
    warehouse_name: "Summit Appliance Distribution",
    scac_code: "ONEY",
    seal_number: "SEAL-8809",
    gate_code: "GT-559",
    pin_code: "PIN-2209",
    checked_in_code: "CHK-909",
    status: "in_transit",
    current_location: "SR-60 Eastbound",
  },
  {
    customer_name: "Pacific Freight Warehousing",
    container_number: "SUDU7724501",
    container_type: "delivery",
    equipment_type: "dry",
    booking_number: null,
    vessel_eta: "2026-06-17",
    size: "40FT",
    shipping_line: "Hamburg Sud",
    pickup_port: "Yusen Terminal",
    pickup_lfd: "2026-06-18",
    port_pickup_datetime: "2026-06-17 07:20:00",
    warehouse_name: "Pacific Freight Warehousing",
    scac_code: "SUDU",
    seal_number: "SEAL-8810",
    gate_code: "GT-560",
    pin_code: "PIN-2210",
    checked_in_code: "CHK-910",
    status: "delivered",
    current_location: "Atlas Retail Group DC",
  },
  {
    customer_name: "Atlas Retail Group",
    container_number: "ZCSU2811046",
    container_type: "import",
    equipment_type: "dry",
    booking_number: null,
    vessel_eta: "2026-06-25",
    size: "40FT HC",
    shipping_line: "ZIM",
    pickup_port: "OICT(SSA)",
    pickup_lfd: "2026-06-27",
    port_pickup_datetime: "2026-06-25 10:00:00",
    warehouse_name: "Atlas Retail Group",
    scac_code: "ZIMU",
    seal_number: "SEAL-8811",
    gate_code: "GT-561",
    pin_code: "PIN-2211",
    checked_in_code: "CHK-911",
    status: "available",
    current_location: "OICT(SSA)",
  },
  {
    customer_name: "Northline Imports",
    container_number: "CSLU9024418",
    container_type: "export",
    equipment_type: "dry",
    booking_number: "BK-630214",
    vessel_eta: "2026-06-29",
    size: "40FT",
    shipping_line: "CSAV",
    pickup_port: "Trapac",
    pickup_lfd: "2026-06-30",
    port_pickup_datetime: "2026-06-28 09:20:00",
    warehouse_name: "Northline Imports",
    scac_code: "CSAV",
    seal_number: "SEAL-8812",
    gate_code: "GT-562",
    pin_code: "PIN-2212",
    checked_in_code: "CHK-912",
    status: "available",
    current_location: "Northline Imports Hub",
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
    pickup_date: "2026-06-23",
    pickup_time: "13:00:00",
    delivery_location: "Northline Imports",
    delivery_address: "88 Commerce Park, Anaheim, CA 92806",
    delivery_date: "2026-06-23",
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
    driver_license: "DEMO-CDL-1004",
    container_number: "CMAU5512098",
    dispatch_type: "delivery",
    pickup_location: "APM Terminals Pier 400",
    pickup_address: "2500 Navy Way, San Pedro, CA 90731",
    pickup_date: "2026-06-18",
    pickup_time: "08:10:00",
    delivery_location: "Pacific Freight Warehousing",
    delivery_address: "1450 Harbor Blvd, Long Beach, CA 90813",
    delivery_date: "2026-06-18",
    delivery_time: "11:40:00",
    status: "completed",
    notes: "Completed demo delivery for invoice and dashboard history.",
  },
  {
    dispatch_number: "DEMO-DSP-1005",
    customer_name: "Harbor Fresh Logistics",
    driver_license: "DEMO-CDL-1005",
    container_number: "HLCU8451207",
    dispatch_type: "export",
    pickup_location: "Harbor Fresh Cold Storage",
    pickup_address: "410 Seaside Produce Way, Wilmington, CA 90744",
    pickup_date: "2026-06-25",
    pickup_time: "06:30:00",
    delivery_location: "Yusen Terminal",
    delivery_address: "701 New Dock St, San Pedro, CA 90731",
    delivery_date: "2026-06-25",
    delivery_time: "10:15:00",
    status: "assigned",
    notes: "Reefer pre-trip completed. Keep temperature log attached to BOL.",
  },
  {
    dispatch_number: "DEMO-DSP-1006",
    customer_name: "Summit Appliance Distribution",
    driver_license: "DEMO-CDL-1004",
    container_number: "FCIU3301945",
    dispatch_type: "import",
    pickup_location: "Trapac",
    pickup_address: "301 New Dock St, San Pedro, CA 90731",
    pickup_date: "2026-06-22",
    pickup_time: "11:15:00",
    delivery_location: "Gateway Storage Yard",
    delivery_address: "1900 Wilmington Ave, Compton, CA 90220",
    delivery_date: "2026-06-22",
    delivery_time: "14:45:00",
    status: "cancelled",
    notes: "Cancelled after tire issue on chassis inspection. Container moved to maintenance hold.",
  },
  {
    dispatch_number: "DEMO-DSP-1007",
    customer_name: "Harbor Fresh Logistics",
    driver_license: "DEMO-CDL-1001",
    container_number: "TRHU6612044",
    dispatch_type: "import",
    pickup_location: "OICT(SSA)",
    pickup_address: "1100 Pier F Ave, Long Beach, CA 90802",
    pickup_date: "2026-06-19",
    pickup_time: "05:50:00",
    delivery_location: "Harbor Fresh Cold Storage",
    delivery_address: "410 Seaside Produce Way, Wilmington, CA 90744",
    delivery_date: "2026-06-19",
    delivery_time: "09:05:00",
    status: "completed",
    notes: "Cold chain received without exception. POD uploaded.",
  },
  {
    dispatch_number: "DEMO-DSP-1008",
    customer_name: "BluePeak Manufacturing",
    driver_license: "DEMO-CDL-1003",
    container_number: "MSKU4102290",
    dispatch_type: "export",
    pickup_location: "BluePeak Manufacturing",
    pickup_address: "980 Industry Parkway, Moreno Valley, CA 92551",
    pickup_date: "2026-06-27",
    pickup_time: "14:30:00",
    delivery_location: "APM Terminals Pier 400",
    delivery_address: "2500 Navy Way, San Pedro, CA 90731",
    delivery_date: "2026-06-27",
    delivery_time: "18:30:00",
    status: "pending",
    notes: "High-value machinery load. Security seal verification required before release.",
  },
  {
    dispatch_number: "DEMO-DSP-1009",
    customer_name: "Summit Appliance Distribution",
    driver_license: "DEMO-CDL-1002",
    container_number: "BEAU9301457",
    dispatch_type: "import",
    pickup_location: "Everport",
    pickup_address: "389 Terminal Island Way, San Pedro, CA 90731",
    pickup_date: "2026-06-24",
    pickup_time: "15:45:00",
    delivery_location: "Summit Appliance Fulfillment",
    delivery_address: "725 Meridian Loop, Fontana, CA 92335",
    delivery_date: "2026-06-24",
    delivery_time: "20:10:00",
    status: "in_transit",
    notes: "Driver requested after-hours dock confirmation before final arrival call.",
  },
  {
    dispatch_number: "DEMO-DSP-1010",
    customer_name: "Pacific Freight Warehousing",
    driver_license: "DEMO-CDL-1005",
    container_number: "SUDU7724501",
    dispatch_type: "delivery",
    pickup_location: "Pacific Freight Warehousing",
    pickup_address: "1450 Harbor Blvd, Long Beach, CA 90813",
    pickup_date: "2026-06-17",
    pickup_time: "07:15:00",
    delivery_location: "Atlas Retail Group",
    delivery_address: "2210 Warehouse Row, Riverside, CA 92507",
    delivery_date: "2026-06-17",
    delivery_time: "10:55:00",
    status: "completed",
    notes: "Outbound transfer completed with signed proof of delivery.",
  },
  {
    dispatch_number: "DEMO-DSP-1011",
    customer_name: "Atlas Retail Group",
    driver_license: "DEMO-CDL-1004",
    container_number: "ZCSU2811046",
    dispatch_type: "import",
    pickup_location: "OICT(SSA)",
    pickup_address: "1100 Pier F Ave, Long Beach, CA 90802",
    pickup_date: "2026-06-25",
    pickup_time: "10:00:00",
    delivery_location: "Atlas Retail Group DC",
    delivery_address: "2210 Warehouse Row, Riverside, CA 92507",
    delivery_date: "2026-06-25",
    delivery_time: "13:50:00",
    status: "assigned",
    notes: "Twin-container program. Coordinate dock 14 with receiving lead.",
  },
  {
    dispatch_number: "DEMO-DSP-1012",
    customer_name: "Northline Imports",
    driver_license: "DEMO-CDL-1002",
    container_number: "CSLU9024418",
    dispatch_type: "export",
    pickup_location: "Northline Imports Hub",
    pickup_address: "88 Commerce Park, Anaheim, CA 92806",
    pickup_date: "2026-06-28",
    pickup_time: "09:20:00",
    delivery_location: "Trapac",
    delivery_address: "301 New Dock St, San Pedro, CA 90731",
    delivery_date: "2026-06-28",
    delivery_time: "12:40:00",
    status: "pending",
    notes: "Booking cutoff is tight. Confirm appointment slot the night before.",
  },
];

function parseEnvFile(contents) {
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function loadLocalEnv() {
  for (const fileName of [".env.local", ".env"]) {
    const filePath = path.join(projectRoot, fileName);

    try {
      const contents = await fs.readFile(filePath, "utf8");
      parseEnvFile(contents);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }
}

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getPort() {
  const value = process.env.DB_PORT || "3306";
  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("DB_PORT must be a positive integer.");
  }

  return port;
}

function buildPlaceholders(values) {
  return values.map(() => "?").join(", ");
}

async function ensureSchema(connection) {
  const schemaPath = path.join(projectRoot, "database", "schema.sql");
  const rawSchema = await fs.readFile(schemaPath, "utf8");
  const portableSchema = rawSchema
    .replace(/^CREATE DATABASE IF NOT EXISTS .*?;\s*/im, "")
    .replace(/^USE .*?;\s*/im, "")
    .replace(/TABLE_SCHEMA = 'dispatcher'/g, "TABLE_SCHEMA = DATABASE()")
    .replace(
      /updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/g,
      "updated_at TIMESTAMP NULL DEFAULT NULL"
    );

  await connection.query(portableSchema);
}

async function findRowByField(connection, table, field, value, columns = "*") {
  const [rows] = await connection.query(
    `SELECT ${columns} FROM ${table} WHERE ${field} = ? LIMIT 1`,
    [value]
  );

  return rows[0] ?? null;
}

async function upsertCustomer(connection, customer) {
  const existing = await findRowByField(connection, "customers", "company_name", customer.company_name, "id");

  if (existing) {
    await connection.execute(
      `
        UPDATE customers
        SET
          contact_name = ?,
          email = ?,
          phone = ?,
          address = ?,
          warehouse_phone = ?,
          status = ?
        WHERE id = ?
      `,
      [
        customer.contact_name,
        customer.email,
        customer.phone,
        customer.address,
        customer.warehouse_phone,
        customer.status,
        existing.id,
      ]
    );

    return existing.id;
  }

  const [result] = await connection.execute(
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

  return result.insertId;
}

async function upsertByUniqueField(connection, table, uniqueField, record) {
  const fieldNames = Object.keys(record);
  const placeholders = fieldNames.map(() => "?").join(", ");
  const values = fieldNames.map((field) => record[field]);
  const updateFields = fieldNames.filter((field) => field !== uniqueField);
  const updateSql = updateFields.map((field) => `${field} = VALUES(${field})`).join(", ");

  await connection.execute(
    `
      INSERT INTO ${table} (${fieldNames.join(", ")})
      VALUES (${placeholders})
      ON DUPLICATE KEY UPDATE ${updateSql}
    `,
    values
  );
}

async function fetchMapByField(connection, table, field, values, extraColumns = []) {
  const columns = ["id", field, ...extraColumns].join(", ");
  const [rows] = await connection.query(
    `SELECT ${columns} FROM ${table} WHERE ${field} IN (${buildPlaceholders(values)})`,
    values
  );

  return new Map(rows.map((row) => [row[field], row]));
}

function getRequiredMapValue(map, key, label) {
  const value = map.get(key);

  if (!value) {
    throw new Error(`${label} not found for "${key}".`);
  }

  return value;
}

async function seedCustomers(connection) {
  for (const customer of demoCustomers) {
    await upsertCustomer(connection, customer);
  }

  return fetchMapByField(
    connection,
    "customers",
    "company_name",
    demoCustomers.map((item) => item.company_name),
    ["address"]
  );
}

async function seedDrivers(connection) {
  for (const driver of demoDrivers) {
    await upsertByUniqueField(connection, "drivers", "license_number", driver);
  }

  return fetchMapByField(
    connection,
    "drivers",
    "license_number",
    demoDrivers.map((item) => item.license_number)
  );
}

async function seedLocations(connection) {
  for (const port of demoPorts) {
    await upsertByUniqueField(connection, "ports", "code", port);
  }

  for (const yard of demoYards) {
    await upsertByUniqueField(connection, "yards", "code", yard);
  }

  for (const warehouse of demoWarehouses) {
    await upsertByUniqueField(connection, "warehouses", "code", warehouse);
  }
}

async function seedContainers(connection, customerMap) {
  for (const container of demoContainers) {
    const customer = getRequiredMapValue(customerMap, container.customer_name, "Customer");
    const warehouseCustomer = getRequiredMapValue(customerMap, container.warehouse_name, "Warehouse customer");

    await upsertByUniqueField(connection, "containers", "container_number", {
      customer_id: customer.id,
      container_number: container.container_number,
      container_type: container.container_type,
      equipment_type: container.equipment_type,
      booking_number: container.booking_number,
      vessel_eta: container.vessel_eta,
      size: container.size,
      shipping_line: container.shipping_line,
      pickup_port: container.pickup_port,
      pickup_lfd: container.pickup_lfd,
      port_pickup_datetime: container.port_pickup_datetime,
      warehouse_customer_id: warehouseCustomer.id,
      warehouse_address: warehouseCustomer.address,
      scac_code: container.scac_code,
      seal_number: container.seal_number,
      gate_code: container.gate_code,
      pin_code: container.pin_code,
      checked_in_code: container.checked_in_code,
      status: container.status,
      current_location: container.current_location,
    });
  }

  return fetchMapByField(
    connection,
    "containers",
    "container_number",
    demoContainers.map((item) => item.container_number)
  );
}

async function seedDispatches(connection, customerMap, driverMap, containerMap) {
  for (const dispatch of demoDispatches) {
    const customer = getRequiredMapValue(customerMap, dispatch.customer_name, "Customer");
    const driver = getRequiredMapValue(driverMap, dispatch.driver_license, "Driver");
    const container = getRequiredMapValue(containerMap, dispatch.container_number, "Container");

    await upsertByUniqueField(connection, "dispatches", "dispatch_number", {
      dispatch_number: dispatch.dispatch_number,
      customer_id: customer.id,
      driver_id: driver.id,
      container_id: container.id,
      dispatch_type: dispatch.dispatch_type,
      pickup_location: dispatch.pickup_location,
      pickup_address: dispatch.pickup_address,
      pickup_date: dispatch.pickup_date,
      pickup_time: dispatch.pickup_time,
      delivery_location: dispatch.delivery_location,
      delivery_address: dispatch.delivery_address,
      delivery_date: dispatch.delivery_date,
      delivery_time: dispatch.delivery_time,
      dropoff_location: dispatch.delivery_location,
      scheduled_date: `${dispatch.pickup_date} ${dispatch.pickup_time}`,
      status: dispatch.status,
      notes: dispatch.notes,
    });
  }
}

async function countRows(connection, table) {
  const [rows] = await connection.query(`SELECT COUNT(*) AS total FROM ${table}`);
  return rows[0]?.total ?? 0;
}

async function main() {
  await loadLocalEnv();

  const connection = await mysql.createConnection({
    host: getRequiredEnv("DB_HOST"),
    port: getPort(),
    user: getRequiredEnv("DB_USER"),
    password: getRequiredEnv("DB_PASSWORD"),
    database: getRequiredEnv("DB_NAME"),
    multipleStatements: true,
  });

  try {
    await ensureSchema(connection);
    await connection.beginTransaction();

    const customerMap = await seedCustomers(connection);
    const driverMap = await seedDrivers(connection);
    await seedLocations(connection);
    const containerMap = await seedContainers(connection, customerMap);
    await seedDispatches(connection, customerMap, driverMap, containerMap);

    await connection.commit();

    const totals = await Promise.all([
      countRows(connection, "customers"),
      countRows(connection, "drivers"),
      countRows(connection, "containers"),
      countRows(connection, "dispatches"),
      countRows(connection, "ports"),
      countRows(connection, "yards"),
      countRows(connection, "warehouses"),
    ]);

    console.log("Portal demo data seeded successfully.");
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Customers: ${totals[0]}`);
    console.log(`Drivers: ${totals[1]}`);
    console.log(`Containers: ${totals[2]}`);
    console.log(`Dispatches: ${totals[3]}`);
    console.log(`Ports: ${totals[4]}`);
    console.log(`Yards: ${totals[5]}`);
    console.log(`Warehouses: ${totals[6]}`);
  } catch (error) {
    try {
      await connection.rollback();
    } catch {}

    console.error("Failed to seed portal demo data:", error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

main();
