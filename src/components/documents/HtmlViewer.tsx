// src/components/documents/HtmlViewer.tsx
type Props = {
  html: string;
};

export default function HtmlViewer({ html }: Props) {
  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
