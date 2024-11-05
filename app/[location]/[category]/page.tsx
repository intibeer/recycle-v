"use client";
import { useEffect, useState } from "react";
import { ResultsList } from "@/components/ui/ResultsList";
import { fetchItemsWithFacets } from "@/lib/search";
import { ResultItem as ResultItemType, Marketplaces } from "@/hooks/used-object-search";
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CategoryPage({
  params,
}: {
  params: { location: string; category: string };
}) {
  // Destructure and decode params
  const locationParam = decodeURIComponent(params.location);
  const categoryParam = decodeURIComponent(params.category);
    
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSubcategory = searchParams.get('subcategory');

  const [properLocation, setProperLocation] = useState(locationParam);
  const [properCategory, setProperCategory] = useState(categoryParam);
  const [results, setResults] = useState<ResultItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("featured");
  const [marketplaces, setMarketplaces] = useState<Marketplaces>({});
  const [total, setTotal] = useState<number>(0);
  const [facets, setFacets] = useState<{ value: string; count: number }[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { items, total, facets: subcategoryFacets } = await fetchItemsWithFacets(
          locationParam,
          categoryParam,
          selectedSubcategory
        );

        // Set proper case from first result
        if (items.length > 0) {
          setProperLocation(items[0].town);
          // For category, find the matching category from category_hierarchy
          const categoryHierarchy = items[0].category_hierarchy;
          if (categoryHierarchy && categoryHierarchy.length > 0) {
            const mainCategory = categoryHierarchy[0];
            setProperCategory(mainCategory);
          }
        }

        setResults(items);
        setTotal(total);
        setFacets(subcategoryFacets);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [locationParam, categoryParam, selectedSubcategory]);

  const updateSubcategory = (subcategory: string | null) => {
    if (subcategory) {
      router.push(`/${locationParam}/${categoryParam}?subcategory=${encodeURIComponent(subcategory)}`);
    } else {
      router.push(`/${locationParam}/${categoryParam}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <Link href="/" className="hover:underline">Home</Link>
        {' > '}
        <Link href={`/${locationParam}`} className="hover:underline">{properLocation}</Link>
        {' > '}
        <span className="font-semibold">{properCategory}</span>
        {selectedSubcategory && (
          <>
            {' > '}
            <span className="text-gray-500">{selectedSubcategory}</span>
          </>
        )}
      </nav>

      <div className="flex gap-6">
        {/* Facets sidebar */}
        <div className="w-64">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-3">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => updateSubcategory(null)}
                className={`w-full text-left px-2 py-1.5 rounded ${
                  !selectedSubcategory ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                All {properCategory} ({total})
              </button>
              {facets.map(({ value, count }) => (
                <button
                  key={value}
                  onClick={() => updateSubcategory(value)}
                  className={`w-full text-left px-2 py-1.5 rounded ${
                    selectedSubcategory === value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
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
            {selectedSubcategory 
              ? `${selectedSubcategory} in ${properLocation}`
              : `${properCategory} in ${properLocation}`}
          </h1>

          {total > 0 && (
            <p className="mb-4 text-gray-600">
              Found {total} items
            </p>
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