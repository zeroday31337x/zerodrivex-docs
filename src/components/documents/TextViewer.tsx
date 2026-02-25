'use client';

export default function HtmlViewer({ src }: { src: string }) {
  return (
    <div
      className="prose prose-invert max-w-none p-4"
      dangerouslySetInnerHTML={{ __html: src }}
    />
  );
}
