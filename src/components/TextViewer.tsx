import fs from 'fs/promises';

type Props = {
  src: string;
};

export default async function TextViewer({ src }: Props) {
  const content = await fs.readFile(src, 'utf-8');

  return (
    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed bg-black/40 p-6 rounded-lg border border-white/10">
      {content}
    </pre>
  );
}
