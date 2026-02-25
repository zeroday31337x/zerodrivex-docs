// src/components/documents/DocxViewer.tsx
'use client';

import { useEffect, useRef } from 'react';
import { renderAsync } from 'docx-preview';

type Props = {
  src: string;
};

export default function DocxViewer({ src }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch(src);
      const blob = await res.blob();

      if (!cancelled && containerRef.current) {
        containerRef.current.innerHTML = '';
        await renderAsync(blob, containerRef.current);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div className="prose prose-invert max-w-none">
      <div ref={containerRef} />
    </div>
  );
}
