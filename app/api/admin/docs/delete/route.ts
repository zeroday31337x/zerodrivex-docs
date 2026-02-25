export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { deleteDocument } from '@/lib/documents';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const id = form.get('id') as string;

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  await deleteDocument(id);

  return NextResponse.redirect(new URL('/admin/docs', req.url));
}
