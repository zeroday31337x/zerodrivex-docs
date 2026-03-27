// app/docs/layout.tsx
import './globals.css'
import type { ReactNode } from 'react'
import Script from 'next/script'

export const metadata = {
  title: 'ZeroDriveX Docs',
  description: 'Research, whitepapers, and technical documentation',
}

export default function RootLayout({ children }: { children: ReactNode }) {
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

      <body className="bg-black text-white min-h-screen">
        <main className="mx-auto max-w-5xl px-6 py-12">

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
      </body>
    </html>
  )
}
