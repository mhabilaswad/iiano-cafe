import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const user = request.cookies.get('user')?.value;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register'];
  
  // Check if the path is public
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token || !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For admin routes, check if user is admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/booking/:path*',
  ],
}; 