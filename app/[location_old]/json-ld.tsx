// app/[location]/json-ld.tsx
import { siteConfig } from '@/config/site';
import { fetchItemsWithFacets } from "@/lib/search";



// app/[location]/json-ld.tsx
export async function generateJsonLd(locationParam: string) {
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
            "name": locationParam,
            "@id": `${siteConfig.url}/${encodeURIComponent(locationParam.toLowerCase())}`
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Second hand items in ${locationParam}`,
      "description": `Browse second hand items for sale in ${locationParam} and surrounding areas`,
      "url": `${siteConfig.url}/${encodeURIComponent(locationParam.toLowerCase())}`
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

// app/[location]/[category]/json-ld.tsx
export async function generateCategoryJsonLd(
  locationParam: string,
  categoryParam: string
) {
  const normalizedCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase();

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
            "name": locationParam,
            "@id": `${siteConfig.url}/${encodeURIComponent(locationParam.toLowerCase())}`
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "WebPage",
            "name": normalizedCategory,
            "@id": `${siteConfig.url}/${encodeURIComponent(locationParam.toLowerCase())}/${encodeURIComponent(categoryParam.toLowerCase())}`
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${normalizedCategory} in ${locationParam}`,
      "description": `Browse second hand ${normalizedCategory} for sale in ${locationParam} and surrounding areas`,
      "url": `${siteConfig.url}/${encodeURIComponent(locationParam.toLowerCase())}/${encodeURIComponent(categoryParam.toLowerCase())}`
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


/*

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
}*/