import { createRecord, listRecords } from "@/lib/api/crud";

export async function GET() {
  return listRecords("drivers");
}

export async function POST(request) {
  return createRecord("drivers", request);
}
