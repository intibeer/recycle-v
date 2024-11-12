// app/sitemap-index.xml/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

async function getAllCategories() {
  const { data } = await supabase
    .from("used-objects")
    .select("category_json")
    .not("category_json", "is", null);

  const categories = new Set<string>();

  data?.forEach((item) => {
    item.category_json?.categories?.forEach((cat: { category: string }) => {
      categories.add(cat.category);
    });
  });

  return Array.from(categories);
}

function generateSitemapIndex(categories: string[], baseUrl: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>${baseUrl}/sitemaps/base.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
      ${categories
        .map(
          (category) => `
        <sitemap>
          <loc>${baseUrl}/sitemaps/${slugify(category)}.xml</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
      `
        )
        .join("")}
    </sitemapindex>`;
}

export async function GET() {
  try {
    const categories = await getAllCategories();
    const baseUrl = process.env.ROOT_DOMAIN || "https://www.recycle.co.uk";
    const xml = generateSitemapIndex(categories, baseUrl);

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    return new NextResponse("Error generating sitemap index", { status: 500 });
  }
}
