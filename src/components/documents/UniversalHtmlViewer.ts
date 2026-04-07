'use client';

import React from 'react';

export default function UniversalHtmlViewer({ content }: { content: string }) {
  // content should already be HTML (converted from DOCX, PDF, Markdown, or TEXT)
  return (
    <div className="zdx-vm-root">
      <style>{`
        :root {
          --bg:#080c10;
          --surface:#0d1318;
          --border:#1a2530;
          --accent:#00e5ff;
          --accent2:#7fff00;
          --accent3:#ff6b35;
          --text:#c8d8e0;
          --text-dim:#5a7a8a;
        }
        .zdx-vm-root { 
          background: var(--bg); 
          color: var(--text); 
          min-height:100vh; 
          font-family: 'Barlow', sans-serif; 
          position:relative; 
          padding: 80px 40px 120px; 
          max-width: 860px; 
          margin: 0 auto;
        }
        .zdx-vm-content { 
          background: var(--surface); 
          border:1px solid var(--border); 
          border-left:3px solid var(--accent); 
          padding: 28px 32px; 
          margin-bottom:72px; 
        }
        .zdx-vm-content pre {
          white-space: pre-wrap; 
          font-family: monospace; 
          color:#c8d8e0;
        }
      `}</style>

      <div className="zdx-vm-content" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
