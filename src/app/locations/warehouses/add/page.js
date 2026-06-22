import LocationFormClient from "@/components/locations/LocationFormClient";

export default async function AddWarehousePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const recordId = resolvedSearchParams?.id ?? null;

  return <LocationFormClient entityKey="warehouses" recordId={recordId} />;
}
