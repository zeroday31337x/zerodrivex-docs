'use client';

import { useState } from 'react';
import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import { useRouter } from 'next/navigation';

type Doc = {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  type: string;
  published: boolean;
  image?: string | null;
  sourcePath?: string | null;
};

export default function EditDocPage({ doc }: { doc: Doc }) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(doc.image || null);
  const [saving, setSaving] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(doc.image || null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch(`/api/admin/docs/update/${doc.id}`, {
      method: 'PATCH',
      body: data,
    });

    if (res.ok) {
      router.refresh();
      alert('Document updated!');
    } else {
      alert('Update failed. Check console.');
      setSaving(false);
    }
  }

  return (
    <ZdxDocsShell headerProps={{ title: 'Edit Document', subtitle: doc.title }}>
      <div className="max-w-xl mx-auto space-y-6">

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-1">Title <span className="text-red-400">*</span></label>
            <input
              name="title"
              required
              defaultValue={doc.title}
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 focus:border-green-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              name="slug"
              defaultValue={doc.slug}
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
              defaultValue={doc.summary || ''}
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 focus:border-green-500 focus:outline-none text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type <span className="text-red-400">*</span></label>
            <select
              name="type"
              defaultValue={doc.type}
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
            <label className="block text-sm font-medium mb-1">Cover Image</label>
            {preview && (
              <div className="mb-2">
                <img
                  src={preview}
                  alt="Current cover"
                  className="rounded-lg border border-white/10 max-h-40 object-cover w-full"
                />
                <p className="text-xs text-white/40 mt-1">Current image. Upload a new one to replace it.</p>
              </div>
            )}
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-sm file:font-semibold hover:file:bg-white/20 file:cursor-pointer"
            />
            <p className="text-xs text-white/40 mt-1">Optional. JPG, PNG, or WebP.</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              defaultChecked={doc.published}
              className="w-4 h-4 rounded accent-green-500"
            />
            <span className="text-sm">Published</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

      </div>
    </ZdxDocsShell>
  );
}
