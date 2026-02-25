import { Document } from '@prisma/client';
import TextViewer from './viewers/TextViewer';
import PdfViewer from './viewers/PdfViewer';
import HtmlViewer from './viewers/HtmlViewer';

type Props = {
  doc: Document;
};

export default function DocumentViewer({ doc }: Props) {
  const mime = doc.mimeType ?? '';

  if (mime.startsWith('text/')) {
    return <TextViewer src={doc.sourcePath} />;
  }

  if (mime === 'application/pdf') {
    return <PdfViewer src={doc.sourcePath} />;
  }

  if (mime === 'text/html') {
    return <HtmlViewer src={doc.sourcePath} />;
  }

  return (
    <div className="text-red-400">
      Unsupported document type: {mime}
    </div>
  );
}
