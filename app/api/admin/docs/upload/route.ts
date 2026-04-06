import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const uploadDir = path.join(process.cwd(), 'public/images/covers');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Convert request to buffer (REQUIRED for formidable in App Router)
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

      let imagePath: string | null = null;
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        const fileName = `${Date.now()}_${file.originalFilename}`;
        const dest = path.join(uploadDir, fileName);
        fs.renameSync(file.filepath, dest);
        imagePath = `/images/covers/${fileName}`;
      }

      let sourcePath: string | null = null;
      if (files.file) {
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        const fileName = `${Date.now()}_${file.originalFilename}`;
        const dest = path.join(process.cwd(), 'public/documents', fileName);

        if (!fs.existsSync(path.dirname(dest))) {
          fs.mkdirSync(path.dirname(dest), { recursive: true });
        }

        fs.renameSync(file.filepath, dest);
        sourcePath = `/documents/${fileName}`;
      }

      const doc = await prisma.document.create({
        data: {
          title,
          type,
          format,
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
