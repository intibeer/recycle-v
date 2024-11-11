"use client";

import { useMemo } from "react";
import {
  InstantSearch,
  Configure,
  useRefinementList,
  useInstantSearch,
  Index,
} from "react-instantsearch";
import { searchClient } from "@/lib/algolia";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import qs from "qs";
import { ResultsList } from "@/components/ui/ResultsList";
import { useState, useEffect } from "react";
import SubcategoryNav from "@/components/ui/SubCategoryNav";

interface SubcategoryPageProps {
  category: string;
  location: string;
  subcategory: string;
}

// This component handles the subcategory refinement
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

  useEffect(() => {
    if (!items) return;

    // Find items that are subcategories
    const subcategoryItems = items.filter((item) => item.label.includes(" > "));

    // Find the matching subcategory
    const match = subcategoryItems.find((item) => {
      const [mainCategory, subCategory] = item.label.split(" > ");
      return (
        mainCategory.toLowerCase() === category.toLowerCase() &&
        subCategory.toLowerCase() === subcategory.toLowerCase()
      );
    });

    if (match) {
      onMatch(match.label);
    }
  }, [items, category, subcategory, onMatch]);

  return null;
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

  const formattedSubcategory = subcategory
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);
  const formattedLocation =
    location.charAt(0).toUpperCase() + location.slice(1);

  const queryString = qs.stringify(
    {
      query: "",
      page: 1,
      locations: [location],
      // subcategory: [subcategory],
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

function ResultsManager({
  category,
  subcategory,
  sortOption,
  setSortOption,
}: {
  category: string;
  subcategory: string;
  sortOption: string;
  setSortOption: (option: string) => void;
}) {
  const { results } = useInstantSearch();

  return (
    <ResultsList
      loading={!results}
      hasSearched={true}
      results={results?.hits || []}
      sortOption={sortOption}
      setSortOption={setSortOption}
      marketplaces={{}}
      categoryName={`${subcategory} ${category}`}
      showHeading={false}
    />
  );
}

export default function SubcategoryPage({
  category,
  location,
  subcategory,
}: SubcategoryPageProps) {
  const [sortOption, setSortOption] = useState("relevance");
  const [matchedCategory, setMatchedCategory] = useState<string | null>(null);

  const formattedSubcategory = subcategory
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);
  const formattedLocation =
    location.charAt(0).toUpperCase() + location.slice(1);

  // Config for getting all subcategories
  const navConfig = useMemo(
    () => ({
      filters: `category_hierarchy:"${category}"`,
      disjunctiveFacetsRefinements: {
        town: [location],
      },
    }),
    [category, location]
  );

  // Config for search results
  const searchConfig = useMemo(
    () => ({
      filters: matchedCategory
        ? `category_hierarchy:"${matchedCategory}"`
        : `category_hierarchy:"${category} > ${formattedSubcategory}"`,
      disjunctiveFacetsRefinements: {
        town: [location],
      },
    }),
    [category, location, subcategory, matchedCategory, formattedSubcategory]
  );

  return (
    <InstantSearch searchClient={searchClient} indexName="used-objects">
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            Used {formattedCategory} ({formattedSubcategory}) in{" "}
            {formattedLocation}
          </h1>

          <div className="flex justify-between items-center">
            <RefineSearchButton
              category={category}
              location={location}
              subcategory={subcategory}
            />
            <Link
              href="/browse"
              className="text-sm text-blue-600 hover:underline"
            >
              Back to all categories
            </Link>
          </div>
        </div>

        {/* Index for nav - uses broad category filter */}
        <Index indexName="used-objects">
          <Configure {...navConfig} />
          <SubcategoryNav
            category={category}
            location={location}
            className="border-b border-gray-200 pb-4"
          />
        </Index>

        {/* Main index for results - uses specific subcategory filter */}
        <Configure {...searchConfig} />

        <ResultsManager
          category={category}
          subcategory={subcategory}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
      </div>
    </InstantSearch>
  );
}
