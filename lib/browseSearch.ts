import { ResultItem } from "@/hooks/used-object-search";
import algoliasearch from "algoliasearch";

const client = algoliasearch("LCJ8YL7RLE", "ec319a204d0b72f8d17a4611a96aaa46");
const index = client.initIndex("used-objects");
import { getIndexCategory } from "@/lib/categoryMapping";

export async function fetchBrowseItemsWithFacets(
  category: string,
  subcategory?: string | null,
  location?: string | null
): Promise<{
  items: ResultItem[];
  total: number;
  facets: {
    locations: { value: string; count: number }[];
    subcategories: { value: string; count: number }[];
  };
}> {
  try {
    let filters = [];

    // Handle 'uncategorized' specially
    if (category.toLowerCase() === "uncategorized") {
      filters.push("NOT _exists_:category_hierarchy");
    } else {
      const properCategoryName = getIndexCategory(category);

      console.log("URL category:", category);
      console.log("Transformed to:", properCategoryName);

      filters.push(`category_hierarchy:"${properCategoryName}"`);

      if (subcategory) {
        filters.push(
          `category_hierarchy:"${properCategoryName} > ${subcategory}"`
        );
      }
    }
    // Add location filter if provided
    if (location) {
      filters.push(`town:"${location}"`);
    }

    // First, get total items count
    const categoryResponse = await index.search("", {
      filters:
        category.toLowerCase() === "uncategorized"
          ? "NOT _exists_:category_hierarchy"
          : `category_hierarchy:"${category}"`,
      hitsPerPage: 0,
    });

    // Then get filtered results
    const response = await index.search("", {
      filters: filters.join(" AND "),
      hitsPerPage: 100,
      facets: ["town"],
    });

    console.log("Search response:", {
      filters: filters.join(" AND "),
      totalHits: response.nbHits,
      sampleHit: response.hits[0],
    });

    // For uncategorized items, we don't need subcategory facets
    const subcategoryFacets =
      category.toLowerCase() === "uncategorized"
        ? [] // Empty subcategories for uncategorized items
        : [
            // Add "All Category" entry first with the total count
            { value: `All ${category}`, count: categoryResponse.nbHits },
            // Process subcategories as before
            ...processSubcategoryFacets(response.hits, category),
          ];

    // Process locations
    const locationFacets = processLocationFacets(response);

    const items: ResultItem[] = response.hits.map((hit: any) => ({
      objectID: hit.objectID,
      name: hit.name || "",
      description: hit.description || "",
      image_url: hit.image_url || "",
      url: hit.url || "",
      date: hit.date || "",
      time_posted: hit.time_posted || "",
      price: hit.price || "",
      href: hit.href || "",
      location: hit.location || "",
      site: hit.site || "",
      lat: Number(hit.lat) || 0,
      lon: Number(hit.lon) || 0,
      town: hit.town || "",
      region: hit.region || "",
      country: hit.country || "",
      _geoloc: {
        lat: Number(hit._geoloc?.lat) || 0,
        lng: Number(hit._geoloc?.lng) || 0,
      },
      distance: hit.distance,
      category_hierarchy: Array.isArray(hit.category_hierarchy)
        ? hit.category_hierarchy
        : [],
    }));

    return {
      items,
      total: response.nbHits,
      facets: {
        locations: locationFacets,
        subcategories: subcategoryFacets,
      },
    };
  } catch (error) {
    console.error("Browse search failed:", error);
    throw error;
  }
}

// Helper functions
function processSubcategoryFacets(hits: any[], category: string) {
  const subcategoryFacets: Record<string, number> = {};

  hits.forEach((hit: any) => {
    if (hit.category_hierarchy && Array.isArray(hit.category_hierarchy)) {
      hit.category_hierarchy.forEach((path: string) => {
        const parts = path.split(" > ");
        const mainCategory = parts[0];
        if (mainCategory.toLowerCase() === category.toLowerCase() && parts[1]) {
          const sub = parts[1];
          subcategoryFacets[sub] = (subcategoryFacets[sub] || 0) + 1;
        }
      });
    }
  });

  console.log("Processed subcategories:", subcategoryFacets);

  return Object.entries(subcategoryFacets)
    .map(([value, count]) => ({
      value,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

function processLocationFacets(response: any) {
  return response.facets?.town
    ? Object.entries(response.facets.town).map(([value, count]) => ({
        value,
        count: count as number,
      }))
    : [];
}

export async function fetchBrowseIndexWithFacets(): Promise<{
  categories: {
    name: string;
    count: number;
    subcategories: { name: string; count: number }[];
  }[];
}> {
  try {
    console.log("Starting browse index search...");

    // Get all items to analyze categories
    const response = await index.search("", {
      hitsPerPage: 1000,
      // Get more attributes to see what we can use
      attributesToRetrieve: [
        "category_hierarchy",
        "category",
        "type",
        "objectID",
      ],
    });

    console.log("Search response:", {
      totalHits: response.nbHits,
      sampleHit: response.hits[0],
      availableAttributes: Object.keys(response.hits[0] || {}),
    });

    // Process categories and their subcategories
    const categoryMap = new Map<
      string,
      {
        count: number;
        subcategories: Map<string, number>;
      }
    >();

    response.hits.forEach((hit: any) => {
      let category = null;
      let subcategory = null;

      // Try different attributes for categorization
      if (hit.category_hierarchy && Array.isArray(hit.category_hierarchy)) {
        const parts = hit.category_hierarchy[0]?.split(" > ") || [];
        category = parts[0];
        subcategory = parts[1];
      } else if (hit.category) {
        // Fallback to single category if available
        category = hit.category;
      } else if (hit.type) {
        // Could use type as another fallback
        category = hit.type;
      } else {
        // Last resort
        category = "Uncategorized";
      }

      console.log("Processing item:", {
        objectID: hit.objectID,
        foundCategory: category,
        foundSubcategory: subcategory,
        originalData: {
          category_hierarchy: hit.category_hierarchy,
          category: hit.category,
          type: hit.type,
        },
      });

      if (category) {
        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            count: 0,
            subcategories: new Map(),
          });
        }
        categoryMap.get(category)!.count++;

        if (subcategory) {
          const subMap = categoryMap.get(category)!.subcategories;
          subMap.set(subcategory, (subMap.get(subcategory) || 0) + 1);
        }
      }
    });

    console.log("Category map:", Array.from(categoryMap.entries()));

    const categories = Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        subcategories: Array.from(data.subcategories.entries())
          .map(([name, count]) => ({
            name,
            count,
          }))
          .sort((a, b) => b.count - a.count),
      }))
      .sort((a, b) => b.count - a.count);

    console.log("Final processed categories:", categories);

    return { categories };
  } catch (error) {
    console.error("Browse index search failed:", error);
    throw error;
  }
}
export const revalidate = 3600; // Revalidate once per hour
