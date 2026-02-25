type Props = {
  content: string;
};

export default function HtmlViewer({ content }: Props) {
  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
