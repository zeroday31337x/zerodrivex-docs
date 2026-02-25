'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';

import Footer from '@/components/Footer';
import ZdxHeader from '@/components/ui/ZdxHeader';
import ZdxBadge from '@/components/ui/ZdxBadge';

/* -------------------------------- Types -------------------------------- */

export type StatusTone =
  | 'default'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';

export type ZdxHeaderProps = {
  title: string;
  subtitle?: string;
  status?: {
    label: string;
    tone?: StatusTone;
  };
};

type Props = {
  children: ReactNode;
  className?: string;
  containerClass?: string;
  showFrame?: boolean;
  showQuickLinks?: boolean;
  headerProps?: ZdxHeaderProps;
};

/* ---------------------------- Runtime helpers --------------------------- */

type RuntimeTheme = {
  bg?: string;
  headerBg?: string;
  tone?: StatusTone;
  dot?: string;
};

type RuntimePayload = {
  label?: string;
  state?: string;
  theme?: RuntimeTheme;
};

function fallbackTheme(state?: string): RuntimeTheme {
  const s = (state || 'online').toLowerCase();

  if (s === 'maintenance') {
    return {
      bg: 'bg-yellow-950',
      headerBg: 'bg-yellow-900/40',
      tone: 'warning',
      dot: 'bg-yellow-400',
    };
  }

  if (s === 'offline') {
    return {
      bg: 'bg-red-950',
      headerBg: 'bg-red-900/50',
      tone: 'danger',
      dot: 'bg-red-500',
    };
  }

  return {
    bg: 'bg-black',
    headerBg: 'bg-black/60',
    tone: 'info',
    dot: 'bg-blue-400',
  };
}

/* -------------------------------- Shell -------------------------------- */

export default function ZdxDocsShell({
  children,
  className = '',
  containerClass = '',
  showFrame = true,
  showQuickLinks = true,
  headerProps,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [runtime, setRuntime] = useState<RuntimePayload>({
    label: 'Docs Runtime',
    state: 'online',
  });

  useEffect(() => {
    setMounted(true);

    (async () => {
      try {
        const res = await fetch('/api/public/runtime', {
          credentials: 'omit',
        });

        if (!res.ok) return;
        const data = await res.json();
        if (data?.runtime) setRuntime(data.runtime);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const theme = runtime.theme ?? fallbackTheme(runtime.state);
  const label = runtime.label || 'Docs';

  return (
    <div
      className={`flex flex-col min-h-[100dvh] w-full text-white transition-colors duration-500 ${
        theme.bg || 'bg-black'
      }`}
    >
      {/* ----------------------------- Header ----------------------------- */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-md border-b border-white/10 px-6 lg:px-8 py-3 ${
          theme.headerBg || 'bg-black/60'
        }`}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-bold tracking-widest uppercase text-sm"
          >
            ZeroDriveX Docs
          </Link>

          <div className="h-4 w-px bg-white/10" />

          <div className="hidden sm:flex items-center gap-3">
            <ZdxBadge tone={theme.tone || 'info'}>
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 animate-pulse ${
                  theme.dot || 'bg-blue-400'
                }`}
              />
              {label}
            </ZdxBadge>
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

      {/* ------------------------------ Main ------------------------------ */}
      <main className={`flex-1 px-6 lg:px-8 pt-8 pb-20 ${className}`}>
        <div className={`max-w-7xl mx-auto ${containerClass}`}>
          {headerProps && (
            <div className="mb-6">
              <ZdxHeader {...headerProps} />
            </div>
          )}

          {showFrame ? (
            <div className="glass-panel p-8 rounded-2xl">
              {children}
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      {/* ----------------------------- Footer ----------------------------- */}
      <footer className="border-t border-white/10 bg-black/80 backdrop-blur-md px-6 lg:px-8 py-6">
        <Footer />
      </footer>

      {!mounted && <style>{`html { visibility: hidden; }`}</style>}
      {mounted && <style>{`html { visibility: visible; }`}</style>}
    </div>
  );
}
