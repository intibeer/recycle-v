"use client";
import BrowseView from "@/components/ui/InstantSearch";
import {
  useParams,
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { useMemo, useRef, useEffect, useState } from "react";
import { slugToCategory } from "@/lib/categoryToSlug";

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Create state to hold the current values
  const [currentState, setCurrentState] = useState(() => {
    const slug = params.category as string;
    const category = slugToCategory(slug);

    return {
      category,
      initialLocation: searchParams.get("locations"),
      initialSubcategory: searchParams.get("subcategory"),
    };
  });

  // Effect to handle URL updates
  useEffect(() => {
    const slug = params.category as string;
    const category = slugToCategory(slug);

    const newState = {
      category,
      initialLocation: searchParams.get("locations"),
      initialSubcategory: searchParams.get("subcategory"),
    };
    console.log("URL state updated:", newState);
    setCurrentState(newState);
  }, [params.category, searchParams]);

  console.log("CategoryPage rendering with state:", currentState);

  return (
    <div className="container mx-auto p-6">
      <BrowseView
        key={`${currentState.category}-${currentState.initialSubcategory}-${currentState.initialLocation}`}
        {...currentState}
      />
    </div>
  );
}
