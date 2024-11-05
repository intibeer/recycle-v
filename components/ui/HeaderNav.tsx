"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  {
    href: "/kitchen-appliances",
    category: "Appliances",
    subcategories: [
      "Refrigerators",
      "Ovens",
      "Microwaves",
      "Dishwashers",
      "Coffee Makers",
      "Toasters",
    ],
  },
  {
    href: "/stereos-audio",
    category: "Audio & Stereo",
    subcategories: [
      "Bluetooth Speakers",
      "Home Theater Systems",
      "Headphones",
      "Soundbars",
      "Portable Speakers",
    ],
  },
  {
    href: "/baby-kids-stuff",
    category: "Baby & Kids Stuff",
    subcategories: ["Toys", "Clothing", "Furniture", "Baby Gear", "Books"],
  },
  {
    href: "/cameras-studio-equipment",
    category: "Cameras, Camcorders & Studio Equipment",
    subcategories: [
      "Digital Cameras",
      "Tripods",
      "Lighting Equipment",
      "Lenses",
      "Video Cameras",
    ],
  },
  {
    href: "/christmas-decorations",
    category: "Christmas Decorations",
    subcategories: [
      "Tree Ornaments",
      "Lights",
      "Wreaths",
      "Garlands",
      "Table Decorations",
    ],
  },
  {
    href: "/clothing",
    category: "Clothes, Footwear & Accessories",
    subcategories: [
      "Men's Clothing",
      "Women's Clothing",
      "Children's Clothing",
      "Shoes",
      "Accessories",
    ],
  },
  {
    href: "/computers-software",
    category: "Computers & Software",
    subcategories: [
      "Laptops",
      "Desktops",
      "Software",
      "Computer Accessories",
      "Peripherals",
    ],
  },
  {
    href: "/diy-tools-materials",
    category: "DIY Tools & Materials",
    subcategories: [
      "Power Tools",
      "Hand Tools",
      "Building Materials",
      "Gardening Tools",
      "Paints and Finishes",
    ],
  },
  {
    href: "/health-beauty",
    category: "Health & Beauty",
    subcategories: [
      "Skincare",
      "Makeup",
      "Haircare",
      "Wellness Products",
      "Perfumes",
    ],
  },
  {
    href: "/home-garden",
    category: "Home & Garden",
    subcategories: [
      "Furniture",
      "Garden Supplies",
      "Home Decor",
      "Bedding",
      "Lighting",
    ],
  },
  {
    href: "/house-clearance",
    category: "House Clearance",
    subcategories: [
      "Furniture",
      "Electronics",
      "Appliances",
      "Clothing",
      "Miscellaneous Items",
    ],
  },
  {
    href: "/miscellaneous-goods",
    category: "Random Goods",
    subcategories: [
      "Unique Items",
      "Collectibles",
      "Antiques",
      "Gift Items",
      "Novelty Products",
    ],
  },
  {
    href: "/music-instruments",
    category: "Musical Instruments & DJ Equipment",
    subcategories: [
      "Guitars",
      "Pianos",
      "Drums",
      "DJ Gear",
      "Recording Equipment",
    ],
  },
  {
    href: "/cds-dvds-games-books",
    category: "Music, Films, Books & Games",
    subcategories: ["CDs", "Vinyl Records", "DVDs", "Books", "Video Games"],
  },
  {
    href: "/office-furniture-equipment",
    category: "Office Furniture & Equipment",
    subcategories: [
      "Desks",
      "Chairs",
      "Storage Solutions",
      "Office Supplies",
      "Computers",
    ],
  },
  {
    href: "/phones",
    category: "Phones, Mobile Phones & Telecoms",
    subcategories: [
      "Smartphones",
      "Landline Phones",
      "Accessories",
      "Mobile Plans",
      "Chargers",
    ],
  },
  {
    href: "/sports-leisure-travel",
    category: "Sports, Leisure & Travel",
    subcategories: [
      "Sports Equipment",
      "Bicycles",
      "Camping Gear",
      "Travel Accessories",
      "Fitness Products",
    ],
  },
  {
    href: "/tv-dvd-cameras",
    category: "TV, DVD, Blu-Ray & Videos",
    subcategories: [
      "Televisions",
      "DVD Players",
      "Blu-Ray Discs",
      "Streaming Devices",
      "Cameras",
    ],
  },
  {
    href: "/video-games-consoles",
    category: "Video Games & Consoles",
    subcategories: [
      "Game Consoles",
      "Video Games",
      "Accessories",
      "Virtual Reality",
      "Collectible Games",
    ],
  },
];

const HeaderNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/60 shadow-md">
      <div className="container mx-auto px-4 sm:px-2 py-4 flex justify-between items-center">
        {/* Logo on the Left */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={60} height={60} />
          <img
            height="150"
            width="150"
            className="mx-2"
            src="/strapline.png"
            alt="Strapline"
          />
        </Link>

        {/* Desktop Navigation and Category Dropdown */}
        <div className="hidden md:flex items-center space-x-4">
          <nav className="space-x-4">
            {/* Add navigation items here if needed */}
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-primary text-white">
                Categories
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-[60vh] overflow-y-auto">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.href}>
                  <Link href={cat.href} className="w-full">
                    {cat.category}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="outline"
            className="bg-primary text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            Menu
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="container mx-auto px-4 py-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full mb-2">
                  Categories
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full max-h-[60vh] overflow-y-auto">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.href}>
                    <Link href={cat.href} className="w-full">
                      {cat.category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Add more mobile menu items here if needed */}
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderNav;
