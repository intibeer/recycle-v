import { Search, Sliders, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MarketplaceFilter } from './MarketplaceFilter';
import { Marketplaces, ResultItem } from '@/hooks/used-object-search';

type SearchFormProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  postcode: string;
  setPostcode: (postcode: string) => void;
  radius: number[];
  setRadius: (radius: number[]) => void;
  marketplaces: Marketplaces;
  handleMarketplaceChange: (marketplace: string) => void;
  handleSearch: (e: React.FormEvent<Element>) => void;
  isSticky: boolean;
  results: ResultItem[];
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
};

export function SearchForm({
  searchTerm,
  setSearchTerm,
  postcode,
  setPostcode,
  radius,
  setRadius,
  marketplaces,
  handleMarketplaceChange,
  handleSearch,
  isSticky,
  results,
  isFilterOpen,
  setIsFilterOpen
}: SearchFormProps) {
  return (
    <div className={`bg-white border rounded-md transition-all duration-300 ${isSticky ? 'sticky top-0 z-10 shadow-md' : ''}`}>
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            {isFilterOpen ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
            Filters
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <form onSubmit={handleSearch} className="space-y-6 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <Input
                  id="postcode"
                  type="text"
                  placeholder="Enter postcode (optional)"
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

            <MarketplaceFilter
              marketplaces={marketplaces}
              handleMarketplaceChange={handleMarketplaceChange}
            />

            {results.length !== 0 && (
              <Button type="submit" className="text-white font-bold tracking-tight w-full">
                <Sliders className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            )}
          </form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}