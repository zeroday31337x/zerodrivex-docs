'use client';

import TextViewer from './TextViewer';
import PdfViewer from './PdfViewer';
import HtmlViewer from './HtmlViewer';

export type DocumentData = {
  type: 'text' | 'pdf' | 'html';
  src: string;
};

export default function DocumentViewer({
  document,
}: {
  document: DocumentData;
}) {
  switch (document.type) {
    case 'pdf':
      return <PdfViewer src={document.src} />;

    case 'html':
      return <HtmlViewer src={document.src} />;

    case 'text':
    default:
      return <TextViewer src={document.src} />;
  }
}
