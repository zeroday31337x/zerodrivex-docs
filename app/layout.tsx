// app/docs/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';


interface LayoutProps {
  children: ReactNode;
}

export default function DocsLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      

      {/* Main content */}
      <main className="flex-1 mx-auto max-w-5xl px-6 py-12">
        {/* Top ad */}
        <div className="mb-10">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-2867281197760221"
            data-ad-slot="DOCS_TOP_SLOT"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {children}

        {/* Bottom ad */}
        <div className="mt-12">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-2867281197760221"
            data-ad-slot="DOCS_BOTTOM_SLOT"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </main>
    </div>
  );
}
