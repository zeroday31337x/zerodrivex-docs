'use client';

import TextViewer from './TextViewer';
import PdfViewer from './PdfViewer';
import HtmlViewer from './HtmlViewer';

type DocumentLike = {
  format: 'pdf' | 'html' | 'text' | 'markdown';
  src: string;
};

export default function DocumentViewer({
  document,
}: {
  document: DocumentLike;
}) {
  switch (document.format) {
    case 'pdf':
      return <PdfViewer src={document.src} />;

    case 'html':
      return <HtmlViewer src={document.src} />;

    case 'markdown':
    case 'text':
    default:
      return <TextViewer src={document.src} />;
  }
}
