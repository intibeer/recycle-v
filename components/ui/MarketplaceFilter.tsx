import { cn } from "@/lib/utils";
import { Marketplaces } from "@/hooks/used-object-search";
import { ChevronDown } from 'lucide-react';


interface MarketplaceFilterProps {
  marketplaces: Marketplaces;
  handleMarketplaceChange: (marketplace: string) => void;
  className?: string;
}

export function MarketplaceFilter({
  marketplaces,
  handleMarketplaceChange,
  className
}: MarketplaceFilterProps) {
  const handleClick = (e: React.MouseEvent, site: string) => {
    e.preventDefault();  // Prevent form submission
    handleMarketplaceChange(site);
  };

  return (
    <div className={cn(
      "marketplace-filter-container bg-gray-50 p-4 rounded-md transition-all duration-300 relative group",
      className
    )}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">Where to look</h3>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(marketplaces).map(([site, { selected, logo }]) => (
            <button
              key={site}
              type="button"  // Explicitly set button type to prevent form submission
              onClick={(e) => handleClick(e, site)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-md transition-all duration-300 hover:shadow-md",
                "transform hover:scale-102 active:scale-98 max-w-fit",
                selected 
                  ? "bg-custom-green text-white hover:bg-custom-green/90" 
                  : "bg-white text-gray-700 hover:bg-gray-100"
              )}
            >
              <img 
                src={`/${logo}`} 
                alt={site} 
                className={cn(
                  "w-6 h-6 object-contain transition-all duration-300",
                  selected ? "brightness-100" : "brightness-75"
                )} 
              />
              <span className="text-sm font-medium">{site.split('.')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}