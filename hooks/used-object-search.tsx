'use client'

import { useState, useEffect } from 'react';
import { Search, Sliders, MapPin, ArrowUpDown, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import SlotText from "@/components/ui/SlotText";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Algolia setup
import algoliasearch from 'algoliasearch';

const client = algoliasearch('LCJ8YL7RLE', 'ec319a204d0b72f8d17a4611a96aaa46');
const index = client.initIndex('used-objects');

type ResultItem = {
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

type MarketplaceItem = {
  selected: boolean;
  logo: string;
};

type Marketplaces = {
  [key: string]: MarketplaceItem;
};

export default function Component() {
  const [searchTerm, setSearchTerm] = useState('');
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
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchUserPostcode = async () => {
      try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();
        
        if (ipData.latitude && ipData.longitude) {
          const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes?lon=${ipData.longitude}&lat=${ipData.latitude}`);
          const postcodeData = await postcodeResponse.json();
          
          if (postcodeData.result && postcodeData.result.length > 0) {
            setPostcode(postcodeData.result[0].postcode);
          } else {
            console.error('No postcode found for the given coordinates');
          }
        } else {
          console.error('Could not determine user location from IP');
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    fetchUserPostcode();
  }, []);

  const sortResults = (results: ResultItem[], option: string): ResultItem[] => {
    return [...results].sort((a, b) => {
      switch (option) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateUKPostcode(postcode)) {
      alert('Invalid postcode');
      return;
    }
  
    setLoading(true);
    setHasSearched(true);
  
    try {
      const coordinatesFound = await fetchCoordinatesFromPostcode(postcode);
      if (!coordinatesFound) {
        alert('Postcode not found');
        setLoading(false);
        return;
      }
  
      const searchLocation = coordinatesFound;
      const searchQuery = searchTerm || '';
  
      const filterSites = Object.keys(marketplaces).filter((site) => marketplaces[site].selected);
  
      const siteFilter = filterSites.length > 0
        ? filterSites.map(site => `site:"${site}"`).join(' OR ')
        : undefined;
  
      const locationFilter = `${searchLocation.latitude},${searchLocation.longitude}`;
  
      const response = await index.search(searchQuery, {
        aroundLatLng: locationFilter,
        aroundRadius: radius[0] * 1000,
        hitsPerPage: 100,
        attributesToRetrieve: [
          "name", "description", "image_url", "url", "date", "time_posted", "price", "href", "location", 
          "site", "lat", "lon", "town", "region", "country", "objectID", "_geoloc",
        ],
        filters: siteFilter,
      });
  
      const updatedResults = response.hits.map((item: any) => {
        const distance = item._geoloc
          ? calculateDistance(searchLocation.latitude, searchLocation.longitude, item._geoloc.lat, item._geoloc.lng)
          : null;
        return { ...item, distance };
      });
  
      setResults(updatedResults);
      setIsFilterOpen(updatedResults.length === 0);
    } catch (error) {
      console.error('Error fetching from Algolia:', error);
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
  
  const handleGetItem = (item: ResultItem) => {
    if (item.href) {
      window.open(item.href, '_blank');
    } else {
      console.error("URL not found for item", item);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-xl md:text-3xl tracking-tighter font-ultra text-center pb-6 md:pb-0 flex flex-col md:flex-row items-center justify-center">
        <div className="bg-custom-green text-white rounded-lg px-4 pb-6 md:pb-0 inline-flex items-center">
          <span className='pt-5 md:pb-2 lg:pt-0'>Search</span>
          <div className="inline-flex mx-2 h-[50px] md:h-[100px]">
            <SlotText />
          </div>
          <span className='pt-5 md:pb-2 lg:pt-0'>all at once</span>
        </div>
      </h1>

      <div className={`bg-white border rounded-md transition-all duration-300 ${isSticky ? 'sticky top-0 z-10 shadow-md' : ''}`}>
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              {isFilterOpen ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Filters
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show Filters
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <form onSubmit={handleSearch} className="space-y-6 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                  <Input
                    id="postcode"
                    type="text"
                    placeholder="Enter postcode"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-2/3 space-y-2">
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="radius"
                      min={1}
                      max={50}
                      step={1}
                      value={radius}
                      onValueChange={setRadius}
                      className="flex-grow"
                    />
                    <span className="font-semibold">{radius} km</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="Search for used objects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow w-full"
                />
           
                <Button type="submit" className="w-full md:w-auto text-white font-bold tracking-tight">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>

              <Collapsible open={isMarketplaceOpen} onOpenChange={setIsMarketplaceOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full mb-2">
                    {isMarketplaceOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Hide Marketplaces
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Show Marketplaces
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {Object.entries(marketplaces).map(([name, { selected, logo }]) => (
                      <div key={name} className="flex items-center space-x-2 ">
                        <Checkbox
                          id={name}
                          checked={selected}
                          onCheckedChange={() => handleMarketplaceChange(name)}
                          className='text-white'
                        />
                        <img src={`/${logo}`} alt={name} className="h-6 grayscale contrast-200 brightness-0" />
                        <Label htmlFor={name} className="hidden">
                          {name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {results.length !== 0 && <Button type="submit" className="text-white font-bold tracking-tight w-full">
                <Sliders className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>}
            </form>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <img src="/loading-spinner.gif" width={100} height={100} alt="Loading..." />
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">No results found</h2>
          <p className="text-gray-600 mb-4">Please try a different search or adjust your filters.</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Search Results</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto bg-primary text-white font-bold tracking-tighter">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={sortOption}
                  onValueChange={(value) => setSortOption(value)}
                >
                  <DropdownMenuRadioItem value="featured">Featured</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="distance">Distance</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-low">Price: Low to High</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-high">Price: High to Low</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedResults.map((item) => (
              <Dialog key={item.objectID}>
                <DialogTrigger asChild>
                  <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={item.image_url ? item.image_url : '/placeholder.svg'}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-base">
                        {item.distance ? `${Math.round(item.distance)} km` : ''}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold">
                          {
                            isNaN(parseFloat(item.price)) || item.price === '0' || item.price === '0.00' || parseFloat(item.price) === 0 
                              ? 'Free' 
                              : `£${Math.round(parseFloat(item.price.replace(/£/g, '')))}`
                          }
                        </span>
                      </div>
                      <div className="flex items-center text-base text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.location}
                      </div>
                      <div className="mt-2 flex justify-end">

                        <img 
                          src={`/${marketplaces[item.site]?.logo}`} 
                          alt={item.site} 
                          className="pr-2 h-6 grayscale contrast-200 brightness-0 "
                        />
                        {/* <p className='text-xs  text-custom-green/80'>{ item.site } </p> */}
                      </div>

                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{item.name}</DialogTitle>
                    <DialogDescription>
                      <div className="mt-2 space-y-2">
                        <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover rounded-md" />
                        <p>{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl tracking-tighter extra-bold">
                            {
                              isNaN(parseFloat(item.price)) || item.price === '0' || item.price === '0.00' || parseFloat(item.price) === 0 
                                ? 'Free' 
                                : `£${Math.round(parseFloat(item.price.replace(/£/g, '')))}`
                            }
                          </span>
                          <img 
                            src={`/${marketplaces[item.site]?.logo}`} 
                            alt={item.site} 
                            className="h-6"
                          />
                        </div>
                        <div className="flex items-center text-base text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {item.location} ({item.distance ? `${Math.round(item.distance)} km` : 'Unknown distance'})
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <Button onClick={() => handleGetItem(item)} className="w-full text-white font-bold">
                      Get
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}