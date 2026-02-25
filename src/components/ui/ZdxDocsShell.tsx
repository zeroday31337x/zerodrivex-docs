'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';

export type StatusTone = 'default' | 'success' | 'info' | 'warning' | 'danger';

type Props = {
  children: ReactNode;
  className?: string;
  containerClass?: string;
  showFrame?: boolean;
  showQuickLinks?: boolean;
  title?: string;
  subtitle?: string;
};

type RuntimeTheme = {
  bg: string;
  headerBg: string;
  dot: string;
};

function resolveTheme(state?: string): RuntimeTheme {
  switch ((state || 'online').toLowerCase()) {
    case 'maintenance':
      return {
        bg: 'bg-yellow-950',
        headerBg: 'bg-yellow-900/60',
        dot: 'bg-yellow-400',
      };
    case 'offline':
      return {
        bg: 'bg-red-950',
        headerBg: 'bg-red-900/60',
        dot: 'bg-red-500',
      };
    default:
      return {
        bg: 'bg-black',
        headerBg: 'bg-black/70',
        dot: 'bg-green-400',
      };
  }
}

export default function ZdxDocsShell({
  children,
  className = '',
  containerClass = '',
  showFrame = true,
  showQuickLinks = true,
  title = 'ZeroDriveX Documentation',
  subtitle,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [runtimeState] = useState<'online' | 'offline' | 'maintenance'>(
    'online'
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = resolveTheme(runtimeState);

  return (
    <div
      className={`flex flex-col min-h-[100dvh] w-full text-white ${theme.bg}`}
    >
      {/* HEADER */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-md border-b border-white/10 px-6 lg:px-8 py-3 ${theme.headerBg}`}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-bold tracking-widest uppercase text-sm"
          >
            ZeroDriveX Docs
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70">
            <span
              className={`inline-block w-2 h-2 rounded-full ${theme.dot}`}
            />
            runtime online
          </div>

          {showQuickLinks && (
            <nav className="ml-auto flex items-center gap-3 text-sm">
              <Link
                href="/research"
                className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition"
              >
                Research
              </Link>
              <Link
                href="/whitepapers"
                className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition"
              >
                Whitepapers
              </Link>
              <Link
                href="/archive"
                className="px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 transition"
              >
                Archive
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main
        className={`flex-1 px-6 lg:px-8 pt-8 pb-20 w-full ${className}`}
      >
        <div className={`max-w-7xl mx-auto ${containerClass}`}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-white/60 mt-1">{subtitle}</p>
            )}
          </div>

          {showFrame ? (
            <div className="glass-panel p-8 rounded-2xl">
              {children}
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/80 px-6 lg:px-8 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} ZeroDriveX — Documentation
      </footer>

      {!mounted && <style>{`html { visibility: hidden; }`}</style>}
      {mounted && <style>{`html { visibility: visible; }`}</style>}
    </div>
  );
}
