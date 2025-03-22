// This is a server component (no "use client" directive)
import { Suspense } from 'react';
import { Metadata } from 'next';
import ClientHome from '@/components/ClientHome'
import JsonLd from '@/components/JsonLd';

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Recycle.co.uk | Find Free & Used Items Near You',
  description: 'Search for free and used items in your local area. Recycle and reuse items from your community.',
};

export default function Home() {
  // Create JSON-LD data for the homepage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Recycle.co.uk',
    url: 'https://recycle.co.uk',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://recycle.co.uk/?query={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    description: 'Search for free and used items in your local area. Recycle and reuse items from your community.',
    publisher: {
      '@type': 'Organization',
      name: 'Recycle.co.uk',
      logo: {
        '@type': 'ImageObject',
        url: 'https://recycle.co.uk/logo.png'
      }
    }
  };

  return (
    <main className="min-h-screen">
      <JsonLd data={jsonLd} />
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <ClientHome />
      </Suspense>
    </main>
  );
}