// app/api/admin/docs/upload/route.ts
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { uploadToGithub } from '@/lib/github';
import { extractText } from '@/lib/extract';
import { DocumentType, DocumentFormat } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

function inferFormat(file: File): DocumentFormat {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, DocumentFormat> = {
    pdf: DocumentFormat.PDF,
    docx: DocumentFormat.DOCX, doc: DocumentFormat.DOCX,
    md: DocumentFormat.MARKDOWN, markdown: DocumentFormat.MARKDOWN,
    html: DocumentFormat.HTML, htm: DocumentFormat.HTML,
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

export async function POST(req: Request) {
  const form = await req.formData();

  const file = form.get('file') as File;
  const title = form.get('title') as string;
  const slug = form.get('slug') as string;
  const type = form.get('type') as DocumentType;
  const summary = (form.get('summary') as string) || undefined;
  const coverImageFile = form.get('coverImage') as File | null;

  if (!file) {
    return new Response('Missing file', { status: 400 });
  }

  // 1️⃣ Upload document to GitHub (existing logic unchanged)
  const githubPath = await uploadToGithub(file, slug);

  // 2️⃣ Save cover image to VPS public folder
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

  // 3️⃣ Extract text
  const text = await extractText(file);

  // 4️⃣ Create DB record
  await prisma.document.create({
    data: {
      slug,
      title,
      summary,
      type,
      format: inferFormat(file),
      sourcePath: githubPath,
      contentText: text,
      coverImageUrl,
      published: true,
      versions: {
        create: {
          version: 1,
          sourcePath: githubPath,
          contentText: text,
        },
      },
    },
  });

  return Response.redirect('/admin/docs');
}
