// src/components/documents/TextViewer.tsx
type Props = {
  text: string;
};

export default function TextViewer({ text }: Props) {
  return (
    <pre className="whitespace-pre-wrap text-sm text-white/90">
      {text}
    </pre>
  );
}
