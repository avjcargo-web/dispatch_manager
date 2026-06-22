import DispatchFormClient from "@/components/dispatch/DispatchFormClient";

export default async function CreateDispatchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const dispatchId = resolvedSearchParams?.id ?? null;

  return <DispatchFormClient dispatchId={dispatchId} />;
}
