'use client';

import { useState } from 'react';

type Category = { id: string; slug: string; name: string; order: number };

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);

  function autoSlug(val: string) {
    return val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, order: categories.length }),
    });
    if (res.ok) {
      const created = await res.json();
      setCategories(prev => [...prev, created]);
      setName('');
      setSlug('');
    } else {
      alert(await res.text());
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category? Documents will be uncategorized.')) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (res.ok) setCategories(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="max-w-xl space-y-8">
      {/* Add form */}
      <form onSubmit={handleAdd} className="space-y-4 p-5 rounded-xl border border-white/10 bg-white/5">
        <h3 className="font-semibold">Add Category</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Name <span className="text-red-400">*</span></label>
          <input
            required
            value={name}
            onChange={e => { setName(e.target.value); setSlug(autoSlug(e.target.value)); }}
            placeholder="e.g. ZDX AI"
            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-green-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug <span className="text-red-400">*</span></label>
          <input
            required
            value={slug}
            onChange={e => setSlug(autoSlug(e.target.value))}
            placeholder="e.g. zdx-ai"
            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-green-500 focus:outline-none text-sm font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg text-sm font-bold transition"
        >
          {saving ? 'Saving…' : 'Add Category'}
        </button>
      </form>

      {/* List */}
      <div>
        <h3 className="font-semibold mb-3">Existing Categories ({categories.length})</h3>
        {categories.length === 0 ? (
          <p className="text-sm text-white/40">No categories yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 border-b border-white/10">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Slug</th>
                <th className="pb-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-white/5">
                  <td className="py-2.5">{cat.name}</td>
                  <td className="py-2.5 font-mono text-white/60">{cat.slug}</td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
