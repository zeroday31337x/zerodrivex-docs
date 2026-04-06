import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

// Node runtime
export const runtime = 'nodejs';

// Allowed enums
const ALLOWED_TYPES = ['RESEARCH', 'WHITEPAPER', 'PRODUCT', 'BLOG', 'INTERNAL'] as const;
type DocumentType = (typeof ALLOWED_TYPES)[number];

const ALLOWED_FORMATS = ['PDF', 'DOCX', 'MARKDOWN', 'HTML', 'TEXT'] as const;
type DocumentFormat = (typeof ALLOWED_FORMATS)[number];

// Simple slug generator from title
function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .slice(0, 50); // optional max length
}

export async function POST(req: NextRequest) {
  const uploadDir = path.join(process.cwd(), 'public/images/covers');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const buffer = Buffer.from(await req.arrayBuffer());
  const fakeReq: any = {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.url,
    on: () => {},
  };

  return new Promise<Response>((resolve, reject) => {
    const form = formidable({ multiples: true, uploadDir, keepExtensions: true });

    form.parse({ ...fakeReq, rawBody: buffer } as any, async (err, fields, files) => {
      if (err) return reject(err);

      const title = fields.title as string;
      const type = fields.type as string;
      const format = fields.format as string;
      const summary = fields.summary as string;

      if (!title || !type || !format) {
        return resolve(
          NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        );
      }

      if (!ALLOWED_TYPES.includes(type as DocumentType)) {
        return resolve(
          NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
        );
      }

      if (!ALLOWED_FORMATS.includes(format as DocumentFormat)) {
        return resolve(
          NextResponse.json({ error: 'Invalid document format' }, { status: 400 })
        );
      }

      // Handle image
      let imagePath: string | null = null;
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        const fileName = `${Date.now()}_${file.originalFilename}`;
        const dest = path.join(uploadDir, fileName);
        fs.renameSync(file.filepath, dest);
        imagePath = `/images/covers/${fileName}`;
      }

      // Handle document file
      let sourcePath: string | null = null;
      if (files.file) {
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        const fileName = `${Date.now()}_${file.originalFilename}`;
        const dest = path.join(process.cwd(), 'public/documents', fileName);
        if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.renameSync(file.filepath, dest);
        sourcePath = `/documents/${fileName}`;
      }

      // Generate unique slug
      let slug = slugify(title);
      let counter = 1;
      while (
        await prisma.document.findUnique({ where: { slug } })
      ) {
        slug = slugify(title) + `-${counter++}`;
      }

      // Create document
      const doc = await prisma.document.create({
        data: {
          title,
          slug,
          type: type as DocumentType,
          format: format as DocumentFormat,
          summary,
          image: imagePath,
          sourcePath: sourcePath || '',
          published: false,
        },
      });

      resolve(NextResponse.json(doc));
    });
  });
}
