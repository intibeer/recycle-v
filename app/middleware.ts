import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Bypass authentication for the sitemap
  if (req.nextUrl.pathname == '/sitemap') {
    return res; // Allow the request to proceed
  }

  // Redirect to login if trying to access dashboard without being logged in
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res; // Continue with the request
}

// Match the routes that require middleware
export const config = {
  matcher: ['/dashboard/:path*', '/sitemap'], // Include sitemap in matcher
}
