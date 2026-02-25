type Props = {
  content: string;
};

export default function TextViewer({ content }: Props) {
  return (
    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed bg-black/40 p-6 rounded-lg border border-white/10">
      {content}
    </pre>
  );
}
