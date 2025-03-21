'use client';

import { useState, useEffect } from 'react';
import { ResultItem, Marketplaces } from './used-object-search';

type StreamingSearchProps = {
  query: string;
  postcode: string;
  radius: number;
  marketplaces: Marketplaces;
};

export function useStreamingSearch() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const search = async ({ query, postcode, radius, marketplaces }: StreamingSearchProps) => {
    // Reset state
    setResults([]);
    setError(null);
    setIsLoading(true);
    setIsComplete(false);

    // Get selected marketplaces
    const selectedSites = Object.keys(marketplaces)
      .filter(site => marketplaces[site].selected)
      .join(',');

    // Build URL with search parameters
    const url = new URL('/api/stream-search', window.location.origin);
    url.searchParams.append('query', query);
    if (postcode) url.searchParams.append('postcode', postcode);
    url.searchParams.append('radius', radius.toString());
    if (selectedSites) url.searchParams.append('sites', selectedSites);

    try {
      // Create EventSource for SSE connection
      const eventSource = new EventSource(url.toString());

      // Handle incoming events
      eventSource.addEventListener('result', (event) => {
        const newItem = JSON.parse(event.data) as ResultItem;
        setResults(prev => [...prev, newItem]);
      });

      eventSource.addEventListener('complete', () => {
        setIsComplete(true);
        setIsLoading(false);
        eventSource.close();
      });

      eventSource.addEventListener('error', (event) => {
        setError('Error connecting to search stream');
        setIsLoading(false);
        eventSource.close();
      });

      // Clean up function
      return () => {
        eventSource.close();
      };
    } catch (err) {
      setError('Failed to initialize search stream');
      setIsLoading(false);
    }
  };

  return {
    results,
    isLoading,
    error,
    isComplete,
    search
  };
} 