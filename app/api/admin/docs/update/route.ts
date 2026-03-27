import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DocumentType } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

function inferImageExt(file: File): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[file.type] ?? 'jpg';
}

export async function POST(req: Request) {
  const form = await req.formData();

  const id = form.get('id') as string;
  const title = form.get('title') as string;
  const slug = form.get('slug') as string | null;
  const summary = form.get('summary') as string;
  const type = form.get('type') as DocumentType;
  const published = form.get('published') === 'on';
  const coverImageFile = form.get('coverImage') as File | null;

  let image: string | undefined = undefined;

  if (coverImageFile && coverImageFile.size > 0) {
    const ext = inferImageExt(coverImageFile);
    const filename = `${id}-cover.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'covers');
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await coverImageFile.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    image = `/images/covers/${filename}`;
  }

  await prisma.document.update({
    where: { id },
    data: {
      title,
      ...(slug && { slug }),
      summary,
      type,
      published,
      ...(image !== undefined && { image }),
    },
  });

  return NextResponse.redirect(new URL('/admin/docs', req.url));
}
