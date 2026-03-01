// /app/api/auth/oauth/login/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('CLIENT_ID:', process.env.ZDX_OAUTH_CLIENT_ID);
  console.log('REDIRECT_URI:', process.env.ZDX_OAUTH_REDIRECT_URI);
  console.log('ISSUER:', process.env.ZDX_OAUTH_ISSUER);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.ZDX_OAUTH_CLIENT_ID!,
    redirect_uri: process.env.ZDX_OAUTH_REDIRECT_URI!,
    scope: 'admin',
    state: crypto.randomUUID(),
  });

  return NextResponse.redirect(
    `${process.env.ZDX_OAUTH_ISSUER}/oauth/authorize?${params.toString()}`
  );
}
