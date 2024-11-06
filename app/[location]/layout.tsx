// app/[location]/layout.tsx
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { generateJsonLd } from './json-ld';
import { fetchItemsWithFacets } from "@/lib/search";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { location: string };
}): Promise<Metadata> {
  const locationParam = decodeURIComponent(params.location);
  const { items, total } = await fetchItemsWithFacets(locationParam);
  
  // Get proper location name from first result if available
  const properLocation = items.length > 0 ? items[0].town : locationParam;

  return {
    title: `Second Hand Items in ${properLocation} | ${siteConfig.name}`,
    description: `Browse second hand items in ${properLocation} and surrounding towns`,
    openGraph: {
      title: `Second Hand Items in ${properLocation}`,
      description: `Browse ${total} second hand items in ${properLocation} and surrounding towns`,
      url: `${siteConfig.url}/${encodeURIComponent(locationParam.toLowerCase())}`,
    },
    alternates: {
      canonical: `${siteConfig.url}/${encodeURIComponent(locationParam.toLowerCase())}`,
    },
  };
}

export default async function LocationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { location: string };
}) {
  const locationParam = decodeURIComponent(params.location);
  const jsonLd = await generateJsonLd(locationParam);

  return (
    <>
      {jsonLd}
      {children}
    </>
  );
}