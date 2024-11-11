import { useMemo } from "react";
import { InstantSearch, Configure, Hits } from "react-instantsearch";
import { searchClient } from "@/lib/algolia";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import qs from "qs"; // Make sure this is imported


interface Hit {
  objectID: string;
  title: string;
  price: number;
  image_url: string;
  marketplace: string;
  description: string;
  url: string;
}

function Hit({ hit }: { hit: Hit }) {
  return (
    <a
      href={hit.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="flex p-4 gap-4">
        <div className="w-40 h-40 relative flex-shrink-0">
          <img
            src={hit.image_url}
            alt={hit.title}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg line-clamp-2">{hit.title}</h3>
          <p className="text-2xl font-bold mt-2">£{hit.price}</p>
          <p className="text-gray-600 mt-2 line-clamp-2">{hit.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            From {hit.marketplace}
          </div>
        </div>
      </div>
    </a>
  );
}

interface LocationLandingPageProps {
  category: string;
  location: string;
}

function RefineSearchButton({ category, location }: { category: string, location: string }) {
    // Create the URL with the correct query string format
    const queryString = qs.stringify(
      {
        query: '',
        page: 1,
        locations: [location], // This will be properly formatted as locations[0]=london
      },
      {
        addQueryPrefix: true,
        arrayFormat: 'indices',  // This formats arrays as locations[0], locations[1], etc.
        encodeValuesOnly: true,  // Only encode the values, not the keys
      }
    );
    
    const searchUrl = `/browse/${category}${queryString}`;
    
    return (
      <Link href={searchUrl}>
        <Button 
          size="lg" 
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-6"
        >
          <Search className="w-5 h-5" />
          Refine Your Search
        </Button>
      </Link>
    );
  }
  

export default function LocationLandingPage({
  category,
  location,
}: LocationLandingPageProps) {
  const initialConfig = useMemo(() => ({
    filters: `category_hierarchy:"${category}"`,
    hitsPerPage: 20,
    disjunctiveFacetsRefinements: {
      town: [location],
    },
  }), [category, location]);

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="used-objects"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            Used {category} in {location}
          </h1>
          
          <div className="flex justify-between items-center">
          <RefineSearchButton 
              category={category} 
              location={location} 
            />
            <Link href="/browse" className="text-sm text-blue-600 hover:underline">
              Back to all categories
            </Link>
           
          </div>
        </div>
        
        <div className="space-y-4">
          <Hits hitComponent={Hit} />
        </div>
      </div>
      <Configure {...initialConfig} />
    </InstantSearch>
  );
}