// /proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function proxy(req: NextRequest) {
  // Allow login + callback to pass through
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

  const session = await prisma.docsSession.findUnique({ where: { id: sessionId } });
  if (!session || session.expiresAt < new Date()) {
    return NextResponse.redirect(new URL('/api/auth/oauth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
