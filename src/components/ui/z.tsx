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
      {/* Header */}

      {headerProps && (
  <div className="mb-6">
    <h1 className="text-3xl font-bold">
      {headerProps.title}
    </h1>
    {headerProps.subtitle && (
      <p className="text-white/60 mt-2">
        {headerProps.subtitle}
      </p>
    )}
  </div>
)}
      {/* Main */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {headerProps && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold">
                {headerProps.title}
              </h1>
              {headerProps.subtitle && (
                <p className="text-white/60 mt-2">
                  {headerProps.subtitle}
                </p>
              )}
            </div>
          )}

          <div className="border border-white/10 rounded-lg p-6 bg-white/5">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 text-xs text-white/50">
        <div className="max-w-7xl mx-auto flex justify-between">
          <span>© {new Date().getFullYear()} ZeroDriveX</span>
          <span>Docs Runtime</span>
        </div>
      </footer>
    </div>
  );
}
