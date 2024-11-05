import { fetchUniqueTowns } from '@/lib/locations';
import { slugify } from '@/lib/slugify'; // Adjust the import path

export async function GET() {
  let locations_subdir=`` // leave blank, or eg locations/ for recycle.co.uk/locations/london etc
  const baseUrl = process.env.ROOT_DOMAIN; // Ensure this is correctly set in your .env

  try {
    // Fetch unique towns from the database
    const towns = await fetchUniqueTowns();

    // Create the XML sitemap content
    const sitemapEntries = towns.map((town) => {
      const slug = slugify(town); // Generate the slug
      return `
        <url>
          <loc>${baseUrl}/${locations_subdir}${slug}</loc>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `;
    }).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${sitemapEntries}
    </urlset>`;

    // Return raw XML as a response
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
