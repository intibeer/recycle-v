"use client"

// import { useState, useEffect } from 'react';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import Image from 'next/image';

const HeaderNav = () => {
  // const [user, setUser] = useState<Session['user'] | null>(null);
  //const supabase = createClientComponentClient();
  {/* 
    useEffect(() => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event: AuthChangeEvent, session: Session | null) => {
          if (session) {
            setUser(session.user);
          } else {
            setUser(null);
          }
        }
      );

      return () => subscription.unsubscribe();
    }, [supabase.auth]);
    */}

  return (
    <header className="bg-white/60 shadow-md">
      <div className="container mx-auto px-4 sm:px-2 py-4 flex justify-between items-center">
        {/* Logo on the Left */}
        <a href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={60} height={60} />
          <img height="150px" width="150px" className="mx-2" src="/strapline.png"></img>
          {/* <span className="ml-3 text-xl tracking-tighter font-ultra text-gray-900">Recycle.co.uk</span> */}
        </a>

        {/* Desktop Navigation and Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <nav className="space-x-4">
            {/* Add navigation items here if needed */}
          </nav>
          {/* Add authentication buttons here when ready */}
        </div>

        {/* Mobile menu button can be added here when needed */}
      </div>

      {/* Mobile Menu can be added here when needed */}
    </header>
  );
}

export default HeaderNav;