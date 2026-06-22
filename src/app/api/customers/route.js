import { createRecord, listRecords } from "@/lib/api/crud";

export async function GET() {
  return listRecords("customers");
}

export async function POST(request) {
  return createRecord("customers", request);
}
