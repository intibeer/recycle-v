"use client";

import LocationLandingPage from "@/components/ui/LocationLandingPage";
import { useParams } from "next/navigation";

export default function BrowseLocationPage() {
  const params = useParams();

  const category = decodeURIComponent(params.category as string);
  const location = decodeURIComponent(params.location as string);

  return (
    <div className="container mx-auto p-6">
      <LocationLandingPage category={category} location={location} />
    </div>
  );
}
