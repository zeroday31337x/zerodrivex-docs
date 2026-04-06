import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; // replaces the old config

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const uploadDir = path.join(process.cwd(), 'public/images/covers');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  // Convert NextRequest to a Node.js compatible request for formidable
  const buffer = Buffer.from(await req.arrayBuffer());
  const fakeReq: any = {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.url,
    on: () => {}, // dummy function required by formidable
  };

  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true, uploadDir, keepExtensions: true });

    // Use `form.parse` on the fake request
    form.parse({ ...fakeReq, rawBody: buffer } as any, async (err, fields, files) => {
      if (err) return reject(err);

      const id = parseInt(params.id, 10);
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
        if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.renameSync(file.filepath, dest);
        updateData.sourcePath = `/documents/${fileName}`;
      }

      const doc = await prisma.document.update({
        where: { id },
        data: updateData,
      });

      resolve(NextResponse.json(doc));
    });
  });
}
