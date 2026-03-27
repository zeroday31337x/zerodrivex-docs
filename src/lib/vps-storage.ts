import fs from 'fs/promises';
import path from 'path';
import { DocumentFormat } from '@prisma/client';

const ALLOWED_DOC_EXTS = ['pdf','docx','doc','md','markdown','html','htm','txt'];

export async function uploadToVPS(file: File, slug: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_DOC_EXTS.includes(ext)) throw new Error('Invalid document type');

  const fileName = `${slug}.${ext}`;
  const storageDir = path.join(process.cwd(), 'public', 'docs');
  const filePath = path.join(storageDir, fileName);
  const publicPath = `/docs/${fileName}`;

  await fs.mkdir(storageDir, { recursive: true });
  await fs.writeFile(filePath, buffer);

  console.log(`✅ Saved to VPS: ${publicPath}`);
  return publicPath;
}
