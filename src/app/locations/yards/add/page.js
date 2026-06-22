import LocationFormClient from "@/components/locations/LocationFormClient";

export default async function AddYardPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const recordId = resolvedSearchParams?.id ?? null;

  return <LocationFormClient entityKey="yards" recordId={recordId} />;
}
