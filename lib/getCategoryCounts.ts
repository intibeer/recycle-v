import algoliasearch from "algoliasearch";

const client = algoliasearch("LCJ8YL7RLE", "ec319a204d0b72f8d17a4611a96aaa46");
const index = client.initIndex("used-objects");

export async function getCategoryCounts() {
  try {
    const response = await index.search("", {
      hitsPerPage: 0, // We don't need the actual hits
      facets: ["category_hierarchy"], // Request faceting on category_hierarchy
      maxValuesPerFacet: 100, // Adjust this based on your needs
    });

    // Get the facet counts from the response
    const categoryFacets = response.facets?.["category_hierarchy"] || {};

    // Transform the facets into our desired format
    // Filter to only get top-level categories (those without ">")
    const categories = Object.entries(categoryFacets)
      .filter(([category]) => !category.includes(">"))
      .map(([value, count]) => ({
        value,
        count: count as number,
      }))
      .sort((a, b) => b.count - a.count);

    // Get count of items without categories
    const uncategorizedResponse = await index.search("", {
      hitsPerPage: 0,
      filters: "NOT _exists_:category_hierarchy",
    });

    // Add uncategorized count if there are any
    if (uncategorizedResponse.nbHits > 0) {
      categories.push({
        value: "Uncategorized",
        count: uncategorizedResponse.nbHits,
      });
    }

    return {
      total: response.nbHits,
      categories,
    };
  } catch (error) {
    console.error("Error fetching category counts:", error);
    throw error;
  }
}