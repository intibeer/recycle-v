import { Suspense } from 'react';
import UsedObjectSearch from '@/hooks/used-object-search';
import { Metadata } from 'next';

// Define the props type for the page
type Props = {
  params: { category: string };
};

// Generate metadata for SEO
export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const category = params.category.replace(/-/g, ' ');
  const formattedCategory = category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `Free ${formattedCategory} | Recycle.co.uk`,
    description: `Find free and used ${category} near you. Recycle and reuse items from your local community.`,
  };
}

// This function tells Next.js which paths to pre-render
export async function generateStaticParams() {
  // List all possible category slugs
  const categories = [
    'baby-kids-stuff',
    'cameras-studio-equipment',
    'cds-dvds-games-books',
    'christmas-decorations',
    'clothing',
    'computers-software',
    'diy-tools-materials',
    'health-beauty',
    'home-garden',
    'house-clearance',
    'kitchen-appliances',
    'miscellaneous-goods',
    'music-instruments',
    'office-furniture-equipment',
    'phones',
    'sports-leisure-travel',
    'stereos-audio',
    'tv-dvd-cameras',
    'video-games-consoles',
  ];

  return categories.map(category => ({
    category,
  }));
}

export default function CategoryPage({ params }: Props) {
  // Format the category name for display
  const categoryName = params.category.replace(/-/g, ' ');
  
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <UsedObjectSearch initialCategory={categoryName} />
      </Suspense>
    </main>
  );
}