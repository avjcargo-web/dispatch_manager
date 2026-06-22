import { createRecord, listRecords } from "@/lib/api/crud";

export async function GET() {
  return listRecords("yards");
}

export async function POST(request) {
  return createRecord("yards", request);
}
