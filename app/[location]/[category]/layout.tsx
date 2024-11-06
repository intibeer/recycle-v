// app/[location]/[category]/layout.tsx
import { generateJsonLd } from './json-ld';
import { Metadata } from 'next';
import { fetchItemsWithFacets } from "@/lib/search";

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: {
    location: string;
    category: string;
  };
}

export default async function CategoryLayout({
  children,
  params,
}: CategoryLayoutProps) {
  const locationParam = decodeURIComponent(params.location);
  const categoryParam = decodeURIComponent(params.category);

  // Generate JSON-LD without subcategory
  // The subcategory filtering will be handled at the data fetching level
  const jsonLd = await generateJsonLd(locationParam, categoryParam);

  return (
    <>
      {jsonLd}
      {children}
    </>
  );
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: CategoryLayoutProps): Promise<Metadata> {
  const locationParam = decodeURIComponent(params.location);
  const categoryParam = decodeURIComponent(params.category);

  const { items } = await fetchItemsWithFacets(
    locationParam,
    categoryParam
  );

  // Get proper location and category names from first item if available
  const properLocation = items.length > 0 ? items[0].town : locationParam;
  const properCategory = items.length > 0 && items[0].category_hierarchy?.length > 0
    ? items[0].category_hierarchy[0]
    : categoryParam;

  const title = `${properCategory} in ${properLocation}`;
  const description = `Browse second-hand ${properCategory} items for sale in ${properLocation}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}