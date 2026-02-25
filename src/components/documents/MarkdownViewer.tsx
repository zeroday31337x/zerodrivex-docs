// src/components/documents/MarkdownViewer.tsx
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  content?: string;
  src?: string;
};

export default function MarkdownViewer({ content, src }: Props) {
  if (src) {
    throw new Error('MarkdownViewer: use content, not src');
  }

  return (
    <article className="prose prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || ''}
      </ReactMarkdown>
    </article>
  );
}
