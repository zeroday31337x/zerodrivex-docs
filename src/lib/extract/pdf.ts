// src/lib/extract/pdf.ts
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string }>;

export async function extractPdf(buffer: Buffer) {
  const data = await pdf(buffer);
  return data.text;
}
