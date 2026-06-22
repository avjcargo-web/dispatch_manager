import LocationFormClient from "@/components/locations/LocationFormClient";

export default async function AddPortPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const recordId = resolvedSearchParams?.id ?? null;

  return <LocationFormClient entityKey="ports" recordId={recordId} />;
}
