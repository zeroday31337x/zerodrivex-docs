import { NextResponse } from 'next/server';

export async function GET() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.OAUTH_CLIENT_ID!,
    redirect_uri: process.env.OAUTH_REDIRECT_URI!,
    scope: 'admin',
    state: crypto.randomUUID(),
  });

  return NextResponse.redirect(
    `${process.env.OAUTH_ISSUER}/oauth/authorize?${params.toString()}`
  );
}
