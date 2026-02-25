import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.redirect(
    new URL('/', process.env.ZDX_OAUTH_REDIRECT_URI ?? 'http://localhost:3000')
  );
  res.cookies.delete('zdx_admin');
  return res;
}
