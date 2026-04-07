import { getDocumentBySlug } from '@/lib/documents'
import UniversalHtmlViewer from '@/components/documents/UniversalHtmlViewer'

export default async function DocPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  let doc: any = null
  let error: string | null = null

  try {
    doc = await getDocumentBySlug(slug)
    if (!doc) error = 'Document not found.'
  } catch (err: any) {
    console.error('Error fetching document:', err)
    error = 'Failed to load document due to a server error.'
  }

  const safeDoc = {
    title: doc?.title || 'Untitled Document',
    summary: doc?.summary || '',
    textContent: doc?.contentText || '',
    createdAt: doc?.createdAt ? new Date(doc.createdAt) : new Date(),
    type: doc?.type || 'INTERNAL',
    format: doc?.format || 'TEXT',
    category: doc?.category || 'Uncategorized',
    published: doc?.published ?? false,
    sourcePath: doc?.fileUrl || '',
  }

  // Convert any non-HTML document into HTML using simple <pre> wrapper
  const htmlContent =
    safeDoc.format === 'HTML'
      ? safeDoc.textContent
      : `<pre>${safeDoc.textContent}</pre>`

  return (
    <div>
      {error ? (
        <div style={{ color: '#ff6b6b', textAlign: 'center', padding: 40 }}>
          {error} <br /> Please try again later.
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 40 }}>
            <h1>{safeDoc.title}</h1>
            {safeDoc.summary && <p>{safeDoc.summary}</p>}
          </div>

          <UniversalHtmlViewer content={htmlContent} />

          {safeDoc.sourcePath && (
            <a href={safeDoc.sourcePath} download className="download-btn">
              Download Original File
            </a>
          )}

          <section>
            <h2>Document Details</h2>
            <p>Type: {safeDoc.type}</p>
            <p>Format: {safeDoc.format}</p>
            <p>Published: {safeDoc.published ? 'Yes' : 'No'}</p>
            <p>Category: {safeDoc.category}</p>
          </section>
        </>
      )}
    </div>
  )
}
