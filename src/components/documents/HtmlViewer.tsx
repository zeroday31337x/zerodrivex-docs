import fs from 'fs/promises';

export default async function HtmlViewer({ src }: { src: string }) {
  const html = await fs.readFile(src, 'utf-8');

  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
