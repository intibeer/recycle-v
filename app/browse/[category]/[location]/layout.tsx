// app/browse/[category]/[location]/layout.tsx
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

function formatLocation(locationSlug: string): string {
  return locationSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; location: string };
}): Promise<Metadata> {
  const location = formatLocation(params.location);
  const category = params.category.charAt(0).toUpperCase() + params.category.slice(1);

  return {
    title: `Second Hand ${category} in ${location} | ${siteConfig.name}`,
    description: `Browse second hand ${category.toLowerCase()} in ${location}`,
  };
}

export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}