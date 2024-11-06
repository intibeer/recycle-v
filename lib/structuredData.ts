import { siteConfig } from '@/config/site';

export function generateHomePageSchema() {
 return {
   "@context": "https://schema.org",
   "@graph": [
     {
       "@type": "WebSite",
       "@id": `${siteConfig.url}/#website`,
       "name": siteConfig.name,
       "url": siteConfig.url,
       "potentialAction": {
         "@type": "SearchAction",
         "target": {
           "@type": "EntryPoint",
           "urlTemplate": `${siteConfig.url}/search?q={search_term_string}`
         },
         "query-input": "required name=search_term_string"
       }
     },
     {
       "@type": "Organization",
       "@id": `${siteConfig.url}/#organization`,
       "name": siteConfig.organization.name,
       "url": siteConfig.url,
       "logo": {
         "@type": "ImageObject",
         "url": siteConfig.organization.logo,
         "caption": siteConfig.organization.name
       }
     }
   ]
 };
}

interface Category {
    name: string;
    count: number;
    subcategories: { name: string; count: number }[];
  }
  
  export function generateBrowsePageSchema(categories: Category[]) {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "Thing",
                "name": "Home",
                "@id": siteConfig.url
              }
            },
            {
              "@type": "ListItem",
              "position": 2,
              "item": {
                "@type": "Thing",
                "name": "Browse Categories",
                "@id": `${siteConfig.url}/browse`
              }
            }
          ]
        },
        {
          "@type": "CollectionPage",
          "@id": `${siteConfig.url}/browse#webpage`,
          "url": `${siteConfig.url}/browse`,
          "name": "Browse Second Hand Items",
          "description": "Browse our collection of second hand items across various categories",
          "isPartOf": {
            "@id": `${siteConfig.url}/#website`
          },
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": categories.length,
            "itemListElement": categories.map((category, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "CollectionPage",
                "name": category.name,
                "url": `${siteConfig.url}/browse/${encodeURIComponent(category.name.toLowerCase())}`,
                "numberOfItems": category.count,
                "hasPart": category.subcategories.map(sub => ({
                  "@type": "CollectionPage",
                  "name": sub.name,
                  "url": `${siteConfig.url}/browse/${encodeURIComponent(category.name.toLowerCase())}?subcategory=${encodeURIComponent(sub.name)}`,
                  "numberOfItems": sub.count
                }))
              }
            }))
          }
        }
      ]
    };
  }