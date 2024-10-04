"use client"

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const categories = [
  { href: '/kitchen-appliances', category: 'Appliances' },
  { href: '/stereos-audio', category: 'Audio & Stereo' },
  { href: '/baby-kids-stuff', category: 'Baby & Kids Stuff' },
  { href: '/cameras-studio-equipment', category: 'Cameras, Camcorders & Studio Equipment' },
  { href: '/christmas-decorations', category: 'Christmas Decorations' },
  { href: '/clothing', category: 'Clothes, Footwear & Accessories' },
  { href: '/computers-software', category: 'Computers & Software' },
  { href: '/diy-tools-materials', category: 'DIY Tools & Materials' },
  { href: '/health-beauty', category: 'Health & Beauty' },
  { href: '/home-garden', category: 'Home & Garden' },
  { href: '/house-clearance', category: 'House Clearance' },
  { href: '/miscellaneous-goods', category: 'Random Goods' },
  { href: '/music-instruments', category: 'Musical Instruments & DJ Equipment' },
  { href: '/cds-dvds-games-books', category: 'Music, Films, Books & Games' },
  { href: '/office-furniture-equipment', category: 'Office Furniture & Equipment' },
  { href: '/phones', category: 'Phones, Mobile Phones & Telecoms' },
  { href: '/sports-leisure-travel', category: 'Sports, Leisure & Travel' },
  { href: '/tv-dvd-cameras', category: 'TV, DVD, Blu-Ray & Videos' },
  { href: '/video-games-consoles', category: 'Video Games & Consoles' }
];

const HeaderNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/60 shadow-md">
      <div className="container mx-auto px-4 sm:px-2 py-4 flex justify-between items-center">
        {/* Logo on the Left */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={60} height={60} />
          <img height="150" width="150" className="mx-2" src="/strapline.png" alt="Strapline" />
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
}

export default HeaderNav;