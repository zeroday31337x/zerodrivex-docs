'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type DocData = {
  id: number;
  title: string;
  type: string;
  format: string;
  summary?: string;
  image?: string;
  sourcePath: string;
};

export default function EditDocPage({ docId }: { docId: string }) {
  const router = useRouter();

  const [doc, setDoc] = useState<DocData | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('RESEARCH');
  const [format, setFormat] = useState('PDF');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing doc data
  useEffect(() => {
    async function fetchDoc() {
      const res = await fetch(`/api/admin/docs/${docId}`);
      if (!res.ok) return alert('Failed to fetch document');
      const data = await res.json();
      setDoc(data);
      setTitle(data.title);
      setType(data.type);
      setFormat(data.format);
      setSummary(data.summary || '');
      setImagePreview(data.image || null);
    }
    fetchDoc();
  }, [docId]);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (!title) return alert('Title is required');

    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('format', format);
    formData.append('summary', summary);
    if (image) formData.append('image', image);
    if (file) formData.append('file', file);

    const res = await fetch(`/api/admin/docs/update/${docId}`, {
      method: 'PATCH',
      body: formData,
    });

    if (res.ok) {
      router.push('/admin/docs');
    } else {
      alert('Failed to update document');
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this document?')) return;

    const res = await fetch(`/api/admin/docs/delete/${docId}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/admin/docs');
    } else {
      alert('Failed to delete document');
    }
  }

  if (!doc) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Edit Document</h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        {/* Type & Format */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="RESEARCH">RESEARCH</option>
              <option value="WHITEPAPER">WHITEPAPER</option>
              <option value="PRODUCT">PRODUCT</option>
              <option value="BLOG">BLOG</option>
              <option value="INTERNAL">INTERNAL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="MARKDOWN">MARKDOWN</option>
              <option value="HTML">HTML</option>
              <option value="TEXT">TEXT</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-semibold mb-1">Summary (optional)</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            rows={3}
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-semibold mb-1">Cover Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-white"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded-lg border border-white/20"
            />
          )}
        </div>

        {/* Document File */}
        <div>
          <label className="block text-sm font-semibold mb-1">Document File</label>
          <input
            type="file"
            accept=".pdf,.docx,.md,.html,.txt"
            onChange={handleFileChange}
            className="text-white"
          />
          {file && <p className="text-xs text-white/50 mt-1">New file ready to upload</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-5 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-bold transition disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Update Document'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition"
          >
            Delete Document
          </button>
        </div>
      </form>
    </div>
  );
}
