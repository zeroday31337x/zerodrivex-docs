import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const token = req.cookies.get('zdx_admin')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/api/auth/oauth/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
