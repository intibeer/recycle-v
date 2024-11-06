// src/components/ui/Footer.tsx
import Link from "next/link";
import { Facebook } from "lucide-react";

const popularCategories = [
  { name: "Furniture", href: "/browse/furniture" },
  { name: "Baby & Kids", href: "/browse/baby-kids" },
  { name: "Sports & Leisure", href: "/browse/sports-leisure" },
  { name: "Home Décor", href: "/browse/home-decor" },
  { name: "Garden & Outdoor", href: "/browse/garden-outdoor" },
];

const locations = [
  { name: "London", href: "/london" },
  { name: "Manchester", href: "/manchester" },
  { name: "Birmingham", href: "/birmingham" },
  { name: "Leeds", href: "/leeds" },
  { name: "Edinburgh", href: "/edinburgh" },
];

export default function Footer() {
  return (
    <footer className="bg-white text-gray-600 py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Popular Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Popular Categories
            </h3>
            <ul className="space-y-2">
              {popularCategories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-gray-600 hover:text-gray-900 flex justify-between items-center"
                  >
                    <span>{category.name}</span>
                   
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse By Location */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Browse By Location
            </h3>
            <ul className="space-y-2">
              {locations.map((location) => (
                <li key={location.href}>
                  <Link
                    href={location.href}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Information</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-use"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>

            <div className="flex items-center mt-4">
              <span className="text-sm mr-2">Follow us on</span>
              <Link
                href="https://www.facebook.com/recycle.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-center text-gray-600">
            &copy; Copyright 2024. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
