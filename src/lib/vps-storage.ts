import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_DOC_EXTS = ['pdf','docx','md','txt','html'];
const ALLOWED_IMAGE_EXTS = ['jpg','jpeg','png','webp'];

// Base directories outside public for safety
const UPLOAD_BASE = path.join(process.cwd(), 'uploads');
const DOCS_DIR = path.join(UPLOAD_BASE, 'docs');
const COVERS_DIR = path.join(UPLOAD_BASE, 'covers');

// Ensure directories exist
async function ensureDirs() {
  await fs.mkdir(DOCS_DIR, { recursive: true });
  await fs.mkdir(COVERS_DIR, { recursive: true });
}

export async function uploadDocument(file: File): Promise<string> {
  await ensureDirs();

  const origExt = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_DOC_EXTS.includes(origExt)) throw new Error('Invalid document type');

  const filename = `${randomUUID()}.${origExt}`;
  const filePath = path.join(DOCS_DIR, filename);

  // Prevent path traversal
  if (!filePath.startsWith(DOCS_DIR)) throw new Error('Invalid path');

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return filename; // will be served via API route
}

export async function uploadCoverImage(file: File): Promise<string> {
  await ensureDirs();

  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  const ext = extMap[file.type] || 'jpg';
  if (!ALLOWED_IMAGE_EXTS.includes(ext)) throw new Error('Invalid image type');

  const filename = `${randomUUID()}.${ext}`;
  const filePath = path.join(COVERS_DIR, filename);

  // Prevent path traversal
  if (!filePath.startsWith(COVERS_DIR)) throw new Error('Invalid path');

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return filename;
}
