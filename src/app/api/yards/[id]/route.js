import { deleteRecord, getRecord, updateRecord } from "@/lib/api/crud";

export async function GET(_request, { params }) {
  return getRecord("yards", params.id);
}

export async function PUT(request, { params }) {
  return updateRecord("yards", params.id, request);
}

export async function DELETE(_request, { params }) {
  return deleteRecord("yards", params.id);
}
