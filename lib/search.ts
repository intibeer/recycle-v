import algoliasearch from "algoliasearch";

const client = algoliasearch("LCJ8YL7RLE", "ec319a204d0b72f8d17a4611a96aaa46");
const index = client.initIndex("used-objects");
import { ResultItem } from "@/hooks/used-object-search"; // Import the ResultItem type

export async function fetchItemsByCategoryWithFacets(
  category: string,
  location: string,
  subcategory: string | null
): Promise<{
  items: ResultItem[];
  total: number;
  subcategoryFacets: { value: string; count: number }[];
}> {
  try {
    // Normalize category name to match what's in Algolia
    const normalizedCategory =
      category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    // First query to get all items for this location/category to find subcategories
    const initialResponse = await index.search("", {
      filters: `town:"${location}" AND category_hierarchy:"${normalizedCategory}"`,
      hitsPerPage: 100,
    });

    // Get unique subcategories from the results
    const subcategoryCounts: Record<string, number> = {};
    initialResponse.hits.forEach((hit: any) => {
      if (hit.category_hierarchy && Array.isArray(hit.category_hierarchy)) {
        hit.category_hierarchy.forEach((path: string) => {
          if (path.startsWith(`${normalizedCategory} > `)) {
            const subcategory = path.split(" > ")[1];
            subcategoryCounts[subcategory] =
              (subcategoryCounts[subcategory] || 0) + 1;
          }
        });
      }
    });

    // Convert to required format and sort
    const subcategoryFacets = Object.entries(subcategoryCounts)
      .map(([value, count]) => ({
        value,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    console.log("Subcategories found:", subcategoryFacets);

    // Build filters for final items query
    const itemFilters = `town:"${location}" AND category_hierarchy:"${normalizedCategory}"${
      subcategory
        ? ` AND category_hierarchy:"${normalizedCategory} > ${subcategory}"`
        : ""
    }`;

    console.log("Final filters:", itemFilters);

    // Get filtered items
    const itemsResponse = await index.search("", {
      filters: itemFilters,
      hitsPerPage: 100,
    });

    const items: ResultItem[] = itemsResponse.hits.map((hit: any) => ({
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
      total: itemsResponse.nbHits,
      subcategoryFacets,
    };
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
}



// New function to fetch items by location only
export async function fetchItemsByLocationWithFacets(
  location: string
): Promise<{
  items: ResultItem[];
  total: number;
  categoryFacets: { value: string; count: number }[];
}> {
  try {
    const response = await index.search("", {
      filters: `town:"${location}"`,
      hitsPerPage: 100,
    });

    console.log('Total hits:', response.nbHits);
    const firstHit = response.hits[0] as any;
    console.log('Sample hit:', firstHit);
    console.log('Sample category_hierarchy:', firstHit?.category_hierarchy);

    // Get unique main categories from the results
    const categoryCounts: Record<string, number> = {};
    response.hits.forEach((hit: any) => {
      console.log('Processing hit category_hierarchy:', hit.category_hierarchy);
      if (hit.category_hierarchy && Array.isArray(hit.category_hierarchy)) {
        const mainCategory = hit.category_hierarchy[0];
        console.log('Found main category:', mainCategory);
        if (mainCategory) {
          categoryCounts[mainCategory] = (categoryCounts[mainCategory] || 0) + 1;
        }
      }
    });

    console.log('Category counts:', categoryCounts);

    const categoryFacets = Object.entries(categoryCounts)
      .map(([value, count]) => ({
        value,
        count
      }))
      .sort((a, b) => b.count - a.count);

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
      categoryFacets,
    };
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
}


export async function fetchItemsWithFacets(
  location: string,
  category?: string,
  subcategory?: string | null
): Promise<{
  items: ResultItem[];
  total: number;
  facets: { value: string; count: number }[];
}> {
  try {
    // Build filters based on params
    let filters = `town:"${location}"`;

    if (category) {
      const normalizedCategory =
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      filters += ` AND category_hierarchy:"${normalizedCategory}"`;

      // Convert subcategory from null to undefined if needed
      if (subcategory) {
        filters += ` AND category_hierarchy:"${normalizedCategory} > ${subcategory}"`;
      }
    }

    const response = await index.search("", {
      filters,
      hitsPerPage: 100,
    });

    // Get categories/subcategories from results
    const facetCounts: Record<string, number> = {};

    response.hits.forEach((hit: any) => {
      if (hit.category_hierarchy && Array.isArray(hit.category_hierarchy)) {
        if (category) {
          // If category is provided, look for subcategories
          hit.category_hierarchy.forEach((path: string) => {
            if (path.startsWith(`${category} > `)) {
              const sub = path.split(" > ")[1];
              facetCounts[sub] = (facetCounts[sub] || 0) + 1;
            }
          });
        } else {
          // If no category, get main categories
          const mainCategory = hit.category_hierarchy[0];
          if (mainCategory) {
            facetCounts[mainCategory] = (facetCounts[mainCategory] || 0) + 1;
          }
        }
      }
    });

    const facets = Object.entries(facetCounts)
      .map(([value, count]) => ({
        value,
        count,
      }))
      .sort((a, b) => b.count - a.count);

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
      facets,
    };
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
}



/*
export interface ResultItem {
  objectID: string;          // Unique identifier for the item
  name: string;              // Name of the item
  description: string;       // Description of the item
  image_url: string;         // URL of the item's image
  url: string;               // Link to the item
  date: string;              // Date when the item was posted
  time_posted: string;       // Timestamp of when the item was added
  price: string;             // Price of the item
  href: string;              // Another link related to the item
  location: string;          // Geographical location of the item
  site: string;              // Site or platform where the item is listed
  lat: number;               // Latitude for geolocation
  lon: number;               // Longitude for geolocation
  town: string;              // Town name
  region: string;            // Region name
  country: string;           // Country name
  _geoloc: {                 // Geolocation object
    lat: number;             // Latitude
    lng: number;             // Longitude
  };
  distance?: number;         // Optional distance from a reference point
}
*/


/*
export async function fetchItemsByTypeAndLocation(
  type: string,
  location: string
): Promise<ResultItem[]> {
  // Create a filter string to search for items in the specified town
  const locationFilter = `town:"${location}"`; // Exact match for town

  // Build a filter for the type to match within the category_json structure
  const typeFilter = `(category_json.categories.category:"${type}" OR category_json.categories.subcategories:"${type}")`;

  // Combine both filters
  const filterString = `${locationFilter} AND ${typeFilter}`;

  // Perform the search with both filters
  const response = await index.search("", {
    filters: filterString,
    hitsPerPage: 100,
  });

  // Map the response to ensure it fits the ResultItem structure
  return response.hits.map((hit: any) => ({
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
    lat: hit.lat || 0,
    lon: hit.lon || 0,
    town: hit.town || "",
    region: hit.region || "",
    country: hit.country || "",
    _geoloc: hit._geoloc || { lat: 0, lng: 0 },
    distance: hit.distance || 0,
  }));
}*/