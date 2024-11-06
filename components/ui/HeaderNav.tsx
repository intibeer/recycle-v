// HeaderNav.tsx
"use client";

import { Categories } from "./Categories";
import { MobileMenu } from "./MobileMenu";
import Link from "next/link";
import Image from "next/image";

// Add "use client" if this component uses any hooks or browser APIs

// Top categories based on count
const topCategories = [
  { href: "/browse/furniture", name: "Furniture", count: 272 },
  { href: "/browse/baby-kids", name: "Baby & Kids", count: 201 },
  { href: "/browse/sports-leisure", name: "Sports & Leisure", count: 154 },
  { href: "/browse/home-decor", name: "Home Décor", count: 154 },
  { href: "/browse/garden-outdoor", name: "Garden & Outdoor", count: 72 },
  { href: "/browse", name: "Show All Categories", count: null },
];

const HeaderNav = () => {
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
              {topCategories.map((cat) => (
                <option key={cat.href} value={cat.href}>
                  {cat.name} {cat.count ? `(${cat.count})` : ""}
                </option>
              ))}
            </select>
          </noscript>

          {/* JS-enabled menu */}
          <Categories categories={topCategories} />

          {/* Mobile menu */}
          <div className="md:hidden">
            <MobileMenu categories={topCategories} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;
