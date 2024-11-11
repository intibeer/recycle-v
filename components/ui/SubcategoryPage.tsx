"use client";

import { useMemo, useEffect } from "react";
import {
  InstantSearch,
  Configure,
  useRefinementList,
  useInstantSearch,
} from "react-instantsearch";
import { searchClient } from "@/lib/algolia";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import qs from "qs";
import { ResultsList } from "@/components/ui/ResultsList";
import { useState } from "react";

interface SubcategoryPageProps {
  category: string;
  location: string;
  subcategory: string;
}

export function SubcategoryRefinement({
  category,
  subcategory,
  onMatch,
}: {
  category: string;
  subcategory: string;
  onMatch: (fullCategory: string) => void;
}) {
  const { items } = useRefinementList({
    attribute: "category_hierarchy",
  });
  const { results } = useInstantSearch();

  useEffect(() => {
    if (!items) return;

    console.log(
      "All refinement items:",
      items.map((item) => ({
        label: item.label,
        count: item.count,
      }))
    );

    // Find items that are subcategories
    const subcategoryItems = items.filter((item) => item.label.includes(" > "));

    console.log("Searching for:", {
      category: category.toLowerCase(),
      subcategory: subcategory.toLowerCase(),
    });

    console.log(
      "Available subcategories:",
      subcategoryItems.map((item) => ({
        label: item.label,
        count: item.count,
        parts: item.label.split(" > "),
      }))
    );

    // Find the matching subcategory
    const match = subcategoryItems.find((item) => {
      const [mainCategory, subCategory] = item.label.split(" > ");
      const isMatch =
        mainCategory.toLowerCase() === category.toLowerCase() &&
        subCategory.toLowerCase() === subcategory.toLowerCase();
      console.log("Comparing:", {
        itemCategory: mainCategory.toLowerCase(),
        itemSubcategory: subCategory.toLowerCase(),
        isMatch,
      });
      return isMatch;
    });

    console.log("Found match:", match?.label);
    if (match) {
      onMatch(match.label);

      // Log some sample hits to verify
      if (results?.hits) {
        console.log(
          "Sample items for this category:",
          results.hits.slice(0, 3).map((hit) => ({
            title: (hit as any).title,
            categories: (hit as any).category_hierarchy,
          }))
        );
      }
    }
  }, [items, category, subcategory, onMatch, results]);

  return <Configure facets={["category_hierarchy"]} />;
}
function findMatchingCategory(urlSlug: string, validCategories: string[]) {
  // Convert URL slug to a comparable format
  const slugWords = urlSlug
    .split("-")
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ""); // Remove any special characters

  return validCategories.find((category) => {
    const subcategory = category
      .split(" > ")[1] // Get subcategory part
      ?.toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // Remove any special characters
      .replace(/\s+/g, " "); // Normalize spaces

    // Try exact match first
    if (subcategory === slugWords) return true;

    // Try normalized versions (remove spaces)
    const normalizedSlug = slugWords.replace(/\s/g, "");
    const normalizedCategory = subcategory?.replace(/\s/g, "");
    if (normalizedSlug === normalizedCategory) return true;

    // Try partial matches
    return (
      subcategory?.includes(slugWords) || slugWords.includes(subcategory || "")
    );
  });
}

function RefineSearchButton({
  category,
  location,
  subcategory,
}: {
  category: string;
  location: string;
  subcategory: string;
}) {
  const { items } = useRefinementList({ attribute: "category_hierarchy" });

  const queryString = qs.stringify(
    {
      query: "",
      page: 1,
      locations: [location],
      subcategory: [subcategory],
    },
    {
      addQueryPrefix: true,
      arrayFormat: "indices",
      encodeValuesOnly: true,
    }
  );

  const searchUrl = `/browse/${category}${queryString}`;

  return (
    <Link href={searchUrl}>
      <Button
        size="lg"
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-6"
      >
        <Search className="w-5 h-5" />
        Refine Your Search
      </Button>
    </Link>
  );
}

export default function SubcategoryPage({
  category,
  location,
  subcategory,
}: SubcategoryPageProps) {
  const [sortOption, setSortOption] = useState("relevance");
  const [matchedCategory, setMatchedCategory] = useState<string | null>(null);

  // Format the subcategory by replacing hyphens with spaces

  // Format strings for display
  const formattedSubcategory = subcategory
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);
  const formattedLocation =
    location.charAt(0).toUpperCase() + location.slice(1);
  const initialConfig = useMemo(() => {
    const filterString = matchedCategory
      ? `category_hierarchy:"${matchedCategory}"`
      : `category_hierarchy:"${category} > ${formattedSubcategory}"`;

    console.log("Search configuration:", {
      filterString,
      originalCategory: category,
      originalSubcategory: subcategory,
      formattedSubcategory,
      matchedCategory,
      location,
    });

    return {
      filters: filterString,
      hitsPerPage: 20,
      facets: ["town"],
      facetFilters: [`town:${location}`],
    };
  }, [category, location, subcategory, matchedCategory]);

  useEffect(() => {
    console.log("Current search state:", {
      category,
      subcategory,
      location,
      matchedCategory,
      filterString: initialConfig.filters,
    });
  }, [category, subcategory, location, matchedCategory, initialConfig]);

  return (
    <InstantSearch searchClient={searchClient} indexName="used-objects">
      <SubcategoryRefinement
        category={category}
        subcategory={subcategory}
        onMatch={setMatchedCategory}
      />

      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            Used {formattedSubcategory} in {formattedLocation}
          </h1>

          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Link
                href={`/browse/${category}/${location}`}
                className="text-sm text-blue-600 hover:underline"
              >
                ← Back to all {category}
              </Link>

              <RefineSearchButton
                category={category}
                location={location}
                subcategory={subcategory}
              />
            </div>
          </div>
        </div>

        <ResultsManager
          category={category}
          subcategory={subcategory}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        <DebugSearch />
      </div>
      <Configure {...initialConfig} />
    </InstantSearch>
  );
}
function DebugSearch() {
  const { results } = useInstantSearch();

  useEffect(() => {
    if (results?.hits?.length > 0) {
      console.log(
        "Sample hit category_hierarchy:",
        results.hits[0].category_hierarchy
      );
      console.log("First 3 hits:", results.hits.slice(0, 3));
    }
  }, [results]);

  return null;
}

function ResultsManager({
  category,
  subcategory,
  sortOption,
  setSortOption,
  showHeading = false,
}: {
  category: string;
  subcategory: string;
  sortOption: string;
  setSortOption: (option: string) => void;
  showHeading?: boolean;
}) {
  const { results } = useInstantSearch();

  return (
    <ResultsList
      loading={false}
      hasSearched={true}
      results={results?.hits || []}
      sortOption={sortOption}
      setSortOption={setSortOption}
      marketplaces={{}} // Add your marketplace data here if needed
      categoryName={`${subcategory} ${category}`}
      showHeading={showHeading}
    />
  );
}
