import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/api/auth/login'];

  // Allow public routes without authentication
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Get token from cookies
  const token = req.cookies.get('token')?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/', '/settings','/dashboard/:path*', '/task/:path*'],
};
