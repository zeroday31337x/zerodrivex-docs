'use client';

import DeleteDocButton from '@/components/ui/DeleteDocButton';
import Link from 'next/link';

type Doc = {
  id: string;
  title: string;
  type: string;
  format: string;
  published: boolean;
  slug: string;
  createdAt: string;
};

type Stats = {
  total: number;
  byType: { type: string; _count: { _all: number } }[];
};

type Props = {
  stats?: Stats;
  recentDocs?: Doc[];
};

const TYPE_COLOR: Record<string, string> = {
  RESEARCH: 'bg-blue-500/20 text-blue-300',
  WHITEPAPER: 'bg-purple-500/20 text-purple-300',
  PRODUCT: 'bg-yellow-500/20 text-yellow-300',
  BLOG: 'bg-green-500/20 text-green-300',
  INTERNAL: 'bg-gray-500/20 text-gray-300',
};

export default function AdminDocsTable({ stats, recentDocs }: Props) {
  const safeStats: Stats = stats ?? { total: 0, byType: [] };
  const safeDocs: Doc[] = recentDocs ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-4xl font-bold text-green-400">{safeStats.total}</p>
          <p className="text-sm text-white/60 mt-1">Total Documents</p>
        </div>

        {safeStats.byType.map((t) => (
          <div
            key={t.type}
            className="rounded-xl border border-white/10 bg-white/5 p-5 text-center"
          >
            <p className="text-3xl font-bold">{t._count._all}</p>
            <p className="text-sm text-white/60 mt-1">{t.type}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
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

        <Link
          href="/admin/categories"
          className="px-5 py-2.5 border border-white/20 hover:bg-white/10 rounded-lg text-sm font-bold transition"
        >
          Manage Categories
        </Link>

        <a
          href="/api/auth/logout"
          className="ml-auto px-5 py-2.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-bold transition"
        >
          Logout
        </a>
      </div>

      {/* Recent documents */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-white/40 border-b border-white/10">
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Format</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {safeDocs.map((doc) => (
              <tr
                key={doc.id}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <td className="py-2">{doc.title}</td>

                <td className="py-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      TYPE_COLOR[doc.type] ?? 'bg-white/10 text-white/60'
                    }`}
                  >
                    {doc.type}
                  </span>
                </td>

                <td className="py-2">{doc.format}</td>

                <td className="py-2">
                  {doc.published ? 'Published' : 'Draft'}
                </td>

                <td className="py-2">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </td>

                <td className="py-2 text-right flex gap-2 justify-end">
                  <Link
                    href={`/admin/docs/edit/${doc.slug}`}
                    className="px-2 py-1 text-xs font-bold border border-white/20 rounded hover:bg-white/10"
                  >
                    Edit
                  </Link>

                  <DeleteDocButton id={doc.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


