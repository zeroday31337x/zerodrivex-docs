import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import UniversalDocViewer from '@/components/documents/UniversalDocViewer';

export default async function DocPage({
  params,
}: {
  params: { slug: string };
}) {
  const docPath = path.join(
    process.cwd(),
    'content',
    `${params.slug}.html`
  );

  let content: string;

  try {
    content = await fs.readFile(docPath, 'utf-8');
  } catch {
    notFound();
  }

  return (
    <ZdxDocsShell>
      <UniversalDocViewer
        format="HTML"
        content={content}
      />
    </ZdxDocsShell>
  );
}
