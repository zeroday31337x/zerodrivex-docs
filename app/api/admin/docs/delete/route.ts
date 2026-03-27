// app/api/admin/docs/update/route.ts

export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

async function ensureAdmin(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    throw new Error('Unauthorized');
  }
}

export async function POST(req: Request) {
  try {
    await ensureAdmin(req);

    const form = await req.formData();
    const id = form.get('id') as string;

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) throw new Error('Document not found');

    // Delete document file
    if (doc.sourcePath.startsWith('/docs/')) {
      await unlink(path.join(process.cwd(), 'public', doc.sourcePath));
    }

    // Delete cover image
    if (doc.image?.startsWith('/images/covers/')) {
      await unlink(path.join(process.cwd(), 'public', doc.image));
    }

    await prisma.document.delete({ where: { id } });

    return NextResponse.redirect(new URL('/admin/docs', req.url));
  } catch (error) {
    console.error('Delete failed:', error);
    return new Response(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
