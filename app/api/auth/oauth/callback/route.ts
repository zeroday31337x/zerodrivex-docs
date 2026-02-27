// /app/api/auth/oauth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) return NextResponse.redirect(new URL('/?error=missing_code', req.url));

  // Exchange code for access token
  const tokenRes = await fetch(`${process.env.ZDX_OAUTH_ISSUER}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.ZDX_OAUTH_CLIENT_ID,
      client_secret: process.env.ZDX_OAUTH_CLIENT_SECRET,
      redirect_uri: process.env.ZDX_OAUTH_REDIRECT_URI,
      code,
    }),
  });

  if (!tokenRes.ok) return NextResponse.redirect(new URL('/?error=auth_failed', req.url));
  const token = await tokenRes.json();

  // Fetch user info
  const userRes = await fetch(`${process.env.ZDX_OAUTH_ISSUER}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });

  if (!userRes.ok) return NextResponse.redirect(new URL('/?error=auth_failed', req.url));
  const user = await userRes.json();

  if (!user.roles?.includes('admin')) {
    return NextResponse.redirect(new URL('/?error=unauthorized', req.url));
  }

  // ✅ Create docs-only session
  const sessionId = crypto.randomUUID();
  await prisma.docsSession.create({
    data: {
      id: sessionId,
      userId: user.id,
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4h
    },
  });

  // Set session cookie
  const res = NextResponse.redirect(new URL('/admin', req.url));
  res.cookies.set('docs_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 4 * 60 * 60, // 4h
  });

  return res;
}
