import { Document } from '@prisma/client';
import TextViewer from './TextViewer';
import PdfViewer from './PdfViewer';
import HtmlViewer from './HtmlViewer';

type Props = {
  doc: Document;
};

export default function DocumentViewer({ doc }: Props) {
  const content = doc.contentText ?? '';

  switch (doc.format) {
    case 'TEXT':
    case 'MARKDOWN':
      return <TextViewer content={content} />;

    case 'HTML':
      return <HtmlViewer content={content} />;

    case 'PDF':
      return <PdfViewer src={doc.sourcePath} />;

    default:
      return (
        <div className="text-red-400">
          Unsupported document format: {doc.format}
        </div>
      );
  }
}
