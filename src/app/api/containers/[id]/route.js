import { deleteRecord, getRecord, updateRecord } from "@/lib/api/crud";

export async function GET(_request, { params }) {
  return getRecord("containers", params.id);
}

export async function PUT(request, { params }) {
  return updateRecord("containers", params.id, request);
}

export async function DELETE(_request, { params }) {
  return deleteRecord("containers", params.id);
}
