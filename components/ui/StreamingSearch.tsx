'use client';

import React, { useState } from 'react';
import { useStreamingSearch } from '@/hooks/use-streaming-search';
import { Marketplaces } from '@/hooks/used-object-search';
import { ResultsList } from './ResultsList';

type StreamingSearchProps = {
  initialQuery?: string;
};

export default function  StreamingSearch({ initialQuery = '' }: StreamingSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [postcode, setPostcode] = useState('');
  const [radius, setRadius] = useState(10);
  
  const [marketplaces] = useState<Marketplaces>({
    'trashnothing.com': { selected: true, logo: 'trashnothing.webp' },
  });
  const [sortOption, setSortOption] = useState('featured');

  const { results, isLoading, error, isComplete, search } = useStreamingSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search({
      query,
      postcode,
      radius,
      marketplaces
    });
  };

  {/* Marketplace Selection 
  const handleMarketplaceChange = (site: string) => {
    setMarketplaces(prev => ({
      ...prev,
      [site]: {
        ...prev[site],
        selected: !prev[site].selected
      }
    }));
  };
*/}
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Streaming Search</h1>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="Postcode"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          
          <div className="w-full md:w-1/6">
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              min="1"
              max="100"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-custom-green text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {isLoading && !isComplete && (
        <div className="text-center">
          <p>Streaming results... Found {results.length} items so far</p>
          <div className="mt-2 w-8 h-8 border-t-2 border-b-2 border-custom-green rounded-full animate-spin mx-auto"></div>
        </div>
      )}
      
      <ResultsList
        loading={isLoading && results.length === 0}
        hasSearched={results.length > 0 || isComplete}
        results={results}
        sortOption={sortOption}
        setSortOption={setSortOption}
        marketplaces={marketplaces}
      />
    </div>
  );
} 