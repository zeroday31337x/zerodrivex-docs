import { notFound } from 'next/navigation'
import { getDocumentBySlug } from '@/lib/documents'

export default async function DocPage({ params }) {
  const { slug } = await params
  const doc = await getDocumentBySlug(slug)

  if (!doc) return notFound()

  return (
    <div className="zdx-root">
      <style>{`
        :root {
          --bg:#080c10; --surface:#0d1318; --border:#1a2530;
          --accent:#00e5ff; --accent2:#7fff00; --accent3:#ff6b35;
          --text:#c8d8e0; --text-dim:#5a7a8a;
        }

        body { margin:0 }

        .zdx-root {
          background: var(--bg);
          color: var(--text);
          min-height:100vh;
          font-family: 'Barlow', sans-serif;
          position:relative;
        }

        .zdx-root::before {
          content:''; position:fixed; inset:0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,229,255,0.015) 2px,
            rgba(0,229,255,0.015) 4px
          );
          pointer-events:none; z-index:1;
        }

        .zdx-root::after {
          content:''; position:fixed; inset:0;
          background-image:
            linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
          background-size:40px 40px;
          pointer-events:none; z-index:0;
        }

        .wrapper {
          position:relative; z-index:2;
          max-width:860px;
          margin:0 auto;
          padding:80px 40px 120px;
        }

        .cover {
          border-bottom:1px solid var(--border);
          padding-bottom:60px;
          margin-bottom:72px;
        }

        .cover-label {
          font-family: monospace;
          font-size:11px;
          letter-spacing:.25em;
          color:var(--accent);
          margin-bottom:32px;
        }

        .cover-title {
          font-family: monospace;
          font-size: clamp(28px,5vw,48px);
          color:#fff;
          margin-bottom:8px;
        }

        .cover-title span { color:var(--accent) }

        .cover-subtitle {
          font-size:18px;
          color:var(--text-dim);
          margin-bottom:40px;
        }

        .abstract {
          background:var(--surface);
          border:1px solid var(--border);
          border-left:3px solid var(--accent);
          padding:28px 32px;
          margin-bottom:72px;
        }

        section { margin-bottom:72px }

        h2 {
          font-family: monospace;
          font-size:22px;
          color:#fff;
          margin-bottom:24px;
          border-bottom:1px solid var(--border);
          padding-bottom:12px;
        }

        p { margin-bottom:16px }
      `}</style>

      <div className="wrapper">

        {/* COVER */}
        <div className="cover">
          <div className="cover-label">ZeroDriveX LLC — Dynamic Document</div>
          <div className="cover-title">
            {doc.title}
