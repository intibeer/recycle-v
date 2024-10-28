"use client";

import { useEffect, useState } from "react";
import { ResultsList } from "@/components/ui/ResultsList";
import { fetchItemsByTypeAndLocation } from "@/lib/search";
import {
  ResultItem as ResultItemType,
  Marketplaces,
} from "@/hooks/used-object-search"; // Adjust the import path
import { SearchResultItem } from "@/lib/types"; // Import the type

export default function ItemTypeInLocationPage({
  params,
}: {
  params: { location: string; type: string };
}) {
  const { location, type } = params;
  const [results, setResults] = useState<ResultItemType[]>([]); // State for results
  const [loading, setLoading] = useState(true); // Loading state
  const [sortOption, setSortOption] = useState("featured"); // Sort option state
  const [marketplaces, setMarketplaces] = useState<Marketplaces>({}); // Marketplace state

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true); // Start loading
      try {
        // Fetch items based on type and location
        const items: SearchResultItem[] = await fetchItemsByTypeAndLocation(
          type,
          location
        );
        console.log(items);
        // Map items to fit ResultItemType if necessary
        const updatedResults: ResultItemType[] = items.map((item) => ({
          objectID: item.objectID,
          name: item.name,
          description: item.description || "",
          image_url: item.image_url || "",
          url: item.url || "",
          date: item.date || "",
          time_posted: item.time_posted || "",
          price: item.price || "",
          href: item.href || "",
          location: item.location || "",
          site: item.site || "",
          lat: item.lat || 0,
          lon: item.lon || 0,
          town: item.town || "",
          region: item.region || "",
          country: item.country || "",
          _geoloc: item._geoloc || { lat: 0, lng: 0 }, // Ensure _geoloc is provided
          distance: item.distance || 0,
        }));

        setResults(updatedResults); // Update results state
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchResults(); // Call the function to fetch results
  }, [location, type]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {`Find ${type} in ${location}`}
      </h1>
      <ResultsList
        results={results}
        loading={loading}
        hasSearched={results.length > 0}
        sortOption={sortOption}
        setSortOption={setSortOption}
        marketplaces={marketplaces}
      />
    </div>
  );
}
