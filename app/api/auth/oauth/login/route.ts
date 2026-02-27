import { NextResponse } from 'next/server';
import crypto from 'crypto';

function base64url(buffer: Buffer) {
  return buffer.toString('base64url');
}

export async function GET() {
  const clientId = process.env.ZDX_OAUTH_CLIENT_ID;
  const redirectUri = process.env.ZDX_OAUTH_REDIRECT_URI;
  const issuer = process.env.ZDX_OAUTH_ISSUER;

  if (!clientId || !redirectUri || !issuer) {
    throw new Error('OAuth environment variables not configured');
  }

  // Generate state
  const state = crypto.randomUUID();

  // Generate PKCE verifier + challenge
  const codeVerifier = base64url(crypto.randomBytes(32));
  const codeChallenge = base64url(
    crypto.createHash('sha256').update(codeVerifier).digest()
  );

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'admin',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  const response = NextResponse.redirect(
    `${issuer}/oauth/authorize?${params.toString()}`
  );

  // Store state + verifier securely (HTTP-only cookies)
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  response.cookies.set('pkce_verifier', codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return response;
}
