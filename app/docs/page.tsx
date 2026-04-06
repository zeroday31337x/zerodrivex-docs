'use server'

import ZdxDocsShell from '@/components/ui/ZdxDocsShell'
import { getPublishedDocuments } from '@/lib/documents'

// Force ISR instead of full dynamic rendering
export const revalidate = 60

// Document type colors
const TYPE_COLOR: Record<string, string> = {
  RESEARCH: 'bg-blue-500/20 text-blue-300',
  WHITEPAPER: 'bg-purple-500/20 text-purple-300',
  PRODUCT: 'bg-yellow-500/20 text-yellow-300',
  BLOG: 'bg-green-500/20 text-green-300',
  INTERNAL: 'bg-gray-500/20 text-gray-300',
}

// Format labels
const FORMAT_LABEL: Record<string, string> = {
  PDF: 'PDF',
  DOCX: 'DOCX',
  MARKDOWN: 'MD',
  HTML: 'HTML',
  TEXT: 'TXT',
}

// Sections config
const SECTION_CONFIG = [
  { type: 'PRODUCT', title: 'Product Documentation' },
  { type: 'RESEARCH', title: 'Research Papers' },
  { type: 'WHITEPAPER', title: 'Whitepapers' },
  { type: 'INTERNAL', title: 'Internal Policies' },
]

// Document type
type Doc = {
  id: string
  title: string
  slug: string
  type: 'RESEARCH' | 'WHITEPAPER' | 'PRODUCT' | 'BLOG' | 'INTERNAL'
  format: 'PDF' | 'DOCX' | 'MARKDOWN' | 'HTML' | 'TEXT'
  summary?: string
  image?: string
  sourcePath: string
  createdAt: string
}

// Helpers
function resolveImage(src?: string) {
  if (!src) return null
  if (src.startsWith('http') || src.startsWith('/')) return src
  return `/images/covers/${src}`
}

function groupByType(docs: Doc[]) {
  return docs.reduce((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = []
    acc[doc.type].push(doc)
    return acc
  }, {} as Record<string, Doc[]>)
}

// Components
function DocCard({ doc }: { doc: Doc }) {
  const imgSrc = resolveImage(doc.image)
  const isExternal = doc.sourcePath.startsWith('http')

  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={doc.title || 'Document cover'}
          className="w-full h-40 object-cover rounded-t-xl"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-40 bg-black border-b border-white/10 flex items-center justify-center text-xs text-white/40">
          ZeroDriveX
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`text-xs px-2 py-0.5 rounded font-semibold ${
              TYPE_COLOR[doc.type] ?? 'bg-white/10 text-white/60'
            }`}
          >
            {doc.type}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/50">
            {FORMAT_LABEL[doc.format] ?? doc.format}
          </span>
        </div>

        <h3 className="text-base font-semibold mb-2">{doc.title}</h3>

        {doc.summary && (
          <p className="text-sm text-white/60 mb-4 flex-1">{doc.summary}</p>
        )}

        <div className="flex gap-2 mt-auto pt-3 border-t border-white/10 flex-col sm:flex-row">
          <a
            href={`/docs/${doc.slug}`}
            className="flex-1 text-center px-3 py-2 text-xs font-bold rounded-lg bg-green-600 hover:bg-green-700 transition"
          >
            Read
          </a>

          <a
            href={doc.sourcePath}
            target={isExternal ? '_blank' : '_self'}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="flex-1 text-center px-3 py-2 text-xs font-bold rounded-lg border border-white/20 hover:bg-white/10 transition"
          >
            Download
          </a>
        </div>

        <p className="text-xs text-white/30 mt-2 text-right">
          {new Date(doc.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

function Section({ title, docs }: { title: string; docs: Doc[] }) {
  if (!docs.length) return null

  return (
    <>
      <h2 className="text-2xl font-bold text-yellow-400 text-center mt-16 mb-8">
        {title}
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {docs.map((doc) => (
          <DocCard key={doc.id} doc={doc} />
        ))}
      </div>
    </>
  )
}

// Main page
export default async function HomePage() {
  const docs = (await getPublishedDocuments()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const groupedDocs = groupByType(docs)

  return (
    <ZdxDocsShell
      headerProps={{
        title: 'ZeroDriveX Documentation',
        subtitle:
          'Research papers, whitepapers, product documentation, and technical specifications',
      }}
    >
      {/* Intro */}
      <div className="mb-12 p-8 rounded-xl border border-white/10 bg-white/5 text-center max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-yellow-400 mb-3">
          ZeroDriveX Research Library
        </h2>
        <p className="text-white/70 text-sm leading-relaxed">
          Documentation portal for research papers, technical specifications, and
          architecture docs for ZeroDriveX AI ecosystem including ZDX AI, ZDX Mobile AI, and ZDX Guard.
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

      {/* Sections */}
      {SECTION_CONFIG.map(({ type, title }) => (
        <Section key={type} title={title} docs={groupedDocs[type] ?? []} />
      ))}
    </ZdxDocsShell>
  )
}
