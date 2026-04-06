import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import { getPublishedDocuments } from '@/lib/documents';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const TYPE_COLOR: Record<string, string> = {
  RESEARCH: 'bg-blue-500/20 text-blue-300',
  WHITEPAPER: 'bg-purple-500/20 text-purple-300',
  PRODUCT: 'bg-yellow-500/20 text-yellow-300',
  BLOG: 'bg-green-500/20 text-green-300',
  INTERNAL: 'bg-gray-500/20 text-gray-300',
};

const FORMAT_LABEL: Record<string, string> = {
  PDF: 'PDF',
  DOCX: 'DOCX',
  MARKDOWN: 'MD',
  HTML: 'HTML',
  TEXT: 'TXT',
};

function Section({ title, docs }: any) {
  if (!docs || docs.length === 0) return null;

  return (
    <>
      <h2 className="text-2xl font-bold text-yellow-400 text-center mt-16 mb-8">
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {docs.map((doc: any) => {
          if (!doc || !doc.id || !doc.title) return null; // Skip invalid docs

          return (
            <div
              key={doc.id}
              className="flex flex-col rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              {doc.image ? (
                <img
                  src={doc.image}
                  className="w-full h-40 object-cover rounded-t-xl"
                  alt={doc.title}
                />
              ) : (
                <div className="w-full h-40 bg-black border-b border-white/10 flex items-center justify-center text-xs text-white/40">
                  ZeroDriveX
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      TYPE_COLOR[doc.type] ?? 'bg-white/10 text-white/60'
                    }`}
                  >
                    {doc.type ?? 'UNKNOWN'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/50">
                    {FORMAT_LABEL[doc.format] ?? doc.format ?? 'TXT'}
                  </span>
                </div>

                <h3 className="text-base font-semibold mb-2">{doc.title}</h3>

                {doc.summary && (
                  <p className="text-sm text-white/60 mb-4 flex-1">{doc.summary}</p>
                )}

                <div className="flex gap-2 mt-auto pt-3 border-t border-white/10">
                  <a
                    href={`/docs/${doc.slug}`}
                    className="flex-1 text-center px-3 py-2 text-xs font-bold rounded-lg bg-green-600 hover:bg-green-700 transition"
                  >
                    Read
                  </a>
                  {doc.sourcePath && (
                    <a
                      href={doc.sourcePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-3 py-2 text-xs font-bold rounded-lg border border-white/20 hover:bg-white/10 transition"
                    >
                      Download
                    </a>
                  )}
                </div>

                <p className="text-xs text-white/30 mt-2">
                  {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default async function HomePage() {
  // getPublishedDocuments now returns empty array on failure
  const docs = (await getPublishedDocuments()) ?? [];

  if (!docs.length) {
    // optional: 404 if no docs, or show placeholder
    return (
      <ZdxDocsShell
        headerProps={{
          title: 'ZeroDriveX Documentation',
          subtitle: 'Research papers, whitepapers, product documentation, and technical specifications',
        }}
      >
        <div className="text-center py-20 text-white/70">
          <h2 className="text-2xl font-bold mb-4">No documents available</h2>
          <p>Please check back later.</p>
        </div>
      </ZdxDocsShell>
    );
  }

  const productDocs = docs.filter((d: any) => d.type === 'PRODUCT');
  const researchDocs = docs.filter((d: any) => d.type === 'RESEARCH');
  const whitepapers = docs.filter((d: any) => d.type === 'WHITEPAPER');
  const internalDocs = docs.filter((d: any) => d.type === 'INTERNAL');

  return (
    <ZdxDocsShell
      headerProps={{
        title: 'ZeroDriveX Documentation',
        subtitle: 'Research papers, whitepapers, product documentation, and technical specifications',
      }}
    >
      {/* Your top intro section */}
      <div className="mb-12 p-8 rounded-xl border border-white/10 bg-white/5 text-center max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-yellow-400 mb-3">
          ZeroDriveX Research Library
        </h2>
        <p className="text-white/70 text-sm leading-relaxed">
          This documentation portal contains research papers, technical specifications, and architecture documentation for the ZeroDriveX AI ecosystem including ZDX AI, ZDX Mobile AI, and ZDX Guard.
        </p>
        <div className="w-24 h-px bg-yellow-500/30 mx-auto mt-6"></div>
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <a href="https://www.zerodrivex.com" className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition">
          <h3 className="font-semibold text-green-400">ZeroDriveX Platform</h3>
          <p className="text-xs text-white/60">Core AI infrastructure and research</p>
        </a>
        <a href="https://zdxai.solutions" className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition">
          <h3 className="font-semibold text-blue-400">ZDX AI</h3>
          <p className="text-xs text-white/60">Agent runtime and orchestration</p>
        </a>
        <a href="https://auth.zerodrivex.com" className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition">
          <h3 className="font-semibold text-purple-400">ZDX Auth</h3>
          <p className="text-xs text-white/60">Multi-tenant authentication infrastructure</p>
        </a>
      </div>

      {/* Document sections */}
      <Section title="Product Documentation" docs={productDocs} />
      <Section title="Research Papers" docs={researchDocs} />
      <Section title="Whitepapers" docs={whitepapers} />
      <Section title="Internal Policies" docs={internalDocs} />
    </ZdxDocsShell>
  );
}
