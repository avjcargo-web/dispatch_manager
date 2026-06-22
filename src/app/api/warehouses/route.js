import { createRecord, listRecords } from "@/lib/api/crud";

export async function GET() {
  return listRecords("warehouses");
}

export async function POST(request) {
  return createRecord("warehouses", request);
}
