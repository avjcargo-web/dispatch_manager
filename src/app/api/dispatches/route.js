import { createDispatch, listDispatches } from "@/lib/api/dispatches";

export async function GET(request) {
  return listDispatches(request);
}

export async function POST(request) {
  return createDispatch(request);
}
