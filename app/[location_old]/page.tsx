"use client";
import { useEffect, useState } from "react";
import { ResultsList } from "@/components/ui/ResultsList";
import { fetchItemsWithFacets } from "@/lib/search";
import {
  ResultItem as ResultItemType,
  Marketplaces,
} from "@/hooks/used-object-search";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LocationPage({
  params,
}: {
  params: { location: string };
}) {
  const locationParam = decodeURIComponent(params.location);
  const router = useRouter();
  
  const [results, setResults] = useState<ResultItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [marketplaces, setMarketplaces] = useState<Marketplaces>({});
  const [total, setTotal] = useState<number>(0);
  const [categories, setCategories] = useState<{ value: string; count: number }[]>([]);
  const [properLocation, setProperLocation] = useState(locationParam);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Reset everything when location changes
    setResults([]);
    setPage(0);
    setHasMore(true);
    fetchInitialResults();
  }, [locationParam]);

  const fetchInitialResults = async () => {
    setLoading(true);
    try {
      const { items, total, facets, hasMore } = await fetchItemsWithFacets(locationParam, undefined, undefined, 0);
      
      if (items.length > 0) {
        setProperLocation(items[0].town);
      }
      
      setResults(items);
      setTotal(total);
      setCategories(facets);
      setHasMore(hasMore);
      setPage(0);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const { items, hasMore: moreItems } = await fetchItemsWithFacets(
        locationParam,
        undefined,
        undefined,
        nextPage
      );

      setResults(prev => [...prev, ...items]);
      setHasMore(moreItems);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more results:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const navigateToCategory = (category: string) => {
    router.push(`/${locationParam}/${category.toLowerCase()}`);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {" > "}
        <span className="font-semibold">{properLocation}</span>
      </nav>

      <div className="flex gap-6">
        {/* Categories sidebar */}
        <div className="w-64">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-3">Categories</h2>
            <div className="space-y-2">
              {categories.map(({ value, count }) => (
                <button
                  key={value}
                  onClick={() => navigateToCategory(value)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-50"
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
            Second hand items in {properLocation} and surrounding towns
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
            onLoadMore={loadMore}
            loadingMore={loadingMore}
            hasMore={hasMore}
          />
        </div>
      </div>
    </div>
  );
}