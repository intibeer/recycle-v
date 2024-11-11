"use client";

import { useRefinementList, useInstantSearch } from "react-instantsearch";
import Link from "next/link";
import { useParams } from "next/navigation";

interface RouteParams {
  category?: string;
  location?: string;
  subcategory?: string;
  [key: string]: string | string[] | undefined;
}
function sanitizeForUrl(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "");
}

function SubcategoryNav({
  category,
  location,
  className = "",
}: {
  category: string;
  location: string;
  className?: string;
}) {
  const routeParams = useParams() as RouteParams;

  const { items } = useRefinementList({ attribute: "category_hierarchy" });

  const { results } = useInstantSearch();

  // Log InstantSearch state
  console.log("InstantSearch Debug:", {
    currentFilters: results?.state?.filters,
    facetFilters: results?.state?.facetFilters,
    params: results?.params,
    totalHits: results?.nbHits,
  });

  console.log("Initial items from refinementList:", {
    count: items?.length,
    items: items?.map((item) => ({
      label: item.label,
      count: item.count,
      isRefined: item.isRefined,
    })),
  });

  console.log("1. All raw refinement items:", items);

  const relevantItems = items.filter((item) => {
    const [parentCategory] = item.label.split(" > ");
    const isRelevant = parentCategory?.toLowerCase() === category.toLowerCase();

    console.log("Category check:", {
      itemLabel: item.label,
      parentCategory,
      categoryToMatch: category.toLowerCase(),
      isRelevant,
      refinementCount: item.count,
      isRefined: item.isRefined,
    });

    return isRelevant;
  });

  console.log("After category filter:", {
    originalCount: items?.length,
    filteredCount: relevantItems.length,
    items: relevantItems.map(item => ({
      label: item.label,
      count: item.count
    }))
  });

  const subcategories = relevantItems
    .filter((item) => {
      const [parent, sub] = item.label.split(" > ");
      const hasSubcategory = Boolean(sub);
      console.log("Subcategory check:", {
        label: item.label,
        hasSubcategory,
        parent,
        sub
      });
      return hasSubcategory;
    })
    .map((item) => {
      const subcategoryName = item.label.split(" > ")[1];
      const urlSafe = sanitizeForUrl(subcategoryName);
      console.log("Processing subcategory:", {
        original: item.label,
        subcategoryName,
        urlSafe,
        count: item.count,
        isCurrentPage: routeParams.subcategory === urlSafe
      });
      return {
        name: subcategoryName,
        count: item.count,
        isActive: routeParams.subcategory === urlSafe,
        urlSafe,
      };
    });

  console.log("Final subcategories:", {
    total: subcategories.length,
    subcategories: subcategories.map(sub => ({
      name: sub.name,
      count: sub.count,
      isActive: sub.isActive,
      urlSafe: sub.urlSafe
    }))
  });
  return (
    <div className={`w-full ${className}`}>
      <div className="mb-2">
        <h2 className="text-lg font-medium text-gray-700">Browse by type</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/browse/${category}/${location}`}
          className={`
            px-4 py-2 rounded-full text-sm font-medium
            transition-colors duration-150 ease-in-out
            ${
              !routeParams.subcategory
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          All
        </Link>
        {subcategories.map((sub) => (
          <Link
            key={sub.name}
            href={`/browse/${category}/${location}/${sub.urlSafe}`}
            data-algolia-category={sub.name}
            className={`
              px-4 py-2 rounded-full text-sm font-medium
              transition-colors duration-150 ease-in-out
              ${
                routeParams.subcategory === sub.urlSafe
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
              flex items-center gap-2
            `}
          >
            <span>{sub.name}</span>
            <span className="text-xs opacity-75">({sub.count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SubcategoryNav;
