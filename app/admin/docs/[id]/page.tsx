// app/admin/docs/[id]/page.tsx
import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditDocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) notFound();

  return (
    <ZdxDocsShell headerProps={{ title: 'Edit Document', subtitle: doc.title }}>
      <div className="max-w-xl">
        <Link href="/admin/docs" className="text-sm text-white/50 hover:text-white mb-6 inline-block">
          ← Back to Documents
        </Link>

        <form
          action="/api/admin/docs/update"
          method="POST"
          encType="multipart/form-data"
          className="space-y-5"
        >
          <input type="hidden" name="id" value={doc.id} />

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
              defaultValue={doc.summary ?? ''}
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
            {doc.image && (
              <div className="mb-2">
                <img
                  src={doc.image}
                  alt="Current cover"
                  className="rounded-lg border border-white/10 max-h-40 object-cover w-full"
                />
                <p className="text-xs text-white/40 mt-1">Current image. Upload a new one to replace it.</p>
              </div>
            )}
            <input
              type="file"
              name="coverImage"
              accept="image/jpeg,image/png,image/webp"
              className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-sm file:font-semibold hover:file:bg-white/20 file:cursor-pointer"
            />
            <p className="text-xs text-white/40 mt-1">Optional. JPG, PNG, or WebP.</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              defaultChecked={doc.published}
              className="w-4 h-4 rounded accent-green-500"
            />
            <span className="text-sm">Published</span>
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </ZdxDocsShell>
  );
}
