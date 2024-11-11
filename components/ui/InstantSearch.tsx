import { useMemo, useRef } from "react";
import { RefinementListProps } from "react-instantsearch";

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
interface UsedObjectsUiState {
  refinementList: {
    town?: string[];
    category_hierarchy?: string[];
  };
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
  initialLocation,
  setFiltersOpen,
}: {
  category: string;
  initialSubcategory: string | null;
  initialLocation: string | null;
  setFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { results } = useInstantSearch();
  const { items: locationItems } = useRefinementList({ attribute: "town" });
  const { items: categoryItems } = useRefinementList({
    attribute: "category_hierarchy",
  });
  const { refine: clearAll } = useClearRefinements();

  // Get selected locations, including initial location
  const selectedLocations = useMemo(() => {
    const refinedLocations = locationItems
      .filter((item) => item.isRefined)
      .map((item) => item.label);

    // If we have an initial location and it's not already in the refined locations
    if (initialLocation && !refinedLocations.includes(initialLocation)) {
      return [initialLocation, ...refinedLocations];
    }

    return refinedLocations;
  }, [locationItems, initialLocation]);

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
        Back to all categories
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
  console.log("initialLocation set to ", initialLocation);

  // Common RefinementList props for locations
  const locationRefinementProps = {
    attribute: "town",
    searchable: true,
    searchablePlaceholder: "Search locations...",
    operator: "or",
  };

  // Common RefinementList props for subcategories
  const subcategoryRefinementProps = {
    attribute: "category_hierarchy",
    searchable: true,
    searchablePlaceholder: "Search types...",
    operator: "or",
  };

  // Common class names for refinement lists
  const refinementClassNames = {
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
  };

  // Mobile refinement class names with slightly different styling
  const mobileRefinementClassNames = {
    ...refinementClassNames,
    input:
      "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
    label:
      "flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded hover:bg-gray-100 transition-colors",
  };

  return (
    <div className="flex gap-6">
      {/* Mobile sidebar */}
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

        {/* Mobile Location facet */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Locations</h2>
          <RefinementList
            {...locationRefinementProps}
            limit={4}
            showMore={true}
            classNames={mobileRefinementClassNames}
          />
        </div>

        {/* Mobile Category facet */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Types of {category}</h2>
          <RefinementList
            {...subcategoryRefinementProps}
            limit={5}
            showMore={true}
            classNames={mobileRefinementClassNames}
          />
        </div>
      </div>

      {/* Desktop facets sidebar */}
      <div className="hidden md:block w-64 space-y-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Locations</h2>
          <RefinementList
            {...locationRefinementProps}
            limit={5}
            showMore={true}
            classNames={refinementClassNames}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Types of {category}</h2>
          <RefinementList
            {...subcategoryRefinementProps}
            limit={10}
            showMore={true}
            classNames={refinementClassNames}
          />
        </div>
      </div>

      {/* Results section */}
      <div className="flex-1 space-y-6">
        <TitleSection
          category={category}
          initialSubcategory={initialSubcategory}
          initialLocation={initialLocation}
          setFiltersOpen={setFiltersOpen}
        />
        <InfiniteHits />
      </div>
    </div>
  );
}

function getCategoryName(slug: string) {
  return slug.split("+").map(decodeURIComponent).join(" ");
}
export const routing = {
  router: history({
    parseURL({ qsModule, location }) {
      const parsedParams = qsModule.parse(location.search.slice(1), {
        arrayFormat: "bracket", // This handles subcategory[0], subcategory[1] format
        parseNumbers: false,
      });

      return {
        query: parsedParams.query || "",
        page: Number(parsedParams.page || 1),
        locations: Array.isArray(parsedParams.locations)
          ? parsedParams.locations
          : parsedParams.locations
          ? [parsedParams.locations]
          : [],
        subcategory: Array.isArray(parsedParams.subcategory)
          ? parsedParams.subcategory
          : parsedParams.subcategory
          ? [parsedParams.subcategory]
          : [],
      };
    },

    createURL({ qsModule, routeState, location }) {
      const queryParams = {
        query: routeState.query,
        page: routeState.page,
        locations: routeState.locations || [],
        subcategory: routeState.subcategory || [],
      };

      const queryString = qsModule.stringify(queryParams, {
        arrayFormat: "bracket",
        addQueryPrefix: true,
        encode: true,
      });

      return `${location.pathname}${queryString}`;
    },

    parseURL({ qsModule, location }) {
      const pathParts = location.pathname.split("/");
      const category = getCategoryName(pathParts[2]);

      const parsed = qsModule.parse(location.search.slice(1), {
        arrayFormat: "repeat",
        parseNumbers: false,
      });

      // Ensure consistent array handling for both parameters
      const locations = Array.isArray(parsed.locations)
        ? parsed.locations
        : parsed.locations
        ? [parsed.locations]
        : [];

      const subcategory = Array.isArray(parsed.subcategory)
        ? parsed.subcategory
        : parsed.subcategory
        ? [parsed.subcategory]
        : [];

      return {
        query: parsed.query || "",
        page: Number(parsed.page || 1),
        locations,
        subcategory,
        category,
      };
    },
  }),

  stateMapping: {
    stateToRoute(uiState: SearchUiState) {
      const indexUiState = uiState["used-objects"] || {};
      const refinementList = indexUiState.refinementList || {};

      console.log("stateToRoute - full state:", {
        uiState,
        refinementList,
        category_hierarchy: refinementList.category_hierarchy,
      });

      return {
        locations: refinementList.town || [],
        subcategory: (refinementList.category_hierarchy || []).map((cat) => {
          console.log("Processing category:", cat);
          return cat.split(" > ")[1];
        }),
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

type SearchUiState = {
  "used-objects": UsedObjectsUiState;
};

interface UsedObjectsUiState {
  refinementList: {
    town?: string[];
    category_hierarchy?: string[];
  };
}
const normalizeLocation = (location: string) =>
  location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();

export default function BrowseView({
  category,
  initialSubcategory = null,
  initialLocation = null,
}: BrowseViewProps) {
  // Track mounting for debugging
  const mountRef = useRef(0);

  useEffect(() => {
    mountRef.current += 1;
    console.log(`BrowseView mount #${mountRef.current}`, {
      category,
      initialSubcategory,
      initialLocation,
    });
  }, [category, initialSubcategory, initialLocation]);

  const searchConfig = useMemo(
    () => ({
      searchClient,
      indexName: "used-objects",
      routing: {
        stateMapping: {
          stateToRoute(uiState) {
            const indexUiState = uiState["used-objects"] || {};
            const refinementList = indexUiState.refinementList || {};

            // Normalize case when converting state to route
            const locations = (refinementList.town || []).map(
              normalizeLocation
            );

            return {
              query: indexUiState.query || "",
              page: indexUiState.page || 1,
              locations,
              subcategory: refinementList.category_hierarchy
                ? refinementList.category_hierarchy.map(
                    (cat) => cat.split(" > ")[1]
                  )
                : [],
            };
          },
          routeToState(routeState) {
            // Normalize case when converting route to state
            const locations = (routeState.locations || []).map(
              normalizeLocation
            );

            const refinementList = {
              town: locations,
              category_hierarchy: (routeState.subcategory || []).map(
                (sub) => `Category > ${sub}`
              ),
            };
            return {
              "used-objects": {
                query: routeState.query || "",
                page: routeState.page || 1,
                refinementList,
              },
            };
          },
        },
      },
      initialUiState: {
        "used-objects": {
          query: "",
          page: 1,
          refinementList: {
            // Normalize case in initial state
            town: initialLocation ? [normalizeLocation(initialLocation)] : [],
            category_hierarchy: initialSubcategory
              ? [`Category > ${initialSubcategory}`]
              : [],
          },
        },
      },
    }),
    [category, initialSubcategory, initialLocation]
  );

  return (
    <InstantSearch {...searchConfig}>
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

/*export default function BrowseView({
  category,
  initialSubcategory = null,
  initialLocation = null,
}: BrowseViewProps) {
  const isFirstRender = useRef(true);

  // Create configuration for InstantSearch with both location and subcategory
  const searchConfig = useMemo(
    () => ({
      searchClient,
      indexName: "used-objects",
      routing,
      initialUiState: isFirstRender.current
        ? {
            "used-objects": {
              refinementList: {
                town: initialLocation ? [initialLocation] : [],
                category_hierarchy: initialSubcategory
                  ? [`Category > ${initialSubcategory}`]
                  : [],
              },
            },
          }
        : undefined,
    }),
    [initialLocation, initialSubcategory]
  );

  // Basic configuration that doesn't interfere with refinements
  const baseConfig = useMemo(
    () => ({
      filters: `category_hierarchy:"${category}"`,
      hitsPerPage: 20,
    }),
    [category]
  );

  // Track if this is first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, []);

  return (
    <InstantSearch<SearchUiState> {...searchConfig}>
      <SearchContent
        category={category}
        initialSubcategory={initialSubcategory}
        initialLocation={initialLocation}
      />
      <Configure {...baseConfig} />
    </InstantSearch>
  );
}
*/
