// app/browse/[category]/json-ld.tsx
import { siteConfig } from '@/config/site';
import { fetchBrowseItemsWithFacets } from "@/lib/browseSearch";

export async function generateJsonLd(
  categoryParam: string,
  selectedSubcategory: string | null,
  location: string | null
) {
  const { items, total } = await fetchBrowseItemsWithFacets(
    categoryParam,
    selectedSubcategory,
    location
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["SearchResultsPage", "ItemList"],
            "itemListElement": items.map((item, index) => ({
              "@type": "ListItem",
              "position": index,
              "url": `${siteConfig.url}/item/${item.objectID}`,
              "name": item.name
            }))
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                  "name": "Browse Categories",
                  "@id": `${siteConfig.url}/browse`
                }
              },
              {
                "@type": "ListItem",
                "position": 3,
                "item": {
                  "@type": "WebPage",
                  "name": categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1),
                  "@id": `${siteConfig.url}/browse/${categoryParam}`
                }
              },
              ...(selectedSubcategory ? [{
                "@type": "ListItem",
                "position": 4,
                "item": {
                  "@type": "WebPage",
                  "name": selectedSubcategory,
                  "@id": `${siteConfig.url}/browse/${categoryParam}?subcategory=${encodeURIComponent(selectedSubcategory)}`
                }
              }] : [])
            ]
          })
        }}
      />
    </>
  );
}