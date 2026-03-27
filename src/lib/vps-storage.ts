import fs from 'fs/promises';
import path from 'path';
import { DocumentFormat } from '@prisma/client';

export async function uploadToVPS(file: File, slug: string): Promise<string> {
  // Convert File to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Get format from filename
  const format = file.name.split('.').pop()?.toLowerCase() as DocumentFormat || DocumentFormat.TEXT;
  const ext = format.toLowerCase();
  
  // VPS storage path (relative to project root)
  const fileName = `${slug}.${ext}`;
  const storageDir = path.join(process.cwd(), 'public', 'docs');
  const filePath = path.join(storageDir, fileName);
  const publicPath = `/docs/${fileName}`;  // URL path for frontend
  
  // Ensure directory exists
  await fs.mkdir(storageDir, { recursive: true });
  
  // Write file
  await fs.writeFile(filePath, buffer);
  
  console.log(`✅ Saved to VPS: ${publicPath}`);
  return publicPath;
}

