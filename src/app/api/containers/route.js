import { createRecord, listRecords } from "@/lib/api/crud";

export async function GET() {
  return listRecords("containers");
}

export async function POST(request) {
  return createRecord("containers", request);
}
