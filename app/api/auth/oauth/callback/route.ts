import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect('/?error=missing_code');
  }

  // Exchange code for token
  const tokenRes = await fetch(
    `${process.env.OAUTH_ISSUER}/oauth/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        redirect_uri: process.env.OAUTH_REDIRECT_URI,
        code,
      }),
    }
  );

  if (!tokenRes.ok) {
    return NextResponse.redirect('/?error=auth_failed');
  }

  const token = await tokenRes.json();

  // OPTIONAL: verify token / fetch user info
  const userRes = await fetch(
    `${process.env.OAUTH_ISSUER}/oauth/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }
  );

  const user = await userRes.json();

  // 🔒 enforce admin-only access
  if (!user.roles?.includes('admin')) {
    return NextResponse.redirect('/?error=unauthorized');
  }

  // Create session cookie (simple, no Redis required)
  const res = NextResponse.redirect('/admin');
  res.cookies.set('zdx_admin', token.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return res;
}
