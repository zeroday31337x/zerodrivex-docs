
// /app/api/auth/oauth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', req.url));
  }

  // Exchange code for token
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

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/?error=auth_failed', req.url));
  }

  const token = await tokenRes.json();

  // Fetch user info from external auth
  const userRes = await fetch(`${process.env.ZDX_OAUTH_ISSUER}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(new URL('/?error=auth_failed', req.url));
  }

  const user = await userRes.json();

  // Enforce admin-only access
  if (!user.roles?.includes('admin')) {
    return NextResponse.redirect(new URL('/?error=unauthorized', req.url));
  }

  // Set session cookie
  const res = NextResponse.redirect(new URL('/admin', req.url));
  res.cookies.set('docs_session', token.access_token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  domain: 'docs.zerodrivex.com',
  maxAge: 60 * 60 * 24,
});

  return res;
}
