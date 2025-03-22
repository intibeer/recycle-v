import { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import JsonLd from '@/components/JsonLd';

// Define the props type for the page
type Props = {
  params: { category: string };
};

// Dynamically import the component with SSR disabled
const DynamicUsedObjectSearch = dynamic(
  () => import('@/hooks/used-object-search'),
  { ssr: false }
);

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
  const formattedCategoryName = categoryName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Create JSON-LD data for the category page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Free ${formattedCategoryName} | Recycle.co.uk`,
    description: `Find free and used ${categoryName} near you. Recycle and reuse items from your local community.`,
    url: `https://recycle.co.uk/${params.category}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Product',
            name: `Free ${formattedCategoryName}`,
            description: `Browse free and used ${categoryName} available in your local area.`,
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'GBP',
              lowPrice: '0',
              highPrice: '100',
              offerCount: '100+',
              availability: 'https://schema.org/InStock'
            },
            category: formattedCategoryName
          }
        }
      ]
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://recycle.co.uk'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: formattedCategoryName,
          item: `https://recycle.co.uk/${params.category}`
        }
      ]
    }
  };
  
  return (
    <main className="min-h-screen">
      <JsonLd data={jsonLd} />
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <DynamicUsedObjectSearch initialCategory={categoryName} />
      </Suspense>
    </main>
  );
}