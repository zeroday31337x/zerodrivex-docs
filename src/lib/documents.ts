import { prisma } from '@/lib/prisma';
import { DocumentFormat } from '@prisma/client';
import type { DocType } from '@/components/documents/UniversalDocViewer';

const PAGE_SIZE = 12;

const FORMAT_MAP: Record<DocumentFormat, DocType> = {
  PDF:      'pdf',
  DOCX:     'docx',
  MARKDOWN: 'md',
  HTML:     'html',
  TEXT:     'txt',
};

export async function getDocumentBySlug(slug: string) {
  const doc = await prisma.document.findUnique({
    where: { slug },
    select: {
      title:       true,
      published:   true,
      format:      true,
      sourcePath:  true,
      contentText: true,
      categories: {
        select: { category: { select: { name: true } } },
      },
    },
  });

  if (!doc) return null;

  return {
    title:       doc.title,
    published:   doc.published,
    type:        FORMAT_MAP[doc.format],
    fileUrl:     doc.sourcePath,
    textContent: doc.contentText ?? undefined,
    category:    doc.categories.map((c) => c.category.name).join(', ') || 'Documentation',
  };
}

export async function getPublishedDocuments() {
  return prisma.document.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, slug: true, title: true, summary: true,
      type: true, format: true, sourcePath: true, createdAt: true,
      categories: { select: { category: { select: { name: true, slug: true } } } },
    },
  });
}

export async function getAllDocumentsAdmin() {
  return prisma.document.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, slug: true, title: true,
      type: true, format: true, published: true, createdAt: true,
    },
  });
}

export async function getAdminStats() {
  const [total, byType] = await Promise.all([
    prisma.document.count(),
    prisma.document.groupBy({ by: ['type'], _count: { _all: true } }),
  ]);
  return { total, byType };
}

export async function deleteDocument(id: string) {
  return prisma.document.delete({ where: { id } });
}

export async function getDocuments(params: {
  q?: string;
  type?: string;
  category?: string;
  page?: number;
}) {
  const page = params.page ?? 1;
  const skip = (page - 1) * PAGE_SIZE;

  const where: any = {
    published: true,
  };

  if (params.type) {
    where.type = params.type;
  }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { summary: { contains: params.q, mode: 'insensitive' } },
      { contentText: { contains: params.q, mode: 'insensitive' } },
      { tags: { has: params.q } },
    ];
  }

  if (params.category) {
    where.categories = {
      some: {
        category: {
          slug: params.category,
        },
      },
    };
  }

  const [items, total] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        type: true,
        format: true,
        createdAt: true,
        categories: {
          select: {
            category: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    }),
    prisma.document.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageCount: Math.ceil(total / PAGE_SIZE),
  };
}
