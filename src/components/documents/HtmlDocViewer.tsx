'use client';

export default function HtmlViewer({ content }: { content: string }) {
  return (
    <div
      className="prose prose-invert max-w-none p-4"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
