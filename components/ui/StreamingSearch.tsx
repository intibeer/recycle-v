'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Item } from '@/types/item';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Calendar, Clock } from 'lucide-react';
import Image from 'next/image';


interface StreamingSearchProps {
  query: string;
  postcode?: string;
  radius?: number;
  sites?: string[];
  sortBy?: string;
  onTotalItemsChange?: (total: number | null) => void;
}

const StreamingSearch: React.FC<StreamingSearchProps> = ({ query, postcode, radius, sites, sortBy = 'relevance', onTotalItemsChange }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchComplete, setSearchComplete] = useState(false);
  const [totalItems, setTotalItems] = useState<number | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Reset state for new search
    setItems([]);
    setError(null);
    setSearchComplete(false);
    setTotalItems(null);
    setLoading(true);

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Build the search URL with parameters
    const searchParams = new URLSearchParams();
    if (query) searchParams.append('query', query);
    if (postcode) searchParams.append('postcode', postcode);
    if (radius) searchParams.append('radius', radius.toString());
    if (sites && sites.length > 0) searchParams.append('sites', sites.join(','));
    if (sortBy) searchParams.append('sort', sortBy);

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
        setItems((prevItems) => [...prevItems, item]);
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
      
      setSearchComplete(true);
      setLoading(false);
      eventSource.close();
    });

    // Handle errors
    eventSource.addEventListener('error', () => {
      setError('Error connecting to search service');
      setLoading(false);
      eventSource.close();
    });

    // Notify parent component when totalItems changes
    if (onTotalItemsChange) {
      onTotalItemsChange(totalItems);
    }

    // Clean up on unmount
    return () => {
      eventSource.close();
    };
  }, [query, postcode, radius, sites, sortBy, onTotalItemsChange]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      {loading && !searchComplete && items.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-green"></div>
        </div>
      )}

      {items.length === 0 && searchComplete && (
        <div className="text-center p-8">
          <h3 className="text-xl font-medium">No items found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card 
            key={item.objectID} 
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
            onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
          >
            <div className="cursor-pointer">
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                {item.image_url ? (
                  <Image 
                    src={item.image_url} 
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      // Fallback for broken images
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <Badge className="absolute top-2 right-2 bg-custom-green">{item.site}</Badge>
              </div>

              <CardHeader className="p-4 pb-0">
                <h3 className="font-medium text-lg line-clamp-2">{item.name}</h3>
              </CardHeader>

              <CardContent className="p-4 pt-2">
                <p className="text-gray-600 text-sm line-clamp-3 mb-2">{item.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <MapPin size={14} className="mr-1" />
                  <span className="truncate">{item.location}</span>
                  {item.distance !== undefined && (
                    <span className="ml-1">({item.distance.toFixed(1)} km)</span>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>{item.date}</span>
                  <Clock size={14} className="ml-2 mr-1" />
                  <span>{item.time_posted}</span>
                </div>
              </CardContent>
            </div>

            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div>
                {item.price && item.price !== '0.00' ? (
                  <span className="font-semibold text-custom-green">£{item.price}</span>
                ) : (
                  <span className="font-semibold text-custom-green">Free</span>
                )}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Stop event from bubbling up to the card
                  window.open(item.url, '_blank', 'noopener,noreferrer');
                }}
                className="text-sm flex items-center text-blue-600 hover:text-blue-800"
              >
                View <ExternalLink size={14} className="ml-1" />
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {loading && items.length > 0 && (
        <div className="flex justify-center items-center h-20 mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-custom-green"></div>
          <span className="ml-3 text-gray-600">Loading more results...</span>
        </div>
      )}

      {searchComplete && items.length > 0 && (
        <div className="text-center mt-8 text-gray-600">
          <p>
            {totalItems !== null 
              ? `Showing ${items.length} of ${totalItems} items` 
              : `Found ${items.length} items`}
          </p>
        </div>
      )}
    </div>
  );
};

export default StreamingSearch; 