// This is a server component (no "use client" directive)
import { Suspense } from 'react';
import { Metadata } from 'next';
import ClientHome from '@/components/ClientHome'

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Recycle.co.uk | Find Free & Used Items Near You',
  description: 'Search for free and used items in your local area. Recycle and reuse items from your community.',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <ClientHome />
      </Suspense>
    </main>
  );
}