import Link from 'next/link'
import { Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="text-gray-600 py-4 bottom-0 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-black">&copy; Copyright 2024. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end space-x-4 mb-4 md:mb-0">
            <Link href="/privacy-policy" className="text-sm text-black font-extrabold hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="text-sm text-black font-extrabold hover:text-gray-900 transition-colors">
              Terms of Use
            </Link>
            <Link href="/cookie-policy" className="text-sm font-extrabold text-black hover:text-gray-900 transition-colors">
              Cookie Policy
            </Link>
          </nav>
          <div className="flex items-center">
            <span className="text-sm mr-2 text-black">Follow us on</span>
            <Link href="https://www.facebook.com/recycle.co.uk" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-800 transition-colors">
              <Facebook className="w-5 h-5" />
              <span className="sr-only">Facebook</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}