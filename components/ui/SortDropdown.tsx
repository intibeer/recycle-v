import { Button } from "@/components/ui/button";
import { ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortDropdownProps = {
  sortOption: string;
  setSortOption: (option: string) => void;
};

export function SortDropdown({ sortOption, setSortOption }: SortDropdownProps) {
  // Map sort options to display names
  const sortDisplayNames: Record<string, string> = {
    'relevance': 'Relevance',
    'distance': 'Distance',
    'date': 'Newest',
    'price-low': 'Price: Low to High',
    'price-high': 'Price: High to Low'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white border-gray-300 text-gray-800 font-medium hover:bg-gray-50">
          {sortDisplayNames[sortOption] || 'Sort by'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
          <DropdownMenuRadioItem value="relevance">Relevance</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="distance">Distance</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">Newest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-low">Price: Low to High</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-high">Price: High to Low</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}