import { prisma } from '@/lib/prisma';
import { uploadDocument, uploadCoverImage } from '@/lib/vps-storage';
import { extractText } from '@/lib/extract';
import { DocumentType, DocumentFormat } from '@prisma/client';
import { NextResponse } from 'next/server';

// Dummy server-side admin check
async function requireAdmin(req: Request) {
  // Replace this with your real auth logic
  const user = { isAdmin: true }; // Example
  if (!user?.isAdmin) throw new Error('Unauthorized');
  return user;
}

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

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await requireAdmin(req);

    const form = await req.formData();
    const file = form.get('file') as File;
    const coverFile = form.get('coverImage') as File | null;
    const slug = form.get('slug') as string;
    const title = form.get('title') as string;
    const type = form.get('type') as DocumentType;
    const summary = (form.get('summary') as string) || undefined;

    // Upload document
    const docFilename = await uploadDocument(file);
    const docPath = `/api/admin/files/docs/${docFilename}`;

    // Upload cover image
    let coverPath: string | null = null;
    if (coverFile && coverFile.size > 0) {
      const coverFilename = await uploadCoverImage(coverFile);
      coverPath = `/api/admin/files/covers/${coverFilename}`;
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
        image: coverPath,
        published: true,
        versions: { create: { version: 1, sourcePath: docPath, contentText: text } },
      },
    });

    return NextResponse.redirect(new URL('/admin/docs', req.url));
  } catch (err: any) {
    console.error('❌ Upload failed:', err);
    return new Response(err.message || 'Upload failed', { status: 500 });
  }
}
