import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import { getPublishedDocuments } from '@/lib/documents';

export const dynamic = 'force-dynamic';

const TYPE_COLOR: Record<string, string> = {
  RESEARCH:   'bg-blue-500/20 text-blue-300',
  WHITEPAPER: 'bg-purple-500/20 text-purple-300',
  PRODUCT:    'bg-yellow-500/20 text-yellow-300',
  BLOG:       'bg-green-500/20 text-green-300',
  INTERNAL:   'bg-gray-500/20 text-gray-300',
};

const FORMAT_LABEL: Record<string, string> = {
  PDF: 'PDF', DOCX: 'DOCX', MARKDOWN: 'MD', HTML: 'HTML', TEXT: 'TXT',
};

export default async function HomePage() {
  const docs = await getPublishedDocuments();

  return (
    <ZdxDocsShell
      headerProps={{ title: "ZeroDriveX Documentation", subtitle: "Research papers, whitepapers, and technical specifications" }}
    >
      {docs.length === 0 ? (
        <p className="text-white/50 text-center py-16">No documents published yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${TYPE_COLOR[doc.type] ?? 'bg-white/10 text-white/60'}`}>
                  {doc.type}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/50">
                  {FORMAT_LABEL[doc.format] ?? doc.format}
                </span>
              </div>

              <h2 className="text-base font-semibold leading-snug mb-2">{doc.title}</h2>

              {doc.summary && (
                <p className="text-sm text-white/60 leading-relaxed mb-3 flex-1">
                  {doc.summary}
                </p>
              )}

              <div className="flex gap-2 mt-auto pt-3 border-t border-white/10">
                <a
                  href={`/docs/${doc.slug}`}
                  className="flex-1 text-center px-3 py-2 text-xs font-bold rounded-lg bg-green-600 hover:bg-green-700 transition"
                >
                  Read
                </a>
                <a
                  href={doc.sourcePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-3 py-2 text-xs font-bold rounded-lg border border-white/20 hover:bg-white/10 transition"
                >
                  Download
                </a>
              </div>

              <p className="text-xs text-white/30 mt-2">
                {new Date(doc.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </ZdxDocsShell>
  );
}
