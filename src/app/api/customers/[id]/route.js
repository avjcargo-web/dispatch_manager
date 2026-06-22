import { deleteRecord, getRecord, updateRecord } from "@/lib/api/crud";

export async function GET(_request, { params }) {
  return getRecord("customers", params.id);
}

export async function PUT(request, { params }) {
  return updateRecord("customers", params.id, request);
}

export async function DELETE(_request, { params }) {
  return deleteRecord("customers", params.id);
}
