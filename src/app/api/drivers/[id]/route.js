import { deleteRecord, getRecord, updateRecord } from "@/lib/api/crud";

export async function GET(_request, { params }) {
  return getRecord("drivers", params.id);
}

export async function PUT(request, { params }) {
  return updateRecord("drivers", params.id, request);
}

export async function DELETE(_request, { params }) {
  return deleteRecord("drivers", params.id);
}
