// app/[location]/json-ld.tsx
import { siteConfig } from '@/config/site';
import { fetchItemsWithFacets } from "@/lib/search";

export async function generateJsonLd(
  locationParam: string
) {
  const { items, total, facets } = await fetchItemsWithFacets(locationParam);
  const properLocation = items.length > 0 ? items[0].town : locationParam;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "WebPage",
          "name": "Home",
          "@id": siteConfig.url
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "WebPage",
          "name": properLocation,
          "@id": `${siteConfig.url}/${encodeURIComponent(locationParam.toLowerCase())}`
        }
      }
    ]
  };

  // Single combined schema for all items
  const combinedResultsSchema = {
    "@context": "https://schema.org",
    "@type": ["SearchResultsPage", "ItemList"],
    "itemListElement": [
      // Categories first
      ...facets.map((category, index) => ({
        "@type": "ListItem",
        "position": index,
        "url": `${siteConfig.url}/${encodeURIComponent(locationParam.toLowerCase())}/${encodeURIComponent(category.value.toLowerCase())}`,
        "name": `${category.value} (${category.count} items)`
      })),
      // Then items
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + facets.length,
        "url": `${siteConfig.url}/item/${item.objectID}`,
        "name": item.name
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedResultsSchema)
        }}
      />
    </>
  );
}