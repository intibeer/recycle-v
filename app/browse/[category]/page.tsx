"use client";
import { useEffect, useState } from "react";
import { ResultsList } from "@/components/ui/ResultsList";
import { fetchBrowseItemsWithFacets } from "@/lib/browseSearch";
import { getIndexCategory } from "@/lib/categoryMapping";

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
  const categoryParam = decodeURIComponent(params.category);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSubcategory = searchParams.get("subcategory");
  const location = searchParams.get("location") || null;

  const [results, setResults] = useState<ResultItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("featured");
  const [marketplaces, setMarketplaces] = useState<Marketplaces>({});
  const [total, setTotal] = useState<number>(0);
  const [categoryTotal, setCategoryTotal] = useState<number>(0); // Add this state
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
        const { items, total, categoryTotal, facets } =
          await fetchBrowseItemsWithFacets(
            categoryParam,
            selectedSubcategory,
            location
          );

        if (items.length > 0) {
          const categoryHierarchy = items[0].category_hierarchy;
          if (categoryHierarchy && categoryHierarchy.length > 0) {
            const mainCategory = categoryHierarchy[0];
            setProperCategory(mainCategory);
          }
        }

        setResults(items);
        setTotal(total);
        setCategoryTotal(categoryTotal); // Store the category total
        setLocationFacets(facets.locations);
        setSubcategoryFacets(facets.subcategories);
        const mappedCategory = getIndexCategory(categoryParam);
        setProperCategory(mappedCategory);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [categoryParam, selectedSubcategory, location]);

  const updateFilters = (
    newSubcategory?: string | null,
    newLocation?: string | null
  ) => {
    const params = new URLSearchParams();
    if (newSubcategory) params.set("subcategory", newSubcategory);
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
        <Link
          href={`/browse/${properCategory.toLowerCase()}`}
          className="font-semibold hover:underline"
        >
          {properCategory}
        </Link>
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
          {/* Location facets with search */}
          <LocationsSection
            locationFacets={locationFacets}
            selectedLocation={location}
            categoryTotal={categoryTotal}
            onLocationSelect={(newLocation) =>
              updateFilters(selectedSubcategory, newLocation)
            }
          />

          {/* Subcategory facets */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-3">Categories</h2>
            <div className="space-y-2">
              {/* All Categories at top level */}
              <button
                onClick={() => updateFilters(undefined, location)}
                className={`w-full text-left px-2 py-1.5 rounded ${
                  !selectedSubcategory
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                All {properCategory} ({categoryTotal})
              </button>

              {/* Indented subcategories with a left border */}
              <div className="pl-3 ml-2 border-l border-gray-200 space-y-1">
                {subcategoryFacets
                  .filter(({ value }) => !value.startsWith("All "))
                  .map(({ value, count }) => (
                    <button
                      key={value}
                      onClick={() => updateFilters(value, location)}
                      className={`w-full text-left px-2 py-1 rounded text-sm ${
                        selectedSubcategory === value
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {value} ({count})
                    </button>
                  ))}
              </div>
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

const LocationsSection = ({
  locationFacets,
  selectedLocation,
  categoryTotal,
  onLocationSelect,
}: {
  locationFacets: { value: string; count: number }[];
  selectedLocation: string | null;
  categoryTotal: number;
  onLocationSelect: (location: string | undefined) => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">Locations</h2>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search locations..."
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          {/* All Locations at top level */}
          <button
            onClick={() => onLocationSelect(undefined)}
            className={`w-full text-left px-2 py-1.5 rounded ${
              !selectedLocation
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-50"
            }`}
          >
            All Locations
          </button>

          {/* Indented locations with a left border */}
          <div className="pl-3 ml-2 border-l border-gray-200 space-y-1">
            {locationFacets.slice(0, 5).map(({ value, count }) => (
              <button
                key={value}
                onClick={() => onLocationSelect(value)}
                className={`w-full text-left px-2 py-1 rounded text-sm ${
                  selectedLocation === value
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {value} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
