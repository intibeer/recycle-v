import {
  InstantSearch,
  RefinementList,
  Configure,
  Hits,
  useInstantSearch,
  useRefinementList,
  useClearRefinements,
} from "react-instantsearch";
import { searchClient } from "@/lib/algolia";
import history from "instantsearch.js/es/lib/routers/history"; // Import the history router

import Link from "next/link";

import { useState } from "react";
import { X } from "lucide-react";

import { useInfiniteHits } from "react-instantsearch";
import { useEffect } from "react";

interface BrowseViewProps {
  category: string;
  initialSubcategory: string | null;
  initialLocation: string | null;
}

interface Hit {
  objectID: string;
  title: string;
  price: number;
  image_url: string;
  marketplace: string;
  description: string;
  url: string;
}

function Hit({ hit }: { hit: Hit }) {
  return (
    <a
      href={hit.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="flex p-4 gap-4">
        <div className="w-40 h-40 relative flex-shrink-0">
          <img
            src={hit.image_url}
            alt={hit.title}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg line-clamp-2">{hit.title}</h3>
          <p className="text-2xl font-bold mt-2">£{hit.price}</p>
          <p className="text-gray-600 mt-2 line-clamp-2">{hit.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            From {hit.marketplace}
          </div>
        </div>
      </div>
    </a>
  );
}

function TitleSection({
  category,
  initialSubcategory,
  setFiltersOpen,
}: {
  category: string;
  initialSubcategory: string | null;
  setFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { results } = useInstantSearch();
  const { items: locationItems } = useRefinementList({ attribute: "town" });
  const { items: categoryItems } = useRefinementList({
    attribute: "category_hierarchy",
  });
  const { refine: clearAll } = useClearRefinements();

  // Get selected locations
  const selectedLocations = locationItems
    .filter((item) => item.isRefined)
    .map((item) => item.label);

  // Get selected subcategories
  const selectedSubcategories = categoryItems
    .filter((item) => item.isRefined)
    .map((item) => item.label.split(" > ")[1]); // Extract subcategory

  // Format locations and subcategories for title
  const locationText =
    selectedLocations.length > 0 ? ` in ${selectedLocations.join(" or ")}` : "";
  const subcategoryText =
    selectedSubcategories.length > 0
      ? ` (${selectedSubcategories.join(", ")})`
      : "";

  // Check if any filters are active
  const hasActiveFilters =
    selectedLocations.length > 0 || selectedSubcategories.length > 0;

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">
        Used {category}
        {subcategoryText}
        {locationText}
      </h1>
      <Link href="/browse" className="text-sm text-blue-600 hover:underline">
        View all items
      </Link>
      {results?.nbHits > 0 && (
        <p className="text-gray-600">Found {results.nbHits} items</p>
      )}
      {/* Mobile Filter Button */}
      <button
        onClick={() => setFiltersOpen(true)}
        className="block md:hidden mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg w-full text-center"
      >
        Filters
      </button>

      {hasActiveFilters && (
        <div className="mt-2">
          <button
            onClick={() => clearAll()}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X size={14} />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function SearchContent({
  category,
  initialSubcategory,
  initialLocation,
}: BrowseViewProps) {
  const [isFiltersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="flex gap-6">
      {/* Facets sidebar for mobile */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4 z-40 transition-transform transform ${
          isFiltersOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button onClick={() => setFiltersOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Location facet */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Locations</h2>
          <RefinementList
            attribute="town"
            searchable={true}
            searchablePlaceholder="Search locations..."
            limit={4}
            showMore={true}
            operator="or"
            classNames={{
              root: "space-y-4",
              searchBox: "relative mb-4",
              input:
                "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              list: "space-y-2",
              item: "group",
              label:
                "flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded hover:bg-gray-100 transition-colors",
              checkbox:
                "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
              labelText: "flex-1 text-gray-700 group-hover:text-gray-900",
              count: "text-sm text-gray-500 group-hover:text-gray-700",
            }}
          />
        </div>

        {/* Category facet */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Types of {category}</h2>
          <RefinementList
            attribute="category_hierarchy"
            searchable={true}
            searchablePlaceholder="Search types..."
            limit={5}
            showMore={true}
            operator="or"
            transformItems={(items) =>
              items.map((item) => ({
                ...item,
                label: item.label.split(" > ").pop(), // Keep only the subcategory after the " > "
              }))
            }
            classNames={{
              root: "space-y-4",
              searchBox: "relative mb-4",
              input:
                "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              list: "space-y-2",
              item: "group",
              label:
                "flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded hover:bg-gray-100 transition-colors",
              checkbox:
                "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
              labelText: "flex-1 text-gray-700 group-hover:text-gray-900",
              count: "text-sm text-gray-500 group-hover:text-gray-700",
            }}
          />
        </div>
      </div>

      {/* Facets sidebar for desktop */}
      <div className="hidden md:block w-64 space-y-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Locations</h2>
          <RefinementList
            attribute="town"
            searchable={true}
            searchablePlaceholder="Search locations..."
            limit={5}
            showMore={true}
            operator="or"
            classNames={{
              root: "space-y-4",
              searchBox: "relative mb-4",
              input:
                "w-full px-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              submitIcon: "hidden",
              resetIcon: "hidden",
              loadMore:
                "text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer block mt-2",
              list: "space-y-2",
              item: "group",
              label:
                "flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded hover:bg-gray-50 transition-colors",
              checkbox:
                "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
              labelText: "flex-1 text-gray-700 group-hover:text-gray-900",
              count: "text-sm text-gray-500 group-hover:text-gray-700",
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Types of {category}</h2>
          <RefinementList
            attribute="category_hierarchy"
            searchable={true}
            searchablePlaceholder="Search types..."
            limit={10}
            showMore={true}
            operator="or"
            transformItems={(items) =>
              items
                .filter((item) => item.label.includes(" > "))
                .map((item) => ({
                  ...item,
                  highlighted: item.label.split(" > ")[1],
                  label: item.label.split(" > ")[1],
                }))
            }
            classNames={{
              root: "space-y-4",
              searchBox: "relative mb-4",
              input:
                "w-full px-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              submitIcon: "hidden",
              resetIcon: "hidden",
              loadMore:
                "text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer block mt-2",
              list: "space-y-2",
              item: "group",
              label:
                "flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded hover:bg-gray-50 transition-colors",
              checkbox:
                "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
              labelText: "flex-1 text-gray-700 group-hover:text-gray-900",
              count: "text-sm text-gray-500 group-hover:text-gray-700",
            }}
          />
        </div>
      </div>

      {/* Results section */}
      <div className="flex-1 space-y-6">
        <TitleSection
          category={category}
          initialSubcategory={initialSubcategory}
          setFiltersOpen={setFiltersOpen} // Keep mobile logic intact
        />
        <InfiniteHits /> {/* Replace Hits with InfiniteHits */}
      </div>
    </div>
  );
}

// Helper functions to slugify category names for URL paths
function getCategorySlug(name: string) {
  return name.split(" ").map(encodeURIComponent).join("+");
}

function getCategoryName(slug: string) {
  return slug.split("+").map(decodeURIComponent).join(" ");
}

const routing = {
  router: history({
    windowTitle({ query, locations }) {
      const queryTitle = query ? `Results for "${query}"` : "Search";
      return locations ? `${locations} – ${queryTitle}` : queryTitle;
    },

    createURL({ qsModule, routeState, location }) {
      const baseUrl = location.pathname;

      const queryParameters: Record<string, string | string[]> = {};

      if (routeState.query) queryParameters.query = routeState.query;
      if (routeState.page && routeState.page !== 1)
        queryParameters.page = String(routeState.page);
      if (routeState.locations)
        queryParameters.locations = routeState.locations;
      if (routeState.subcategory && routeState.subcategory.length > 0) {
        queryParameters.subcategory = routeState.subcategory;
      } // Only include subcategory if it has a value

      const queryString = qsModule.stringify(queryParameters, {
        addQueryPrefix: true,
        arrayFormat: "repeat",
      });

      return `${baseUrl}${queryString}`;
    },

    parseURL({ qsModule, location }) {
      const pathnameMatches = location.pathname.match(/browse\/(.*?)\/?$/);
      const category = pathnameMatches
        ? getCategoryName(pathnameMatches[1])
        : undefined;

      const {
        query = "",
        page = 1,
        locations = [],
        subcategory,
      } = qsModule.parse(location.search.slice(1));

      return {
        query: query,
        page: Number(page),
        locations: Array.isArray(locations) ? locations : [locations],
        subcategory:
          subcategory && subcategory.length > 0
            ? Array.isArray(subcategory)
              ? subcategory
              : [subcategory]
            : undefined, // Ensure undefined if empty
        category,
      };
    },
  }),

  stateMapping: {
    // This is now correctly placed as a sibling to `router`
    stateToRoute(uiState) {
      const indexUiState = uiState["used-objects"] || {};

      return {
        query: indexUiState.query,
        page: indexUiState.page,
        locations: indexUiState.refinementList?.town,
        subcategory: indexUiState.refinementList?.category_hierarchy?.length
          ? indexUiState.refinementList.category_hierarchy.map(
              (item) => item.split(" > ")[1]
            )
          : undefined, // Exclude empty subcategories
      };
    },

    routeToState(routeState) {
      return {
        "used-objects": {
          query: routeState.query,
          page: routeState.page,
          refinementList: {
            town: routeState.locations,
            category_hierarchy: routeState.subcategory?.map(
              (sub) => `Category > ${sub}`
            ),
          },
        },
      };
    },
  },
};

function InfiniteHits() {
  const { hits, hasMore, refineNext, isLoading } = useInfiniteHits<Hit>(); // Use generic type <Hit>
  const [isEndReached, setEndReached] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 200 && hasMore) {
        refineNext();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, refineNext]);

  // Check if we've reached the end correctly
  useEffect(() => {
    if (!hasMore && !isLoading) {
      setEndReached(true);
    } else {
      setEndReached(false);
    }
  }, [hasMore, isLoading]);

  return (
    <div className="space-y-4">
      {hits.map((hit) => (
        <Hit key={hit.objectID} hit={hit} />
      ))}
      {isLoading && (
        <p className="text-center text-gray-500 mt-4">
          Loading more results...
        </p>
      )}
      {isEndReached && (
        <p className="text-center text-gray-500 mt-4">
          You’ve reached the end of the results.
        </p>
      )}
    </div>
  );
}
export default function BrowseView({
  category,
  initialSubcategory = null,
  initialLocation = null,
}: BrowseViewProps) {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="used-objects"
      routing={routing}
    >
      <Configure
        filters={`category_hierarchy:"${category}"`}
        hitsPerPage={20}
      />
      <SearchContent
        category={category}
        initialSubcategory={initialSubcategory}
        initialLocation={initialLocation}
      />
    </InstantSearch>
  );
}
