import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import { getAdminStats, getAllDocumentsAdmin } from '@/lib/documents';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [stats, recentDocs] = await Promise.all([
    getAdminStats(),
    getAllDocumentsAdmin(),
  ]);

  return (
    <ZdxDocsShell
      headerProps={{ title: "Admin Dashboard", subtitle: "ZeroDriveX Documentation Management" }}
    >
      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-4xl font-bold text-green-400">{stats.total}</p>
          <p className="text-sm text-white/60 mt-1">Total Documents</p>
        </div>
        {stats.byType.map((t) => (
          <div key={t.type} className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
            <p className="text-3xl font-bold">{t._count._all}</p>
            <p className="text-sm text-white/60 mt-1">{t.type}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <Link
          href="/admin/docs/new"
          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-bold transition"
        >
          + Upload Document
        </Link>
        <Link
          href="/admin/docs"
          className="px-5 py-2.5 border border-white/20 hover:bg-white/10 rounded-lg text-sm font-bold transition"
        >
          View All Documents
        </Link>
        <a
          href="/api/auth/logout"
          className="ml-auto px-5 py-2.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-bold transition"
        >
          Logout
        </a>
      </div>

      {/* Recent documents */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Documents</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 border-b border-white/10">
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Format</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentDocs.slice(0, 10).map((doc) => (
              <tr key={doc.id} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="py-2.5">
                  <Link href={`/docs/${doc.slug}`} className="hover:text-green-400 transition">
                    {doc.title}
                  </Link>
                </td>
                <td className="py-2.5 text-white/60">{doc.type}</td>
                <td className="py-2.5 text-white/60">{doc.format}</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded text-xs ${doc.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {doc.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-2.5 text-white/40">{new Date(doc.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ZdxDocsShell>
  );
}
