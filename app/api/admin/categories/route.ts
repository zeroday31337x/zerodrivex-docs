export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const { name, slug, order } = await req.json();
  if (!name || !slug) {
    return new Response('name and slug required', { status: 400 });
  }
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return new Response('slug already exists', { status: 409 });
  }
  const category = await prisma.category.create({
    data: { name, slug, order: order ?? 0 },
  });
  return NextResponse.json(category, { status: 201 });
}
