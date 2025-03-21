// @ts-nocheck
'use client'

import { useState, useEffect } from 'react';
import { SearchForm } from '@/components/ui/SearchForm';
import { ResultsList } from '@/components/ui/ResultsList';
import SlotText from "@/components/ui/SlotText";
import { useStreamingSearch } from './use-streaming-search';

export type ResultItem = {
  objectID: string;
  name: string;
  description: string;
  image_url: string;
  url: string;
  date: string;
  time_posted: string;
  price: string;
  href: string;
  location: string;
  site: string;
  lat: number;
  lon: number;
  town: string;
  region: string;
  country: string;
  _geoloc: {
    lat: number;
    lng: number;
  };
  distance?: number;
};

export type MarketplaceItem = {
  selected: boolean;
  logo: string;
};

export type Marketplaces = {
  [key: string]: MarketplaceItem;
};

type ComponentProps = {
  initialCategory?: string;
};

export default function UsedObjectSearch({ initialCategory }: ComponentProps) {
  const [searchTerm, setSearchTerm] = useState(initialCategory || '');
  const [marketplaces, setMarketplaces] = useState<Marketplaces>({
    // 'gumtree.com': { selected: true, logo: 'gumtree.png' },
    // 'facebook.com': { selected: true, logo: 'facebook.png' },
    // 'ebay.co.uk': { selected: true, logo: 'ebay.png' },
    // 'freecycle.org': { selected: true, logo: 'freecycle.png' },
    'trashnothing.com': { selected: true, logo: 'trashnothing.webp' },
    // 'preloved.co.uk': { selected: true, logo: 'preloved.png' },
  });

  const [postcode, setPostcode] = useState('');
  const [radius, setRadius] = useState([10]);
  const [isSticky, setIsSticky] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(!initialCategory);

  // Use our streaming search hook
  const { 
    results, 
    isLoading,
    error, 
    isComplete,
    search: performStreamingSearch 
  } = useStreamingSearch();

  // Get user's location using browser geolocation API
  const getUserGeolocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };

  // Get postcode from coordinates using postcodes.io API
  const getPostcodeFromCoordinates = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await fetch(`https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}`);
      if (!response.ok) throw new Error('Failed to fetch postcode data');
      
      const data = await response.json();
      if (data.result && data.result.length > 0) {
        return data.result[0].postcode;
      }
      return null;
    } catch (error) {
      console.error('Error fetching postcode from coordinates:', error);
      return null;
    }
  };

  // Fetch user's postcode using multiple methods
  const fetchUserPostcode = async () => {
    // First check localStorage
    const savedPostcode = localStorage.getItem('userPostcode');
    if (savedPostcode) {
      setPostcode(savedPostcode);
      return;
    }
    
    try {
      // Try browser geolocation first (most accurate)
      try {
        const position = await getUserGeolocation();
        const { latitude, longitude } = position.coords;
        
        // Store user location for distance calculations
        setUserLocation({ latitude, longitude });
        
        // Get postcode from coordinates
        const postcodeFromGeo = await getPostcodeFromCoordinates(latitude, longitude);
        
        if (postcodeFromGeo) {
          setPostcode(postcodeFromGeo);
          localStorage.setItem('userPostcode', postcodeFromGeo);
          return;
        }
      } catch (geoError) {
        console.warn('Geolocation error:', geoError);
        // Continue to fallback method
      }
      
      // Fallback to IP-based location
      const ipResponse = await fetch('https://ipapi.co/json/');
      if (!ipResponse.ok) throw new Error('Failed to fetch IP data');
      
      const ipData = await ipResponse.json();
      
      if (ipData.latitude && ipData.longitude) {
        // Store user location for distance calculations
        setUserLocation({ 
          latitude: ipData.latitude, 
          longitude: ipData.longitude 
        });
        
        // Get postcode from coordinates
        const postcodeFromIP = await getPostcodeFromCoordinates(ipData.latitude, ipData.longitude);
        
        if (postcodeFromIP) {
          setPostcode(postcodeFromIP);
          localStorage.setItem('userPostcode', postcodeFromIP);
          return;
        }
        
        // If we have a postal code from IP data but couldn't get UK postcode
        if (ipData.postal) {
          setPostcode(ipData.postal);
          localStorage.setItem('userPostcode', ipData.postal);
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching user location:', error);
    }
  };

  useEffect(() => {
    fetchUserPostcode();
  }, []);

  useEffect(() => {
    if (initialCategory) {
      const customEvent = new Event('submit') as CustomEvent;
      customEvent.preventDefault = () => {}; // Add preventDefault method
      handleSearch(customEvent as unknown as React.FormEvent<HTMLFormElement>);
    }
  }, [initialCategory]);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSearched(true);
    
    // Use the streaming search
    performStreamingSearch({
      query: searchTerm,
      postcode: postcode,
      radius: radius[0],
      marketplaces
    });
    
    // Close the filter panel after search
    setIsFilterOpen(false);
  };

  const handleMarketplaceChange = (marketplace: string) => {
    setMarketplaces((prev) => ({
      ...prev,
      [marketplace]: {
        ...prev[marketplace],
        selected: !prev[marketplace].selected,
      },
    }));
  };

  const validateUKPostcode = (postcode: string): boolean => {
    const postcodeRegex = /^([A-Z]{1,2}[0-9]{1,2}[A-Z]?) ?([0-9][A-Z]{2})?$/i;
    return postcodeRegex.test(postcode);
  };

  const fetchCoordinatesFromPostcode = async (postcode: string): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      // First try postcodes.io (UK specific and more reliable for UK postcodes)
      try {
        const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.result) {
            const location = {
              latitude: data.result.latitude,
              longitude: data.result.longitude,
            };
            setUserLocation(location);
            return location;
          }
        }
      } catch (error) {
        console.warn('Error with postcodes.io, falling back to OpenStreetMap:', error);
      }
      
      // Fallback to OpenStreetMap
      const osmResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&postalcode=${encodeURIComponent(postcode)}&countrycodes=GB`);
      if (!osmResponse.ok) throw new Error('Failed to fetch coordinates');
      
      const osmData = await osmResponse.json();
      if (osmData.length > 0) {
        const location = {
          latitude: parseFloat(osmData[0].lat),
          longitude: parseFloat(osmData[0].lon),
        };
        setUserLocation(location);
        return location;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {!initialCategory && (
        <>
        <div className="text-xl md:text-3xl tracking-tight font-ultra text-center md:pb-0">
          <h1 className="bg-custom-green border-2 border-white text-white rounded-lg px-6 py-4 md:py-6 inline-block">
            <span className="animate-pulse hover:animate-none hover:text-white transition-colors duration-600">Recycle</span>.co.uk
          </h1>
          <h2 className="text-custom-green md:text-lg tracking-tight font-ultra text-center mt-6 type-out">
            Scavenge free & used items on the internet.
          </h2>
        </div>
        </>
      )}

      <SearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        postcode={postcode}
        setPostcode={setPostcode}
        radius={radius}
        setRadius={setRadius}
        marketplaces={marketplaces}
        handleMarketplaceChange={handleMarketplaceChange}
        handleSearch={handleSearch}
        isSticky={isSticky}
        results={results}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        error={error}
      />

      {isLoading && !isComplete && results.length > 0 && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2">
          <img src="/loading-spinner.gif" alt="Loading..." className="w-10 h-10" />
            <h3 className="text-custom-green font-ultra tracking-tight">Scavenging for used items... Found free {results.length} items...</h3>

          </div>
        </div>
      )}

      <ResultsList
        loading={isLoading && results.length === 0}
        hasSearched={hasSearched}
        results={results}
        sortOption={sortOption}
        setSortOption={setSortOption}
        marketplaces={marketplaces}
        categoryName={initialCategory}
      />
    </div>
  );
}