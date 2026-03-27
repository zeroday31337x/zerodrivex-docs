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
  | 'docx'
  | 'image'; // ✅ add this

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

    case 'image':
      return src ? (
        <img
          src={src}
          alt="document"
          className="w-full rounded-lg border border-white/10"
        />
      ) : null;

    case 'pdf':
      return src ? <PdfViewer src={src} /> : null;

    case 'html':
      return content ? <HtmlViewer content={content} /> : null;

    case 'txt':
      if (content) return <TextViewer content={content} />;
      if (src) return <iframe src={src} className="w-full h-[80vh] border border-white/10 rounded-lg" />;
      return null;

    case 'md':
      if (content) return <MarkdownViewer content={content} />;
      if (src) return <iframe src={src} className="w-full h-[80vh] border border-white/10 rounded-lg" />;
      return null;

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
