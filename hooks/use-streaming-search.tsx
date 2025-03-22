'use client';

import { useState, useEffect, useRef } from 'react';
import { ResultItem, Marketplaces } from './used-object-search';

type StreamingSearchOptions = {
  query: string;
  postcode?: string;
  radius?: number;
  marketplaces?: any;
  sortBy?: string;
};

export function useStreamingSearch() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const search = (options: StreamingSearchOptions) => {
    // Reset state for new search
    setResults([]);
    setError(null);
    setIsComplete(false);
    setTotalItems(null);
    setIsLoading(true);

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Build the search URL with parameters
    const searchParams = new URLSearchParams();
    if (options.query) searchParams.append('query', options.query);
    if (options.postcode) searchParams.append('postcode', options.postcode);
    if (options.radius) searchParams.append('radius', options.radius.toString());
    
    // Add selected marketplaces
    if (options.marketplaces) {
      const selectedSites = Object.keys(options.marketplaces)
        .filter(site => options.marketplaces[site].selected);
      
      if (selectedSites.length > 0) {
        searchParams.append('sites', selectedSites.join(','));
      }
    }

    // Add sort parameter
    if (options.sortBy) {
      searchParams.append('sort', options.sortBy);
    }

    const searchUrl = `/api/stream-search?${searchParams.toString()}`;
    
    // Create a new EventSource connection
    const eventSource = new EventSource(searchUrl);
    eventSourceRef.current = eventSource;

    // Handle connection open
    eventSource.addEventListener('open', () => {
      console.log('Connection established');
    });

    // Handle search results
    eventSource.addEventListener('result', (event) => {
      try {
        const item = JSON.parse(event.data);
        setResults((prevResults) => [...prevResults, item]);
      } catch (err) {
        console.error('Error parsing result:', err);
      }
    });

    // Handle search completion
    eventSource.addEventListener('complete', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && typeof data.total === 'number') {
          setTotalItems(data.total);
        }
      } catch (err) {
        console.error('Error parsing completion data:', err);
      }
      
      setIsComplete(true);
      setIsLoading(false);
      eventSource.close();
    });

    // Handle errors
    eventSource.addEventListener('error', () => {
      setError('Error connecting to search service');
      setIsLoading(false);
      eventSource.close();
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    results,
    isLoading,
    isComplete,
    error,
    totalItems,
    search
  };
} 