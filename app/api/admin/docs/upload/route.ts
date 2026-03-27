import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { prisma } from '@/lib/prisma';

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const form = new formidable.IncomingForm();
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'covers');
  fs.mkdirSync(uploadDir, { recursive: true });

  const data: any = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const { title, slug, summary, type } = data.fields;
  const file = data.files.file;
  const cover = data.files.coverImage;

  let coverUrl = null;
  if (cover && cover[0]) {
    const fileExt = path.extname(cover[0].originalFilename || '');
    const filename = `${Date.now()}-${slug}${fileExt}`;
    const filepath = path.join(uploadDir, filename);
    fs.copyFileSync(cover[0].filepath, filepath);
    coverUrl = `/images/covers/${filename}`;
  }

  // Save document
  const doc = await prisma.document.create({
    data: {
      title,
      slug,
      summary,
      type,
      format: path.extname(file[0].originalFilename || '').slice(1).toUpperCase(),
      sourcePath: `/images/covers/${file[0].originalFilename}`, // optionally move file too
      image: coverUrl,
      published: false,
    },
  });

  return NextResponse.redirect(`/admin/docs/${doc.id}`);
}
