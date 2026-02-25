// app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import ZdxDocsShell from '@/components/ui/ZdxDocsShell';

export const metadata = {
  title: 'ZeroDriveX Docs',
  description: 'Research, whitepapers, and technical documentation',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ZdxDocsShell
          headerProps={{
            title: 'ZeroDriveX Documentation',
            subtitle: 'Research • Whitepapers • Specifications',
            status: { label: 'Docs', tone: 'info' },
          }}
        >
          {children}
        </ZdxDocsShell>
      </body>
    </html>
  );
}
