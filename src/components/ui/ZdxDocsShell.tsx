'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

export type StatusTone =
  | 'default'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';

type HeaderProps = {
  title: string;
  subtitle?: string;
  status?: {
    label: string;
    tone?: StatusTone;
  };
};

type Props = {
  children: ReactNode;
  headerProps?: HeaderProps;
};

export default function ZdxDocsShell({ children, headerProps }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          {headerProps && (
            <div className="mb-8 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400">
                {headerProps.title}
              </h1>

              {headerProps.subtitle && (
                <p className="text-white/60 mt-2 max-w-3xl">
                  {headerProps.subtitle}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="overflow-x-auto border border-white/10 rounded-lg p-4 sm:p-6 bg-white/5">
            {children}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 sm:px-6 md:px-8 py-4 text-xs text-white/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
          <span>© {new Date().getFullYear()} ZeroDriveX</span>
          <span>Docs Runtime</span>
        </div>
      </footer>
    </div>
  );
}
