import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const title = formData.get('title')?.toString();
  const slug = formData.get('slug')?.toString();
  const summary = formData.get('summary')?.toString() || '';
  const type = formData.get('type')?.toString() as
    | 'RESEARCH'
    | 'WHITEPAPER'
    | 'PRODUCT'
    | 'BLOG'
    | 'INTERNAL';
  const file = formData.get('file') as File;
  const cover = formData.get('coverImage') as File | null;

  if (!title || !slug || !type || !file) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Save main document
  const ext = path.extname(file.name);
  const filename = `${uuid()}${ext}`;
  const docDir = path.join(process.cwd(), 'public', 'docs');
  if (!fs.existsSync(docDir)) fs.mkdirSync(docDir, { recursive: true });
  const filePath = path.join(docDir, filename);
  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

  let imageUrl: string | null = null;
  if (cover && cover.size > 0) {
    const coverExt = path.extname(cover.name);
    const coverName = `${uuid()}${coverExt}`;
    const coverDir = path.join(process.cwd(), 'public', 'images', 'covers');
    if (!fs.existsSync(coverDir)) fs.mkdirSync(coverDir, { recursive: true });
    const coverPath = path.join(coverDir, coverName);
    const coverBuffer = Buffer.from(await cover.arrayBuffer());
    fs.writeFileSync(coverPath, coverBuffer);
    imageUrl = `/images/covers/${coverName}`;
  }

  const doc = await prisma.document.create({
    data: {
      title,
      slug,
      summary,
      type,
      format: ext.replace('.', '').toUpperCase(),
      sourcePath: `/docs/${filename}`,
      image: imageUrl,
      published: false,
    },
  });

  return NextResponse.redirect(`/admin/docs/${doc.id}`);
}
