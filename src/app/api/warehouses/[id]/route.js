import { deleteRecord, getRecord, updateRecord } from "@/lib/api/crud";

export async function GET(_request, { params }) {
  return getRecord("warehouses", params.id);
}

export async function PUT(request, { params }) {
  return updateRecord("warehouses", params.id, request);
}

export async function DELETE(_request, { params }) {
  return deleteRecord("warehouses", params.id);
}
