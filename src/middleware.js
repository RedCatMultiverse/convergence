import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Public paths that don't require authentication
    const publicPaths = ['/', '/auth/signin', '/auth/error', '/auth/verify-request'];
    
    // If user is authenticated and tries to access auth pages, redirect to home
    if (token && pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Allow access to public paths
    if (publicPaths.includes(pathname)) {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public paths without authentication
        if (pathname === '/' || pathname.startsWith('/auth/')) {
          return true;
        }

        // Require authentication for all other paths
        return !!token;
      },
    },
  }
);

// Configure which paths require authentication
export const config = {
  matcher: [
    // Match all paths except:
    // - images (static files)
    // - api (API routes)
    // - _next/static (Next.js static files)
    // - _next/image (Next.js image optimization)
    // - favicon.ico (browser icon)
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
}; 