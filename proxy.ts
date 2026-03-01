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

  // Validate session via API instead of Prisma directly
  const res = await fetch(`${req.nextUrl.origin}/api/auth/session/validate`, {
    headers: { Cookie: `docs_session=${sessionId}` }
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL('/api/auth/oauth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
