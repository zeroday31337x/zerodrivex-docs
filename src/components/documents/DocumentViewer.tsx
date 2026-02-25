'use client';

import TextViewer from './TextViewer';
import PdfViewer from './PdfViewer';
import HtmlViewer from './HtmlViewer';

export type DocType = 'text' | 'pdf' | 'html';

export type DocumentData = {
  type: DocType;
  src: string;
};

type Props = {
  document: DocumentData;
};

export default function DocumentViewer({ document }: Props) {
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
