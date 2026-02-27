// file: /middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Allow login + callback routes
  if (
    req.nextUrl.pathname.startsWith('/api/auth/oauth/login') ||
    req.nextUrl.pathname.startsWith('/api/auth/oauth/callback')
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('zdx_admin')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/api/auth/oauth/login', req.url));
  }

  // Optional: verify token here if you want
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
