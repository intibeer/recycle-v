import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-custom-green-pattern text-white py-8 bottom-0 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-3">Recycle.co.uk</h3>
            <p className="text-sm opacity-90">
              Helping you find and reuse pre-loved items to reduce waste and protect our planet.
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="font-bold text-lg mb-3">Quick Links</h3>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <Link href="/privacy-policy" className="text-sm hover:underline transition-all">
                Privacy Policy
              </Link>
              <Link href="/terms-of-use" className="text-sm hover:underline transition-all">
                Terms of Use
              </Link>
              <Link href="/cookie-policy" className="text-sm hover:underline transition-all">
                Cookie Policy
              </Link>
            </nav>
          </div>
          
          <div className="text-center md:text-right">
            <h3 className="font-bold text-lg mb-3">Connect With Us</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <Link href="https://www.facebook.com/recycle.co.uk" target="_blank" rel="noopener noreferrer" 
                className="bg-white text-custom-green p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" target="_blank" rel="noopener noreferrer" 
                className="bg-white text-custom-green p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" target="_blank" rel="noopener noreferrer" 
                className="bg-white text-custom-green p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-white/20 text-center text-sm opacity-80">
          <p>&copy; Copyright 2024 Recycle.co.uk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}