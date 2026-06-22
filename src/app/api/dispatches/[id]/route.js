import { deleteDispatch, getDispatchById, updateDispatch } from "@/lib/api/dispatches";

export async function GET(_request, { params }) {
  return getDispatchById(params.id);
}

export async function PUT(request, { params }) {
  return updateDispatch(params.id, request);
}

export async function DELETE(_request, { params }) {
  return deleteDispatch(params.id);
}
