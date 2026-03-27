// proxy.ts
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(req: NextRequest) {
  const session = req.cookies.get('docs_session')?.value;
  const adminPassword = process.env.DOCS_ADMIN_PASSWORD;

  if (!session || session !== adminPassword) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
