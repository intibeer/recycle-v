"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, LogIn, LogOut } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button"

const HeaderNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo on the Left */}
        <a href="/">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10" />
            <span className="ml-3 text-xl tracking-tighter font-ultra text-gray-900">Recycle.co.uk</span>
          </div>
        </a>

        {/* Desktop Navigation and Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <nav className="space-x-4">

          </nav>
          {user ? (
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          ) : (
            <Button onClick={handleLogin} variant="default" className="text-white font-extrabold tracking-tighter" size="sm">
              + Add an Item
            </Button>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <Menu className="h-6 w-6 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="space-y-4 p-4">
            <a href="/" className="block text-gray-700 hover:text-gray-900">Home</a>
            <a href="/about" className="block text-gray-700 hover:text-gray-900">About</a>
            <a href="/services" className="block text-gray-700 hover:text-gray-900">Services</a>
            <a href="/contact" className="block text-gray-700 hover:text-gray-900">Contact</a>
            {user ? (
              <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            ) : (
              <Button onClick={handleLogin} variant="outline" size="sm" className="w-full">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default HeaderNav;