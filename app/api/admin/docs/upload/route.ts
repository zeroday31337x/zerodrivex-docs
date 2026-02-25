// app/api/admin/docs/upload/route.ts
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { uploadToGithub } from '@/lib/github';
import { extractText } from '@/lib/extract';
import { DocumentType, DocumentFormat } from '@prisma/client';

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

export async function POST(req: Request) {
  const form = await req.formData();

  const file = form.get('file') as File;
  const title = form.get('title') as string;
  const slug = form.get('slug') as string;
  const type = form.get('type') as DocumentType;

  if (!file) {
    return new Response('Missing file', { status: 400 });
  }

  // 1️⃣ Upload to GitHub
  const githubPath = await uploadToGithub(file, slug);

  // 2️⃣ Extract text (PDF / DOCX / etc)
  const text = await extractText(file);

  // 3️⃣ Create DB records
  await prisma.document.create({
    data: {
      slug,
      title,
      type,
      format: inferFormat(file),
      sourcePath: githubPath,
      contentText: text,
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
