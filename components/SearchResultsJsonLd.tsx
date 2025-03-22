'use client';

import { useEffect, useState } from 'react';
import { ResultItem } from '@/hooks/used-object-search';

interface SearchResultsJsonLdProps {
  results: ResultItem[];
  query: string;
  postcode?: string;
}

export default function SearchResultsJsonLd({ results, query, postcode }: SearchResultsJsonLdProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || results.length === 0) {
    return null;
  }

  // Create JSON-LD data for search results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `Search results for "${query}"${postcode ? ` near ${postcode}` : ''}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: results.slice(0, 10).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: item.name,
          description: item.description,
          image: item.image_url,
          url: item.url,
          offers: {
            '@type': 'Offer',
            price: item.price === 'Free' || !item.price ? '0' : item.price.replace(/[^0-9.]/g, ''),
            priceCurrency: 'GBP',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: item.site
            }
          },
          ...(item.location && {
            location: {
              '@type': 'Place',
              name: item.location
            }
          })
        }
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 