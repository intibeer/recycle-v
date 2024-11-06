// src/components/ui/Categories.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";

// Import URL transformation function
const urlSafeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
    .replace(/(^-|-$)/g, ""); // Remove leading/trailing dashes
};

interface Category {
  href: string;
  name: string;
  count: number | null;
}

export const Categories = ({ categories }: { categories: Category[] }) => {
  const mainCategories = categories.filter((cat) => cat.count);
  const showAll = categories.find((cat) => !cat.count);
  return (
    <div className="hidden md:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
          >
            <Menu className="mr-2 h-4 w-4" />
            Categories
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          {mainCategories.map((cat) => (
            <DropdownMenuItem key={cat.name} className="focus:bg-gray-50">
              <Link
                href={`/browse/${urlSafeString(cat.name)}`}
                className="w-full flex justify-between items-center py-2"
              >
                <span className="text-gray-800 font-medium">{cat.name}</span>
                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                  {cat.count?.toLocaleString()}
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
          {showAll && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="focus:bg-gray-50">
                <Link
                  href="/browse"
                  className="w-full text-center py-1 font-medium text-blue-600 hover:text-blue-700"
                >
                  Show All Categories →
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
