'use client';

import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import Link from 'next/link';
import { useState } from 'react';

export default function NewDocPage() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch('/api/admin/docs/upload', { method: 'POST', body: data });

    if (res.redirected) window.location.href = res.url;
    else {
      alert('Upload failed.');
      setUploading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  }

  return (
    <ZdxDocsShell headerProps={{ title: 'Upload Document', subtitle: 'Add a new document' }}>
      <div className="max-w-xl mx-auto">
        <Link href="/admin/docs" className="text-sm text-white/50 hover:text-white mb-6 inline-block">
          ← Back to Documents
        </Link>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="title" placeholder="Title" required className="w-full p-2 rounded bg-black/40 border border-white/10" />
          <input name="slug" placeholder="slug" required pattern="[a-z0-9-]+" className="w-full p-2 rounded bg-black/40 border border-white/10 font-mono" />
          <textarea name="summary" placeholder="Summary" className="w-full p-2 rounded bg-black/40 border border-white/10" />
          <select name="type" required className="w-full p-2 rounded bg-black/40 border border-white/10">
            <option value="RESEARCH">Research Paper</option>
            <option value="WHITEPAPER">Whitepaper</option>
            <option value="PRODUCT">Product Doc</option>
            <option value="BLOG">Blog Post</option>
            <option value="INTERNAL">Internal</option>
          </select>

          <input type="file" name="file" required accept=".pdf,.docx,.doc,.md,.html,.txt" />
          <input type="file" name="coverImage" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} className="mt-2 max-h-40 w-full object-cover rounded" />}

          <button type="submit" disabled={uploading} className="w-full py-2 bg-green-600 rounded">
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </form>
      </div>
    </ZdxDocsShell>
  );
}
