import { useMemo } from "react";
import { 
  InstantSearch, 
  Configure, 
  Hits,
  useInstantSearch 
} from "react-instantsearch";
import { searchClient } from "@/lib/algolia";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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

function TitleSection({ 
  category, 
  location, 
  subcategory,
  totalHits 
}: { 
  category: string;
  location: string;
  subcategory: string;
  totalHits: number;
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Used {subcategory} {category} in {location}
      </h1>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          {/* Link back to category+location view */}
          <Link 
            href={`/browse/${category}/${location}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to all {category}
          </Link>
          
          {/* Link to main browse with filters */}
          <Link 
            href={`/browse/${category}?location=${location}&type=${subcategory}`}
            className="hidden md:block"
          >
            <Button
              size="sm"
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Refine Search
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-600">
          {totalHits} items found
        </p>
      </div>
    </div>
  );
}

interface SubcategoryViewProps {
  category: string;
  location: string;
  subcategory: string;
}

export default function SubcategoryView({
  category,
  location,
  subcategory,
}: SubcategoryViewProps) {
  const initialConfig = useMemo(() => ({
    filters: `category_hierarchy:"${category} > ${subcategory}"`,
    hitsPerPage: 20,
    disjunctiveFacetsRefinements: {
      town: [location],
    },
  }), [category, location, subcategory]);

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="used-objects"
    >
      <div className="space-y-6">
        <Configure {...initialConfig} />
        
        {/* Use InstantSearch hook to get total hits */}
        <InstantSearchWrapper
          category={category}
          location={location}
          subcategory={subcategory}
        />

        <div className="space-y-4">
          <Hits hitComponent={Hit} />
        </div>
      </div>
    </InstantSearch>
  );
}

// Wrapper component to access InstantSearch context
function InstantSearchWrapper({ 
  category, 
  location, 
  subcategory 
}: SubcategoryViewProps) {
  const { results } = useInstantSearch();
  
  return (
    <TitleSection
      category={category}
      location={location}
      subcategory={subcategory}
      totalHits={results?.nbHits || 0}
    />
  );
}