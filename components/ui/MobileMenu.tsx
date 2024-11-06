"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface Category {
  href: string;
  name: string;
  count: number | null;
}

export const MobileMenu = ({ categories }: { categories: Category[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mainCategories = categories.filter(cat => cat.count);
  const showAll = categories.find(cat => !cat.count);

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="bg-white text-gray-800 border-gray-200 hover:bg-gray-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-x-0 top-[72px] bg-white shadow-lg z-50 md:hidden max-h-[80vh] overflow-y-auto">
          <nav className="divide-y divide-gray-100">
            {mainCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 bg-white"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-gray-800 font-medium">{cat.name}</span>
                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                  {cat.count?.toLocaleString()}
                </span>
              </Link>
            ))}
            
            {showAll && (
              <div className="p-4 bg-gray-50">
                <Link
                  href={showAll.href}
                  className="block text-center font-medium text-blue-600 hover:text-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  Show All Categories →
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
};