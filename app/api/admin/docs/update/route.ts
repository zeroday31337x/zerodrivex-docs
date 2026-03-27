export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { uploadToVPS } from '@/lib/vps-storage';
import { extractText } from '@/lib/extract';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

async function ensureAdmin(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    throw new Error('Unauthorized');
  }
}

function inferImageExt(file: File): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[file.type] ?? 'jpg';
}

export async function POST(req: Request) {
  try {
    await ensureAdmin(req);

    const form = await req.formData();
    const id = form.get('id') as string;
    const title = form.get('title') as string;
    const slug = form.get('slug') as string;
    const type = form.get('type') as string;
    const summary = (form.get('summary') as string) || undefined;
    const published = form.get('published') === 'on';
    const coverImageFile = form.get('coverImage') as File | null;

    const updateData: any = { title, slug, type, summary, published };

    if (coverImageFile && coverImageFile.size > 0) {
      const ext = inferImageExt(coverImageFile);
      const filename = `${slug}-cover.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'covers');
      await mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await coverImageFile.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);

      updateData.image = `/images/covers/${filename}`;
    }

    await prisma.document.update({ where: { id }, data: updateData });

    return NextResponse.redirect(new URL('/admin/docs', req.url));
  } catch (error) {
    console.error('Update failed:', error);
    return new Response(`Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
