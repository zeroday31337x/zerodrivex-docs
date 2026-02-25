import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import UniversalDocViewer from '@/components/documents/UniversalDocViewer';
import { notFound } from 'next/navigation';

export default async function DocPage({
  params,
}: {
  params: { slug: string };
}) {
  const doc = await getDocumentBySlug(params.slug);

  if (!doc) notFound();

  return (
    <ZdxDocsShell
      headerProps={{
        title: doc.title,
        subtitle: doc.category,
        status: doc.published
          ? { label: 'Published' }
          : { label: 'Draft', tone: 'warning' },
      }}
    >
      <UniversalDocViewer
        type={doc.type}
        src={doc.fileUrl}
        content={doc.textContent}
      />
    </ZdxDocsShell>
  );
}
