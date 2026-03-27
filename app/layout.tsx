// app/docs/layout.tsx
'use client';

import './globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

export const metadata = {
  title: 'ZeroDriveX Docs',
  description: 'Research, whitepapers, and technical documentation',
};

interface LayoutProps {
  children: ReactNode;
}

export default function DocsLayout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = [
    { href: '/docs', label: 'All Docs' },
    { href: '/docs/product', label: 'Product' },
    { href: '/docs/research', label: 'Research' },
    { href: '/docs/whitepaper', label: 'Whitepapers' },
    { href: '/docs/internal', label: 'Internal' },
  ];

  return (
    <html lang="en">
      <head>
        {/* AdSense Loader */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2867281197760221"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-black text-white min-h-screen flex">

        {/* Sidebar desktop */}
        <aside className="hidden md:flex md:flex-col w-64 border-r border-white/10 bg-black/90 p-4">
          <h1 className="text-xl font-bold mb-6">ZeroDriveX Docs</h1>
          <nav className="flex flex-col gap-3">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile sidebar */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="fixed top-4 left-4 z-50 px-3 py-2 bg-green-600 rounded-lg"
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>

          {mobileOpen && (
            <aside className="fixed inset-0 z-40 bg-black/95 p-4 flex flex-col gap-3">
              {sections.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  {s.label}
                </Link>
              ))}
            </aside>
          )}
        </div>

        {/* Main content */}
        <main className="flex-1 mx-auto max-w-5xl px-6 py-12">

          {/* Top documentation ad */}
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

          {/* Bottom documentation ad */}
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

        <footer className="border-t border-white/10 px-6 py-4 text-xs text-white/50 w-full">
          <div className="max-w-5xl mx-auto flex justify-between">
            <span>© {new Date().getFullYear()} ZeroDriveX</span>
            <span>Docs Runtime</span>
          </div>
        </footer>

      </body>
    </html>
  );
}
