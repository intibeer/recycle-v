// app/sitemaps/[category]/route.ts
import { NextRequest, NextResponse } from "next/server";
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

function generateSitemapXML(urls: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map(
          (url) => `
        <url>
          <loc>${url}</loc>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
          <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
        </url>
      `
        )
        .join("")}
    </urlset>`;
}

async function generateBaseSitemap() {
  const baseUrl = process.env.ROOT_DOMAIN || "https://www.recycle.co.uk";
  const urls = [
    baseUrl,
    `${baseUrl}/browse`,
    // Add other static pages here
  ];

  const xml = generateSitemapXML(urls);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
    },
  });
}

async function generateCategorySitemap(category: string) {
  const baseUrl = process.env.ROOT_DOMAIN || "https://www.recycle.co.uk";

  // First unslugify the incoming category
  const unslugifiedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  console.log("Unslugified category:", unslugifiedCategory); // Should show "Home Improvement"

  const { data: categoryData } = await supabase
    .from("used-objects")
    .select("category_json, town")
    .not("category_json", "is", null)
    .not("town", "is", null);

  const towns = new Set<string>();
  const subcategories = new Set<string>();

  categoryData?.forEach((item) => {
    if (item.town) {
      towns.add(item.town);
    }

    item.category_json?.categories?.forEach(
      (cat: { category: string; subcategories: string[] }) => {
        if (cat.category === unslugifiedCategory) {
          console.log("Match found:", cat);
          if (Array.isArray(cat.subcategories)) {
            cat.subcategories.forEach((subcategory) => {
              if (subcategory) {
                // Only add non-empty subcategories
                subcategories.add(subcategory);
              }
            });
          }
        }
      }
    );
  });

  console.log("Collected towns:", [...towns]);
  console.log("Collected subcategories:", [...subcategories]);

  const urls: string[] = [];
  const slugifiedCategory = slugify(category);

  // 1. Add category page
  urls.push(`${baseUrl}/browse/${slugifiedCategory}`);

  // 2. Add subcategory-only pages
  subcategories.forEach((subcategory) => {
    urls.push(`${baseUrl}/browse/${slugifiedCategory}/${slugify(subcategory)}`);
  });

  // 3. Add category + location pages
  towns.forEach((town) => {
    const slugifiedTown = slugify(town);
    urls.push(`${baseUrl}/browse/${slugifiedCategory}/${slugifiedTown}`);

    // 4. Add location + subcategory pages
    subcategories.forEach((subcategory) => {
      urls.push(
        `${baseUrl}/browse/${slugifiedCategory}/${slugifiedTown}/${slugify(
          subcategory
        )}`
      );
    });
  });

  const xml = generateSitemapXML(urls);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    // Remove .xml extension if present
    const category = params.category.replace(".xml", "");

    if (category === "base") {
      return generateBaseSitemap();
    }

    return generateCategorySitemap(category);
  } catch (error) {
    console.error("Error generating category sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
