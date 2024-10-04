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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto bg-primary text-white font-bold tracking-tighter">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort by
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
          <DropdownMenuRadioItem value="featured">Featured</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="distance">Distance</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-low">Price: Low to High</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-high">Price: High to Low</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}