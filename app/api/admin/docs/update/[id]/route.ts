import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

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

      const updateData: any = { title, type, format, summary };

      // Handle image
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        const fileName = `${Date.now()}_${file.originalFilename}`;
        const dest = path.join(uploadDir, fileName);
        fs.renameSync(file.filepath, dest);
        updateData.image = `/images/covers/${fileName}`;
      }

      // Handle document file
      if (files.file) {
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        const fileName = `${Date.now()}_${file.originalFilename}`;
        const dest = path.join(process.cwd(), 'public/documents', fileName);

        if (!fs.existsSync(path.dirname(dest))) {
          fs.mkdirSync(path.dirname(dest), { recursive: true });
        }

        fs.renameSync(file.filepath, dest);
        updateData.sourcePath = `/documents/${fileName}`;
      }

      const doc = await prisma.document.update({
        where: { id: numericId },
        data: updateData,
      });

      resolve(NextResponse.json(doc));
    });
  });
}
