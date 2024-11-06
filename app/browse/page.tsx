"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBrowseIndexWithFacets } from "@/lib/browseSearch";

interface Category {
  name: string;
  count: number;
  subcategories: { name: string; count: number }[];
}

export default function BrowseIndexPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { categories } = await fetchBrowseIndexWithFacets();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="container mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {" > "}
          <span className="font-semibold">Browse</span>
        </nav>

        <h1 className="text-2xl font-bold mb-6">Browse Second Hand Items</h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
              >
                <Link
                  href={`/browse/${encodeURIComponent(
                    category.name.toLowerCase()
                  )}`}
                  className="block"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {category.name} ({category.count})
                  </h2>
                </Link>

                <div className="space-y-1">
                  {category.subcategories.slice(0, 5).map((sub) => (
                    <Link
                      key={sub.name}
                      href={`/browse/${encodeURIComponent(
                        category.name.toLowerCase()
                      )}?subcategory=${encodeURIComponent(sub.name)}`}
                      className="block text-sm text-gray-600 hover:text-blue-600"
                    >
                      {sub.name} ({sub.count})
                    </Link>
                  ))}
                  {category.subcategories.length > 5 && (
                    <Link
                      href={`/browse/${encodeURIComponent(
                        category.name.toLowerCase()
                      )}`}
                      className="block text-sm text-blue-600 hover:underline mt-2"
                    >
                      View all {category.subcategories.length} subcategories →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
