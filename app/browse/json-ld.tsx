// app/browse/json-ld.tsx
import { siteConfig } from '@/config/site';
import { fetchBrowseIndexWithFacets } from "@/lib/browseSearch";
import { slugify } from '@/lib/slugify';
export async function generateJsonLd() {
 const { categories } = await fetchBrowseIndexWithFacets();

 const categoryListSchema = {
   "@context": "https://schema.org",
   "@type": ["SearchResultsPage", "ItemList"],
   "itemListElement": categories.map((category, index) => ({
     "@type": "ListItem",
     "position": index,
     "url": `${siteConfig.url}/browse/${slugify(category.name)}`,
     "name": `${category.name} (${category.count} items)`
   }))
 };

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
         "name": "Browse Categories",
         "@id": `${siteConfig.url}/browse`
       }
     }
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
         __html: JSON.stringify(categoryListSchema)
       }}
     />
   </>
 );
}