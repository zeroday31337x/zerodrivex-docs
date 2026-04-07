import { getDocumentBySlug } from '@/lib/documents'
import { convertToHtml } from '@/lib/extract/convertToHtml'

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

  const htmlContent = await convertToHtml({
    format: safeDoc.format,
    sourcePath: safeDoc.sourcePath,
    contentText: safeDoc.textContent,
  })

  return (
    <div className="zdx-root">
      <style>{`
        :root {
          --bg:#080c10; --surface:#0d1318; --border:#1a2530;
          --accent:#00e5ff; --accent2:#7fff00; --accent3:#ff6b35;
          --text:#c8d8e0; --text-dim:#5a7a8a;
        }
        body { margin:0; font-family: 'Barlow', sans-serif; }
        .zdx-root { background: var(--bg); color: var(--text); min-height:100vh; }
        .wrapper { max-width:860px; margin:0 auto; padding:80px 40px 120px; }
        .cover { border-bottom:1px solid var(--border); padding-bottom:60px; margin-bottom:72px; }
        .cover-label { font-family: monospace; font-size:11px; letter-spacing:.25em; color:var(--accent); margin-bottom:32px; }
        .cover-title { font-family: monospace; font-size: clamp(28px,5vw,48px); color:#fff; margin-bottom:8px; }
        .cover-subtitle { font-size:18px; color:var(--text-dim); margin-bottom:40px; }
        .abstract { background:var(--surface); border:1px solid var(--border); border-left:3px solid var(--accent); padding:28px 32px; margin-bottom:72px; white-space: pre-wrap; }
        .error { color:#ff6b6b; font-weight:bold; text-align:center; padding:40px; border:1px solid #ff6b6b; border-radius:12px; background:rgba(255,107,107,0.05); margin-bottom:72px; }
        section { margin-bottom:72px; }
        .download-btn { display:inline-block; margin-bottom:40px; padding:10px 16px; background:var(--accent); color:#000; border-radius:6px; text-decoration:none; font-weight:bold; }
      `}</style>

      <div className="wrapper">
        {error ? (
          <div className="error">{error} <br />Please try again later.</div>
        ) : (
          <>
            <div className="cover">
              <div className="cover-label">ZeroDriveX LLC — Dynamic Document</div>
              <div className="cover-title">{safeDoc.title}</div>
              {safeDoc.summary && <div className="cover-subtitle">{safeDoc.summary}</div>}
            </div>

            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

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
              <p>Created At: {safeDoc.createdAt.toLocaleDateString()}</p>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
