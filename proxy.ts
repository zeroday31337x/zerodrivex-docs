// proxy.ts
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/api/auth/oauth/login') ||
    req.nextUrl.pathname.startsWith('/api/auth/oauth/callback')
  ) {
    return NextResponse.next();
  }

  const sessionId = req.cookies.get('docs_session')?.value;
  if (!sessionId) {
    return NextResponse.redirect(new URL('/api/auth/oauth/login', req.url));
  }

  // Just check cookie exists — token validation happens in pages
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
