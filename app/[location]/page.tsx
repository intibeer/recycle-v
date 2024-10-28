"use client";

import { useEffect, useState } from "react";
import { ResultsList } from "@/components/ui/ResultsList";
import { ResultItem } from "@/hooks/used-object-search"; // Adjust the import path
import { fetchItemsByLocation } from "@/lib/search";
import { Marketplaces } from "@/hooks/used-object-search"; // Import the Marketplaces type
console.log("fetchItemsByLocation imported:", fetchItemsByLocation);
export default function LocationPage({
  params,
}: {
  params: { location: string };
}) {
  console.log("/location rendering");
  const { location } = params;
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [sortOption, setSortOption] = useState("featured"); // Initialize sort option
  const [marketplaces, setMarketplaces] = useState<Marketplaces>({}); // Initialize marketplaces

  useEffect(() => {
    console.log("useEffect running for location:", location);

    const fetchResults = async () => {
      console.log("fetchResults function called");
      setLoading(true);
      try {
        console.log("About to call fetchItemsByLocation");
        const items = await fetchItemsByLocation(location);
        console.log("Received items:", items);
        setResults(items);
      } catch (error) {
        console.error("Error in fetchResults:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [location]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Items available in {location}</h1>
      {loading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : results.length > 0 ? (
        <ResultsList
          results={results}
          loading={loading}
          hasSearched={true}
          sortOption={sortOption}
          setSortOption={setSortOption}
          marketplaces={marketplaces}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-xl text-gray-700 mb-2">No results found</p>
          <p className="text-md text-gray-500">
            We couldn't find any items in {location}. Try searching for a
            different location or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
