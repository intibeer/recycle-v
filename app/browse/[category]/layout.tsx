// app/browse/[category]/layout.tsx
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fetchBrowseItemsWithFacets } from "@/lib/browseSearch";
import { generateJsonLd } from "./json-ld";
import { slugToCategory, isValidCategorySlug } from "@/lib/categoryToSlug";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = slugToCategory(params.category);
  const { total } = await fetchBrowseItemsWithFacets(category, null, null);

  return {
    title: `Second Hand ${category} | ${siteConfig.name}`,
    description: `Browse second hand ${category} across the UK`,
    openGraph: {
      title: `Second Hand ${category}`,
      description: `Browse ${total} second hand ${category} items`,
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
  searchParams,
}: {
  children: React.ReactNode;
  params: { category: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!isValidCategorySlug(params.category)) {
    throw new Error("Invalid category slug");
  }

  const category = slugToCategory(params.category);

  // Get searchParams values safely using first array item if array
  const subcategory = Array.isArray(searchParams?.subcategory)
    ? searchParams.subcategory[0]
    : searchParams?.subcategory || null;
  const location = Array.isArray(searchParams?.location)
    ? searchParams.location[0]
    : searchParams?.location || null;

  const jsonLd = await generateJsonLd(category, subcategory, location);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
