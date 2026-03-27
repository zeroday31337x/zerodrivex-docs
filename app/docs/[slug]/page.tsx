import ZdxDocsShell from '@/components/ui/ZdxDocsShell'
import UniversalDocViewer from '@/components/documents/UniversalDocViewer'
import { notFound } from 'next/navigation'
import { getDocumentBySlug } from '@/lib/documents'

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const doc = await getDocumentBySlug(slug)

  if (!doc) {
    notFound()
  }

  return (
    <ZdxDocsShell
      headerProps={{ title: doc.title, subtitle: doc.category }}
    >
      <UniversalDocViewer
        type={doc.type}
        src={doc.fileUrl}
        content={doc.textContent}
      />
    </ZdxDocsShell>
  )
}
