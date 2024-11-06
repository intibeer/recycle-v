// app/browse/[category]/layout.tsx
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fetchBrowseItemsWithFacets } from "@/lib/browseSearch";
import { generateJsonLd } from './json-ld';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const { total } = await fetchBrowseItemsWithFacets(
    params.category,
    null,
    null
  );
  
  return {
    title: `Second Hand ${
      params.category.charAt(0).toUpperCase() + params.category.slice(1)
    } | ${siteConfig.name}`,
    description: `Browse second hand ${params.category} across the UK`,
    openGraph: {
      title: `Second Hand ${
        params.category.charAt(0).toUpperCase() + params.category.slice(1)
      }`,
      description: `Browse ${total} second hand ${params.category} items`,
      url: `${siteConfig.url}/browse/${params.category}`,
    },
    alternates: {
      canonical: `${siteConfig.url}/browse/${params.category}`,
    },
  };
}

export default async function CategoryLayout({
  children,
  params,
  searchParams = {},  // Add default empty object
}: {
  children: React.ReactNode;
  params: { category: string };
  searchParams?: { [key: string]: string | string[] | undefined };  // Correct type
}) {
  // Get searchParams values safely
  const subcategory = typeof searchParams.subcategory === 'string' ? searchParams.subcategory : null;
  const location = typeof searchParams.location === 'string' ? searchParams.location : null;

  // Generate the JSON-LD markup
  const jsonLd = await generateJsonLd(
    params.category,
    subcategory,
    location
  );

  return (
    <>
      {jsonLd}
      {children}
    </>
  );
}