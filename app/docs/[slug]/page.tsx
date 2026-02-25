import { getDocumentBySlug } from '@/lib/documents';
import DocumentViewer from '@/components/documents/DocumentViewer';
import ZdxDocsShell from '@/components/ui/ZdxDocsShell';

export default async function DocPage({ params }) {
  const doc = await getDocumentBySlug(params.slug);

  return (
    <ZdxDocsShell
      headerProps={{
        title: doc.title,
        subtitle: doc.summary,
      }}
    >
      <DocumentViewer doc={doc} />
    </ZdxDocsShell>
  );
}
