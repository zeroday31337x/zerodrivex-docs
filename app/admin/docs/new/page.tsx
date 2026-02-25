'use client';

import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import Link from 'next/link';
import { useState } from 'react';

export default function NewDocPage() {
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch('/api/admin/docs/upload', { method: 'POST', body: data });

    if (res.redirected) {
      window.location.href = res.url;
    } else if (!res.ok) {
      alert('Upload failed. Check console.');
      setUploading(false);
    }
  }

  return (
    <ZdxDocsShell headerProps={{ title: "Upload Document", subtitle: "Add a new document to the archive" }}>
      <div className="max-w-xl">
        <Link href="/admin/docs" className="text-sm text-white/50 hover:text-white mb-6 inline-block">
          ← Back to Documents
        </Link>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title <span className="text-red-400">*</span></label>
            <input
              name="title"
              required
              placeholder="e.g. ZDX Auth Architecture Overview"
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 focus:border-green-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug <span className="text-red-400">*</span></label>
            <input
              name="slug"
              required
              placeholder="e.g. zdx-auth-architecture"
              pattern="[a-z0-9-]+"
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 focus:border-green-500 focus:outline-none text-sm font-mono"
            />
            <p className="text-xs text-white/40 mt-1">Lowercase letters, numbers, hyphens only.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <textarea
              name="summary"
              rows={3}
              placeholder="Brief description of this document…"
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 focus:border-green-500 focus:outline-none text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type <span className="text-red-400">*</span></label>
            <select
              name="type"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 focus:border-green-500 focus:outline-none text-sm"
            >
              <option value="RESEARCH">Research Paper</option>
              <option value="WHITEPAPER">Whitepaper</option>
              <option value="PRODUCT">Product Doc</option>
              <option value="BLOG">Blog Post</option>
              <option value="INTERNAL">Internal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">File <span className="text-red-400">*</span></label>
            <input
              type="file"
              name="file"
              required
              accept=".pdf,.docx,.doc,.md,.html,.txt"
              className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-sm file:font-semibold hover:file:bg-white/20 file:cursor-pointer"
            />
            <p className="text-xs text-white/40 mt-1">Accepted: PDF, DOCX, Markdown, HTML, TXT</p>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition"
          >
            {uploading ? 'Uploading…' : 'Upload Document'}
          </button>
        </form>
      </div>
    </ZdxDocsShell>
  );
}
