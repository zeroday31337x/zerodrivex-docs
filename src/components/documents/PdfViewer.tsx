'use client';

import { useState } from 'react';

export default function PdfViewer({ src }: { src: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full space-y-3">
      {loading && (
        <div className="text-sm text-white/50">Loading document...</div>
      )}

      <iframe
        src={src}
        onLoad={() => setLoading(false)}
        className="w-full h-[80vh] rounded-lg border border-white/10 bg-black/40"
      />

      <div className="text-xs text-white/40">
        If the document doesn’t load,{' '}
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-green-400"
        >
          open it in a new tab
        </a>.
      </div>
    </div>
  );
}
