import { useRefinementList, useInstantSearch } from "react-instantsearch";
import Link from "next/link";

function sanitizeForUrl(str: string): string {
  return (
    str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]/g, "")
  );
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
  const { items } = useRefinementList({
    attribute: "category_hierarchy",
    limit: 10,
  });

  const { results } = useInstantSearch();

  // Log the raw items first
  console.log('Raw refinement items:', items.map(item => ({
    label: item.label,
    count: item.count,
    isRefined: item.isRefined
  })));

  // Filter for subcategories of the current category
  const relevantItems = items.filter(item => {
    const [parentCategory] = item.label.split(" > ");
    const isRelevant = parentCategory?.toLowerCase() === category.toLowerCase();
    console.log('Checking item relevance:', {
      itemLabel: item.label,
      parentCategory,
      categoryToMatch: category,
      isRelevant
    });
    return isRelevant;
  });

  console.log('Relevant items for category:', {
    category,
    items: relevantItems.map(item => ({
      label: item.label,
      count: item.count
    }))
  });

  const subcategories = relevantItems.map((item) => {
    const subcategoryName = item.label.split(" > ")[1] || item.label;
    const processed = {
      name: subcategoryName,
      count: item.count,
      isActive: item.isRefined,
      urlSafe: sanitizeForUrl(subcategoryName),
      originalLabel: item.label // Keep original for debugging
    };
    console.log('Processed subcategory:', processed);
    return processed;
  });

  console.log('Final subcategories:', {
    category,
    count: subcategories.length,
    subcategories
  });

  // Log sample results to verify categorization
  console.log('Sample results:', results?.hits?.slice(0, 3).map(hit => ({
    title: (hit as any).title,
    categories: (hit as any).category_hierarchy
  })));

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
              subcategories.every((s) => !s.isActive)
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
            data-original-label={sub.originalLabel}
            className={`
              px-4 py-2 rounded-full text-sm font-medium
              transition-colors duration-150 ease-in-out
              ${
                sub.isActive
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