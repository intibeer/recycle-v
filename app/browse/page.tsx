"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategoryCounts } from "@/lib/getCategoryCounts"; // Adjust path as needed

interface CategoryData {
  total: number;
  categories: {
    value: string;
    count: number;
  }[];
}

export default function BrowseIndexPage() {
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getCategoryCounts();
        setCategoryData(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {" > "}
        <span className="font-semibold">Browse</span>
      </nav>

      <h1 className="text-2xl font-bold mb-6">
        Browse Second Hand Items
        {categoryData && (
          <span className="text-lg font-normal text-gray-600 ml-2">
            ({categoryData.total.toLocaleString()} items)
          </span>
        )}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData?.categories.map((category) => (
            <div
              key={category.value}
              className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
            >
              <Link
                href={`/browse/${encodeURIComponent(
                  category.value.toLowerCase()
                )}`}
                className="block"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {category.value} ({category.count.toLocaleString()})
                </h2>
              </Link>

              <div className="text-sm text-gray-600">
                <Link
                  href={`/browse/${encodeURIComponent(
                    category.value.toLowerCase()
                  )}`}
                  className="text-blue-600 hover:underline"
                >
                  View all items →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}