import { NextRequest, NextResponse } from 'next/server';

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('zdx_admin')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/api/auth/oauth/login', req.url));
  }

  // Call your auth server introspection endpoint
  const res = await fetch(`${process.env.ZDX_OAUTH_ISSUER}/oauth/introspect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${process.env.ZDX_OAUTH_CLIENT_ID}:${process.env.ZDX_OAUTH_CLIENT_SECRET}`)
    },
    body: new URLSearchParams({ token }),
  });

  const data = await res.json();
  if (!data.active || !data.roles?.includes('admin')) {
    return NextResponse.redirect(new URL('/api/auth/oauth/login', req.url));
  }

  return NextResponse.next();
}
