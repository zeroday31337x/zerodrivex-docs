'use client';

import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import { useState } from 'react';

type Doc = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: string;
  image?: string;
  published: boolean;
};

export default function EditDocPage({ doc }: { doc: Doc }) {
  const [preview, setPreview] = useState<string | null>(doc.image ?? null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(doc.image ?? null);
  }

  return (
    <ZdxDocsShell headerProps={{ title: 'Edit Document', subtitle: doc.title }}>
      <form action="/api/admin/docs/update" method="POST" encType="multipart/form-data" className="max-w-xl mx-auto space-y-5">
        <input type="hidden" name="id" value={doc.id} />
        <input name="title" defaultValue={doc.title} required />
        <input name="slug" defaultValue={doc.slug} required pattern="[a-z0-9-]+" />
        <textarea name="summary" defaultValue={doc.summary} />
        <select name="type" defaultValue={doc.type}>
          <option value="RESEARCH">Research Paper</option>
          <option value="WHITEPAPER">Whitepaper</option>
          <option value="PRODUCT">Product Doc</option>
          <option value="BLOG">Blog Post</option>
          <option value="INTERNAL">Internal</option>
        </select>

        {preview && <img src={preview} className="mt-2 max-h-40 w-full object-cover rounded" />}

        <input type="file" name="coverImage" onChange={handleImageChange} />
        <label>
          <input type="checkbox" name="published" defaultChecked={doc.published} /> Published
        </label>

        <button type="submit" className="w-full py-2 bg-green-600 rounded">Save Changes</button>
      </form>
    </ZdxDocsShell>
  );
}
