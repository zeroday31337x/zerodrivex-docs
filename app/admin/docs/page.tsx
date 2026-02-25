import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import { getAllDocumentsAdmin } from '@/lib/documents';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDocsPage() {
  const docs = await getAllDocumentsAdmin();

  return (
    <ZdxDocsShell
      headerProps={{ title: "All Documents", subtitle: "Manage uploaded documents" }}
    >
      <div className="flex gap-3 mb-6">
        <Link
          href="/admin/docs/new"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-bold transition"
        >
          + Upload New
        </Link>
        <Link
          href="/admin"
          className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded-lg text-sm font-bold transition"
        >
          ← Dashboard
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-white/40 border-b border-white/10">
            <th className="pb-2 font-medium">Title</th>
            <th className="pb-2 font-medium">Type</th>
            <th className="pb-2 font-medium">Format</th>
            <th className="pb-2 font-medium">Status</th>
            <th className="pb-2 font-medium">Date</th>
            <th className="pb-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.id} className="border-b border-white/5 hover:bg-white/5 transition">
              <td className="py-2.5 font-medium">{doc.title}</td>
              <td className="py-2.5 text-white/60">{doc.type}</td>
              <td className="py-2.5 text-white/60">{doc.format}</td>
              <td className="py-2.5">
                <span className={`px-2 py-0.5 rounded text-xs ${doc.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {doc.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="py-2.5 text-white/40">{new Date(doc.createdAt).toLocaleDateString()}</td>
              <td className="py-2.5">
                <div className="flex gap-2">
                  <Link
                    href={`/docs/${doc.slug}`}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                  <form action={`/api/admin/docs/delete`} method="POST" className="inline">
                    <input type="hidden" name="id" value={doc.id} />
                    <button
                      type="submit"
                      className="text-xs text-red-400 hover:underline"
                      onClick={(e) => { if (!confirm('Delete this document?')) e.preventDefault(); }}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ZdxDocsShell>
  );
}
