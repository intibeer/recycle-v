// app/browse/[category]/[location]/[subcategory]/page.tsx
"use client";

import SubcategoryPage from "@/components/ui/SubcategoryPage";
import { useParams } from "next/navigation";

export default function BrowseSubcategoryPage() {
  const params = useParams();

  const category = decodeURIComponent(params.category as string);
  const location = decodeURIComponent(params.location as string);
  const subcategory = decodeURIComponent(params.subcategory as string);

  return (
    <div className="container mx-auto p-6">
      <SubcategoryPage
        category={category}
        location={location}
        subcategory={subcategory}
      />
    </div>
  );
}
