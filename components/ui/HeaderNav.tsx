"use client";

import { useEffect, useState } from 'react';
import { Categories } from "./Categories";
import { MobileMenu } from "./MobileMenu";
import Link from "next/link";
import Image from "next/image";
import { getCategoryCounts } from "@/lib/getCategoryCounts";

// Define types
interface Category {
  href: string;
  name: string;
  count: number | null;
}

interface CachedData {
  counts: {
    total: number;
    categories: Array<{ value: string; count: number }>;
  };
  timestamp: number;
}

const CACHE_KEY = 'category-counts';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const TOP_CATEGORIES_COUNT = 5; // Number of top categories to show

const HeaderNav = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { counts, timestamp }: CachedData = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            // Cache is still valid, use it
            updateCategoriesWithCounts(counts);
            return;
          }
        }

        // Cache missing or expired, fetch new data
        const counts = await getCategoryCounts();
        
        // Save to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          counts,
          timestamp: Date.now()
        }));

        // Update categories
        updateCategoriesWithCounts(counts);
      } catch (error) {
        console.error('Failed to fetch category counts:', error);
      }
    };

    const updateCategoriesWithCounts = (counts: { categories: Array<{ value: string; count: number }> }) => {
      // Get top categories by count
      const topCategories = counts.categories
        .slice(0, TOP_CATEGORIES_COUNT)
        .map(cat => ({
          name: cat.value,
          href: `/browse/${cat.value.toLowerCase().replace(/\s+/g, '-')}`,
          count: cat.count
        }));

      // Add "Show All Categories" at the end
      const allCategories = [
        ...topCategories,
        { href: "/browse", name: "Show All Categories", count: null }
      ];

      setCategories(allCategories);
    };

    fetchCounts();
  }, []);

  return (
    <header className="bg-white/60 shadow-md">
      <div className="container mx-auto px-4 sm:px-2 py-4 flex justify-between items-center">
        {/* Logo on the Left */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={60} height={60} priority />
          <img
            height="150"
            width="150"
            className="mx-2"
            src="/strapline.png"
            alt="Strapline"
          />
        </Link>

        {/* Navigation Area */}
        <div className="flex items-center space-x-4">
          {/* No-JS Fallback */}
          <noscript>
            <select
              className="hidden md:block h-10 px-4 py-2 rounded-md border border-input bg-background"
              onChange={(e) => {
                window.location.href = e.target.value;
              }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.href} value={cat.href}>
                  {cat.name} {cat.count ? `(${cat.count})` : ""}
                </option>
              ))}
            </select>
          </noscript>

          {/* JS-enabled menu */}
          <Categories categories={categories} />

          {/* Mobile menu */}
          <div className="md:hidden">
            <MobileMenu categories={categories} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;