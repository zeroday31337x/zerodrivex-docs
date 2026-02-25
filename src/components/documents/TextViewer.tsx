'use client';

type Props = {
  src: string;
};

export default function TextViewer({ src }: Props) {
  return (
    <pre className="whitespace-pre-wrap text-sm p-4 bg-zinc-950 text-zinc-100 rounded">
      {src}
    </pre>
  );
}
