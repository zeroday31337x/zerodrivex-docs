// src/components/documents/UniversalDocViewer.tsx
'use client';

import HtmlViewer from './HtmlViewer';
import TextViewer from './TextViewer';

type Props = {
  format: 'HTML' | 'TEXT' | 'PDF';
  content: string;
};

export default function UniversalDocViewer({ format, content }: Props) {
  switch (format) {
    case 'HTML':
      return <HtmlViewer html={content} />;
    case 'TEXT':
      return <TextViewer text={content} />;
    default:
      return <div>Unsupported format</div>;
  }
}
