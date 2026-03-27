import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const BASE = path.join(process.cwd(), 'uploads');

export async function GET(req: Request, { params }: { params: { type: string, filename: string }}) {
  const { type, filename } = params;

  // Only allow docs or covers
  if (!['docs','covers'].includes(type)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  const dir = path.join(BASE, type);
  const filePath = path.resolve(dir, filename);

  // Prevent path traversal
  if (!filePath.startsWith(dir)) return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });

  try {
    const data = await fs.readFile(filePath);
    // Return content type based on extension
    const ext = path.extname(filename).toLowerCase();
    const mime = ext === '.pdf' ? 'application/pdf'
               : ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
               : ext === '.md' || ext === '.txt' ? 'text/plain'
               : ext === '.html' ? 'text/html'
               : ext === '.jpg' ? 'image/jpeg'
               : ext === '.png' ? 'image/png'
               : ext === '.webp' ? 'image/webp'
               : 'application/octet-stream';

    return new NextResponse(data, { headers: { 'Content-Type': mime } });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
