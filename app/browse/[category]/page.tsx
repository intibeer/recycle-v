// app/browse/[category]/page.tsx
"use client";
import BrowseView from "@/components/ui/InstantSearch";

export default function BrowsePage({
  params,
}: {
  params: { category: string };
}) {
  const category = decodeURIComponent(params.category);

  return (
    <div className="container mx-auto p-6">
       <BrowseView category={category} />
    </div>
  );
}
