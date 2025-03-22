import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortOption = {
  value: string;
  label: string;
};

const sortOptions: SortOption[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date', label: 'Newest first' },
  { value: 'distance', label: 'Distance' },
  { value: 'price-low', label: 'Price: Low to high' },
  { value: 'price-high', label: 'Price: High to low' },
];

type SortDropdownProps = {
  sortOption: string;
  setSortOption: (option: string) => void;
};

export function SortDropdown({ sortOption, setSortOption }: SortDropdownProps) {
  const selectedOption = sortOptions.find(option => option.value === sortOption) || sortOptions[0];
  
  const handleSelect = (value: string) => {
    console.log('Selected sort option:', value); // Debug log
    setSortOption(value);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between w-44 px-3 py-2 text-sm bg-white border rounded-md hover:bg-gray-50">
        <span>{selectedOption.label}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            {option.label}
            {option.value === sortOption && <Check className="w-4 h-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}