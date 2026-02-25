'use client';

export default function HtmlDocViewer({ html }: { html: string }) {
  return (
    <div
      className="prose prose-invert max-w-none p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
