import { extractPdf } from './pdf';
import { extractDocx } from './docx';
import { extractMarkdown } from './markdown';
import { extractHtml } from './html';
import { extractTextPlain } from './text';

export async function extractText(file: File): Promise<string | null> {
  const buffer = Buffer.from(await file.arrayBuffer());

  switch (file.type) {
    case 'application/pdf':
      return extractPdf(buffer);

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return extractDocx(buffer);

    case 'text/markdown':
    case 'text/x-markdown':
      return extractMarkdown(buffer);

    case 'text/html':
      return extractHtml(buffer);

    case 'text/plain':
      return extractTextPlain(buffer);

    default:
      return null;
  }
}
