'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadDocPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('RESEARCH');
  const [format, setFormat] = useState('PDF');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title || !file) return alert('Title and file are required');

    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('format', format);
    formData.append('summary', summary);
    if (image) formData.append('image', image);
    formData.append('file', file);

    const res = await fetch('/api/admin/docs/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      router.push('/admin/docs');
    } else {
      alert('Failed to upload document');
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Upload New Document</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-bold transition disabled:opacity-50"
        >
          {submitting ? 'Uploading...' : '+ Upload Document'}
        </button>
      </form>
    </div>
  );
}
