export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { uploadToVPS } from '@/lib/vps-storage';
import { extractText } from '@/lib/extract';
import { DocumentType, DocumentFormat } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

// Infer document format from filename
function inferFormat(file: File): DocumentFormat {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, DocumentFormat> = {
    pdf: DocumentFormat.PDF,
    docx: DocumentFormat.DOCX,
    doc: DocumentFormat.DOCX,
    md: DocumentFormat.MARKDOWN,
    markdown: DocumentFormat.MARKDOWN,
    html: DocumentFormat.HTML,
    htm: DocumentFormat.HTML,
    txt: DocumentFormat.TEXT,
  };
  return map[ext] ?? DocumentFormat.TEXT;
}

function inferImageExt(file: File): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[file.type] ?? 'jpg';
}

// Admin-only guard
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
    const file = form.get('file') as File;
    const title = form.get('title') as string;
    const slug = form.get('slug') as string;
    const type = form.get('type') as DocumentType;
    const summary = (form.get('summary') as string) || undefined;
    const coverImageFile = form.get('coverImage') as File | null;

    // Upload document
    const docPath = await uploadToVPS(file, slug);

    // Upload cover image
    let coverImageUrl: string | null = null;
    if (coverImageFile && coverImageFile.size > 0) {
      const ext = inferImageExt(coverImageFile);
      const filename = `${slug}-cover.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'covers');
      await mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await coverImageFile.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);

      coverImageUrl = `/images/covers/${filename}`;
    }

    // Extract text
    const text = await extractText(file);

    // Save to DB
    await prisma.document.create({
      data: {
        slug,
        title,
        summary,
        type,
        format: inferFormat(file),
        sourcePath: docPath,
        contentText: text,
        image: coverImageUrl,
        published: true,
        versions: {
          create: { version: 1, sourcePath: docPath, contentText: text },
        },
      },
    });

    return NextResponse.redirect(new URL('/admin/docs', req.url));
  } catch (error) {
    console.error('Upload failed:', error);
    return new Response(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
