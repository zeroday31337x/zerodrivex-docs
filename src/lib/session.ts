import { cookies } from 'next/headers';

export async function getAdminSession() {
  const token = (await cookies()).get('docs_session')?.value; // ← changed from zdx_admin
  if (!token) return null;

  const res = await fetch(`${process.env.ZDX_OAUTH_ISSUER}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const user = await res.json();
  if (!user.roles?.includes('admin')) return null;

  return user as { email: string; roles: string[]; [key: string]: unknown };
}
