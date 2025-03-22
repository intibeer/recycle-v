import { Search, Sliders, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MarketplaceFilter } from './MarketplaceFilter';
import { Marketplaces, ResultItem } from '@/hooks/used-object-search';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [postcodeError, setPostcodeError] = useState<string | null>(null);
  const [formattedPostcode, setFormattedPostcode] = useState(postcode);

  // Validate and format UK postcode
  const validateAndFormatPostcode = (input: string): { isValid: boolean; formatted: string; error: string | null } => {
    // Remove all whitespace and convert to uppercase
    const cleaned = input.replace(/\s+/g, '').toUpperCase();
    
    if (!cleaned) {
      return { isValid: true, formatted: '', error: null }; // Empty is allowed
    }
    
    // Full UK postcode regex (strict validation)
    const fullPostcodeRegex = /^([A-Z]{1,2}[0-9][A-Z0-9]?[0-9][A-Z]{2})$/;
    
    // Partial postcode regex (for validation during typing)
    const partialPostcodeRegex = /^([A-Z]{1,2}[0-9][A-Z0-9]?)$/;
    
    // Check if it's a complete postcode
    if (fullPostcodeRegex.test(cleaned)) {
      // Format with a space in the correct position
      const formatted = cleaned.slice(0, -3) + ' ' + cleaned.slice(-3);
      return { isValid: true, formatted, error: null };
    }
    
    // Check if it's a partial postcode (outward code only)
    if (partialPostcodeRegex.test(cleaned)) {
      return { 
        isValid: false, 
        formatted: cleaned, 
        error: 'Please enter a complete postcode' 
      };
    }
    
    // If it doesn't match either pattern
    return { 
      isValid: false, 
      formatted: cleaned, 
      error: 'Please enter a valid UK postcode' 
    };
  };

  // Handle postcode input change
  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const { formatted, error } = validateAndFormatPostcode(input);
    
    setFormattedPostcode(input); // Keep what user typed for now
    setPostcodeError(error);
    
    // Only update the actual postcode if it's valid or empty
    if (!error || !input) {
      setPostcode(formatted);
    }
  };

  // Format postcode on blur (when user leaves the field)
  const handlePostcodeBlur = () => {
    const { formatted, error } = validateAndFormatPostcode(formattedPostcode);
    setFormattedPostcode(formatted); // Update display with formatted version
    setPostcodeError(error);
    
    // Only update the actual postcode if it's valid or empty
    if (!error || !formattedPostcode) {
      setPostcode(formatted);
    }
  };

  // Handle form submission with validation
  const handleSubmitWithValidation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate postcode before submitting
    if (formattedPostcode) {
      const { isValid, formatted, error } = validateAndFormatPostcode(formattedPostcode);
      
      if (!isValid) {
        setPostcodeError(error);
        return; // Prevent form submission
      }
      
      // Update with properly formatted postcode
      setFormattedPostcode(formatted);
      setPostcode(formatted);
    }
    
    // Continue with the original handler
    handleSearch(e);
  };

  return (
    <div className={`bg-white rounded-md transition-all duration-300 ${isSticky ? 'sticky top-0 z-10 shadow-md' : ''}`}>
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            {isFilterOpen ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
            Scavenge
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <form onSubmit={handleSubmitWithValidation} className="space-y-6 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4 ">
              <div className="w-full md:w-1/3 relative">
                <Input
                  id="postcode"
                  type="text"
                  placeholder="Enter your postcode..."
                  value={formattedPostcode}
                  onChange={handlePostcodeChange}
                  onBlur={handlePostcodeBlur}
                  className={`transition-all duration-300 hover:shadow-md placeholder:text-gray-400 placeholder:font-medium relative z-10 ${
                    postcodeError ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {postcodeError && (
                  <Alert variant="destructive" className="mt-2 py-2 px-3 text-sm bg-red-50 border-red-200">
                    <AlertDescription>{postcodeError}</AlertDescription>
                  </Alert>
                )}
                <div className="absolute inset-0 bg-custom-green/5 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
              </div>
              <div className="w-full md:w-2/3 space-y-2">
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-md transition-all duration-300 hover:shadow-md">
                  <Slider
                    id="radius"
                    min={1}
                    max={50}
                    step={1}
                    value={radius}
                    onValueChange={setRadius}
                    className="flex-grow"
                  />
                  <span className="font-semibold text-custom-green min-w-[4rem] text-center">
                    {radius} km
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow group">
                <Input
                  type="text"
                  placeholder="What are you looking for..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="transition-all duration-300 hover:shadow-md placeholder:text-gray-400 placeholder:font-medium"
                />
                <div className="absolute inset-0 bg-custom-green/5 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
         
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-custom-green text-white font-bold tracking-tight px-8 py-4 rounded-lg 
                  transition-all duration-300 transform hover:scale-105 hover:shadow-lg 
                  flex items-center justify-center gap-3 min-w-[160px]
                  hover:bg-custom-green/90 active:scale-95"
                disabled={!!postcodeError && !!formattedPostcode}
              >
                <Search className="w-5 h-5" />
                <span>Scavenge</span>
              </Button>
            </div>

            <MarketplaceFilter
              marketplaces={marketplaces}
              handleMarketplaceChange={handleMarketplaceChange}
              className="marketplace-filter-container"
            />

            {results.length !== 0 && (
              <Button 
                type="submit" 
                className="text-white font-bold tracking-tight w-full"
                disabled={!!postcodeError && !!formattedPostcode}
              >
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