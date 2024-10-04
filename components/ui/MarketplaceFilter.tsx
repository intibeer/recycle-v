import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp } from 'lucide-react';
import { Marketplaces } from '@/hooks/used-object-search';

type MarketplaceFilterProps = {
  marketplaces: Marketplaces;
  handleMarketplaceChange: (marketplace: string) => void;
};

export function MarketplaceFilter({ marketplaces, handleMarketplaceChange }: MarketplaceFilterProps) {
  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full mb-2">
          <ChevronUp className="w-4 h-4 mr-2" />
          Marketplaces
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
  );
}