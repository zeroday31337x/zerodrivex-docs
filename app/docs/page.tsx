import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import { getDocuments } from '@/lib/documents';
import Link from 'next/link';

type Props = {
  searchParams: {
    q?: string;
    type?: string;
    category?: string;
    page?: string;
  };
};

export default async function DocsPage({ searchParams }: Props) {
  const page = Number(searchParams.page || 1);

  const data = await getDocuments({
    q: searchParams.q,
    type: searchParams.type,
    category: searchParams.category,
    page,
  });

  return (
    <ZdxDocsShell
      headerProps={{ title: "Documentation Archive", subtitle: "Research, whitepapers, and technical documents" }}
    >
      {/* Search */}
      <form className="mb-6">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search documents…"
          className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10"
        />
      </form>

      {/* Results */}
      <div className="grid gap-4">
        {data.items.map(doc => (
          <Link
            key={doc.id}
            href={`/docs/${doc.slug}`}
            className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            <div className="flex items-center gap-3 text-xs text-white/60">
              <span>{doc.type}</span>
              <span>•</span>
              <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
            </div>

            <h3 className="text-lg font-semibold mt-1">{doc.title}</h3>

            {doc.summary && (
              <p className="text-sm text-white/70 mt-1">
                {doc.summary}
              </p>
            )}

            <div className="flex gap-2 mt-3">
              {doc.categories.map(c => (
                <span
                  key={c.category.slug}
                  className="text-xs px-2 py-0.5 rounded bg-white/10"
                >
                  {c.category.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {data.pageCount > 1 && (
        <div className="flex gap-2 justify-center mt-8">
          {Array.from({ length: data.pageCount }).map((_, i) => (
            <Link
              key={i}
              href={`/docs?page=${i + 1}`}
              className={`px-3 py-1 rounded ${
                data.page === i + 1
                  ? 'bg-green-600'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </ZdxDocsShell>
  );
}
