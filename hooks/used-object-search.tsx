// @ts-nocheck
'use client'

import { useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch';
import { SearchForm } from '@/components/ui/SearchForm';
import { ResultsList } from '@/components/ui/ResultsList';
import SlotText from "@/components/ui/SlotText";

const client = algoliasearch('LCJ8YL7RLE', 'ec319a204d0b72f8d17a4611a96aaa46');
const index = client.initIndex('used-objects');

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
  category_hierarchy: string[];
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
    'gumtree.com': { selected: true, logo: 'gumtree.png' },
    'facebook.com': { selected: true, logo: 'facebook.png' },
    'ebay.co.uk': { selected: true, logo: 'ebay.png' },
    'freecycle.org': { selected: true, logo: 'freecycle.png' },
    'trashnothing.com': { selected: true, logo: 'trashnothing.webp' },
    'preloved.co.uk': { selected: true, logo: 'preloved.png' },
  });

  const [postcode, setPostcode] = useState('');
  const [radius, setRadius] = useState([10]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [sortedResults, setSortedResults] = useState<ResultItem[]>([]);
  const [isSticky, setIsSticky] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(!initialCategory);

  useEffect(() => {
    const fetchUserPostcode = async () => {
      try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        if (!ipResponse.ok) {
          throw new Error('Failed to fetch IP data');
        }
        const ipData = await ipResponse.json();
        
        if (ipData.latitude && ipData.longitude) {
          const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes?lon=${ipData.longitude}&lat=${ipData.latitude}`);
          if (!postcodeResponse.ok) {
            throw new Error('Failed to fetch postcode data');
          }
          const postcodeData = await postcodeResponse.json();
          
          if (postcodeData.result && postcodeData.result.length > 0) {
            setPostcode(postcodeData.result[0].postcode);
          } else {
            console.warn('No postcode found for the given coordinates');
          }
        } else {
          console.warn('Could not determine user location from IP');
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

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

  useEffect(() => {
    if (results.length > 0) {
      const sorted = sortResults(results, sortOption);
      setSortedResults(sorted);
    }
  }, [results, sortOption]);

  const sortResults = (results: ResultItem[], option: string): ResultItem[] => {
    return [...results].sort((a, b) => {
      switch (option) {
        case 'distance':
          return ((a.distance || Infinity) - (b.distance || Infinity));
        case 'price-low':
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case 'price-high':
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case 'featured':
        default:
          return 0;
      }
    });
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setLoading(true);
    setHasSearched(true);
  
    try {
      let searchLocation = null;
      if (postcode && validateUKPostcode(postcode)) {
        searchLocation = await fetchCoordinatesFromPostcode(postcode);
        if (!searchLocation) {
          console.warn('Postcode not found, proceeding with search without location');
        }
      }
  
      const searchQuery = searchTerm || '';
  
      const filterSites = Object.keys(marketplaces).filter((site) => marketplaces[site].selected);
  
      const siteFilter = filterSites.length > 0
        ? filterSites.map(site => `site:"${site}"`).join(' OR ')
        : undefined;
  
      const searchParams: any = {
        query: searchQuery,
        hitsPerPage: 100,
        attributesToRetrieve: [
          "name", "description", "image_url", "url", "date", "time_posted", "price", "href", "location", 
          "site", "lat", "lon", "town", "region", "country", "objectID", "_geoloc",
        ],
        filters: siteFilter,
      };
  
      if (searchLocation) {
        searchParams.aroundLatLng = `${searchLocation.latitude},${searchLocation.longitude}`;
        searchParams.aroundRadius = radius[0] * 1000;
      }
  
      console.log('Search parameters:', searchParams);
      const response = await index.search(searchQuery, searchParams);
      console.log('Algolia response:', response);
  
      const updatedResults = response.hits.map((item: any) => {
        let distance = null;
        if (searchLocation && item._geoloc) {
          distance = calculateDistance(
            searchLocation.latitude,
            searchLocation.longitude,
            item._geoloc.lat,
            item._geoloc.lng
          );
        }
        return { ...item, distance };
      });
  
      setResults(updatedResults);
      setIsFilterOpen(false);
    } catch (error) {
      console.error('Error fetching from Algolia:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
    } finally {
      setLoading(false);
    }
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
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&postalcode=${postcode}&countrycodes=GB`);
      if (!response.ok) throw new Error('Failed to fetch coordinates');
      const data = await response.json();
      if (data.length > 0) {
        const location = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {!initialCategory && (
        <h1 className="text-xl md:text-3xl tracking-tighter font-ultra text-center pb-6 md:pb-0 flex flex-col md:flex-row items-center justify-center">
          <div className="bg-custom-green text-white rounded-lg px-4 pb-6 md:pb-0 inline-flex items-center">
            <span className='pt-5 md:pb-2 lg:pt-0'>Search</span>
            <div className="inline-flex mx-2 h-[50px] md:h-[100px]">
              <SlotText />
            </div>
            <span className='pt-5 md:pb-2 lg:pt-0'>all at once</span>
          </div>
        </h1>
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
      />

      <ResultsList
        loading={loading}
        hasSearched={hasSearched}
        results={sortedResults}
        sortOption={sortOption}
        setSortOption={setSortOption}
        marketplaces={marketplaces}
        categoryName={initialCategory}
      />
    </div>
  );
}