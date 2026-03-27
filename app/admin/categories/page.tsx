import ZdxDocsShell from '@/components/ui/ZdxDocsShell';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CategoryManager from '@/components/ui/CategoryManager';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });

  return (
    <ZdxDocsShell headerProps={{ title: 'Categories', subtitle: 'Manage document categories' }}>
      <div className="flex gap-3 mb-6">
        <Link href="/admin" className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded-lg text-sm font-bold transition">
          ← Dashboard
        </Link>
      </div>
      <CategoryManager initialCategories={categories} />
    </ZdxDocsShell>
  );
}
