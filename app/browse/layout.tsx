// app/browse/layout.tsx
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fetchBrowseIndexWithFacets } from "@/lib/browseSearch";
import { generateJsonLd } from './json-ld';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Browse Second Hand Items | ${siteConfig.name}`,
    description: "Browse our collection of second hand items across various categories",
    openGraph: {
      title: "Browse Second Hand Items",
      description: "Browse our collection of second hand items across various categories",
      url: `${siteConfig.url}/browse`,
    },
    alternates: {
      canonical: `${siteConfig.url}/browse`,
    },
  };
}

export default async function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate the JSON-LD markup
  const jsonLd = await generateJsonLd();

  return (
    <>
      {jsonLd}
      {children}
    </>
  );
}