// src/components/documents/UniversalDocViewer.tsx
'use client';

import PdfViewer from './PdfViewer';
import HtmlViewer from './HtmlViewer';
import TextViewer from './TextViewer';
import DocxViewer from './DocxViewer';
import MarkdownViewer from './MarkdownViewer';

export type DocType =
  | 'pdf'
  | 'html'
  | 'txt'
  | 'md'
  | 'docx';

type Props = {
  type: DocType;
  src?: string;
  content?: string;
};

export default function UniversalDocViewer({
  type,
  src,
  content,
}: Props) {
  switch (type) {
    case 'pdf':
      return src ? <PdfViewer src={src} /> : null;

    case 'html':
      return src ? <HtmlViewer src={src} /> : null;

    case 'txt':
      return content ? <TextViewer content={content} /> : null;

    case 'md':
      return content ? <MarkdownViewer content={content} /> : null;

    case 'docx':
      return src ? <DocxViewer src={src} /> : null;

    default:
      return (
        <div className="text-sm text-red-400">
          Unsupported document type
        </div>
      );
  }
}
