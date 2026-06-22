import { createRecord, listRecords } from "@/lib/api/crud";

export async function GET() {
  return listRecords("ports");
}

export async function POST(request) {
  return createRecord("ports", request);
}
