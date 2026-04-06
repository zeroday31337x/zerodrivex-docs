import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  await prisma.document.delete({
    where: { id: numericId },
  });

  return NextResponse.json({ success: true });
}
