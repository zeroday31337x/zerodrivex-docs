import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const id = formData.get('id')?.toString();
  const title = formData.get('title')?.toString();
  const slug = formData.get('slug')?.toString();
  const summary = formData.get('summary')?.toString() || '';
  const type = formData.get('type')?.toString() as
    | 'RESEARCH'
    | 'WHITEPAPER'
    | 'PRODUCT'
    | 'BLOG'
    | 'INTERNAL';
  const published = formData.get('published') === 'on';
  const cover = formData.get('coverImage') as File | null;

  if (!id || !title || !slug || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const updateData: any = { title, slug, summary, type, published };

  if (cover && cover.size > 0) {
    const coverExt = path.extname(cover.name);
    const coverName = `${uuid()}${coverExt}`;
    const coverDir = path.join(process.cwd(), 'public', 'images', 'covers');
    if (!fs.existsSync(coverDir)) fs.mkdirSync(coverDir, { recursive: true });
    const coverPath = path.join(coverDir, coverName);
    const coverBuffer = Buffer.from(await cover.arrayBuffer());
    fs.writeFileSync(coverPath, coverBuffer);
    updateData.image = `/images/covers/${coverName}`;
  }

  await prisma.document.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.redirect(`/admin/docs/${id}`);
}
