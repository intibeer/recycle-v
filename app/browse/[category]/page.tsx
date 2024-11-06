"use client";
import { useEffect, useState } from "react";
import { ResultsList } from "@/components/ui/ResultsList";
import { fetchBrowseItemsWithFacets } from "@/lib/browseSearch";
import {
  ResultItem as ResultItemType,
  Marketplaces,
} from "@/hooks/used-object-search";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function BrowsePage({
  params,
}: {
  params: { category: string };
}) {
  // Decode and get params
  const categoryParam = decodeURIComponent(params.category);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSubcategory = searchParams.get("subcategory");
  const location = searchParams.get("location") || null; // instead of selectedLocation

  const [results, setResults] = useState<ResultItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("featured");
  const [marketplaces, setMarketplaces] = useState<Marketplaces>({});
  const [total, setTotal] = useState<number>(0);
  const [properCategory, setProperCategory] = useState(categoryParam);
  const [locationFacets, setLocationFacets] = useState<
    { value: string; count: number }[]
  >([]);
  const [subcategoryFacets, setSubcategoryFacets] = useState<
    { value: string; count: number }[]
  >([]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { items, total, facets } = await fetchBrowseItemsWithFacets(
          categoryParam,
          selectedSubcategory,
          location
        );

        // Update proper category name from results
        if (items.length > 0) {
          const categoryHierarchy = items[0].category_hierarchy;
          if (categoryHierarchy && categoryHierarchy.length > 0) {
            const mainCategory = categoryHierarchy[0];
            setProperCategory(mainCategory);
          }
        }

        setResults(items);
        setTotal(total);
        setLocationFacets(facets.locations);
        setSubcategoryFacets(facets.subcategories);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [categoryParam, selectedSubcategory, location]);

  // Update the function definition to accept null values

  const updateFilters = (
    newSubcategory?: string | null,
    newLocation?: string | null
  ) => {
    const params = new URLSearchParams();
    if (newSubcategory) params.set("subcategory", newSubcategory); // instead of 'sub'
    if (newLocation) params.set("location", newLocation);

    router.push(`/browse/${categoryParam}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {" > "}
        <Link href="/browse" className="hover:underline">
          Browse
        </Link>
        {" > "}
        <span className="font-semibold">{properCategory}</span>
        {selectedSubcategory && (
          <>
            {" > "}
            <span className="text-gray-500">{selectedSubcategory}</span>
          </>
        )}
      </nav>

      <div className="flex gap-6">
        {/* Facets sidebar */}
        <div className="w-64 space-y-6">
          {/* Location facets */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-3">Locations</h2>
            <div className="space-y-2">
              <button
                onClick={() => updateFilters(selectedSubcategory, undefined)}
                className={`w-full text-left px-2 py-1.5 rounded ${
                  !location ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                }`}
              >
                All Locations ({total})
              </button>
              {locationFacets.map(({ value, count }) => (
                <button
                  key={value}
                  onClick={() => updateFilters(selectedSubcategory, value)}
                  className={`w-full text-left px-2 py-1.5 rounded ${
                    location === value
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {value} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory facets */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-3">Categories</h2>
            <div className="space-y-2">
              {subcategoryFacets.map(({ value, count }) => (
                <button
                  key={value}
                  onClick={() =>
                    updateFilters(
                      value.startsWith("All ") ? undefined : value,
                      location
                    )
                  }
                  className={`w-full text-left px-2 py-1.5 rounded ${
                    (value.startsWith("All ") && !selectedSubcategory) ||
                    selectedSubcategory === value
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {value} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">
            Find Second Hand {selectedSubcategory || properCategory}{" "}
            {location ? `in ${location}` : "Nationwide"}
          </h1>

          {total > 0 && (
            <p className="mb-4 text-gray-600">Found {total} items</p>
          )}

          <ResultsList
            results={results}
            loading={loading}
            hasSearched={results.length > 0}
            sortOption={sortOption}
            setSortOption={setSortOption}
            marketplaces={marketplaces}
          />
        </div>
      </div>
    </div>
  );
}
