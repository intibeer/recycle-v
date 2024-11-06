// app/[location]/[category]/json-ld.tsx
import { siteConfig } from '@/config/site';
import { fetchItemsWithFacets } from "@/lib/search";

export async function generateJsonLd(
  locationParam: string,
  categoryParam: string
) {
  const { items, total, facets } = await fetchItemsWithFacets(
    locationParam,
    categoryParam
  );

  // Get proper location and category from first item if available
  const properLocation = items.length > 0 ? items[0].town : locationParam;
  const properCategory = items.length > 0 && items[0].category_hierarchy?.length > 0
    ? items[0].category_hierarchy[0]
    : categoryParam;

  const schema = [
    {
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
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "WebPage",
            "name": properCategory,
            "@id": `${siteConfig.url}/${encodeURIComponent(locationParam.toLowerCase())}/${encodeURIComponent(categoryParam.toLowerCase())}`
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${properCategory} in ${properLocation}`,
      "description": `Browse ${total} second-hand ${properCategory} items for sale in ${properLocation}`,
      "numberOfItems": total,
      "breadcrumb": {
        "@id": `${siteConfig.url}/${encodeURIComponent(locationParam.toLowerCase())}/${encodeURIComponent(categoryParam.toLowerCase())}#breadcrumb`
      },
      "hasPart": facets.map(subcategory => ({
        "@type": "WebPage",
        "name": subcategory.value,
        "description": `${subcategory.count} items in ${subcategory.value}`,
        "url": `${siteConfig.url}/${encodeURIComponent(locationParam.toLowerCase())}/${encodeURIComponent(categoryParam.toLowerCase())}?subcategory=${encodeURIComponent(subcategory.value)}`
      }))
    }
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}