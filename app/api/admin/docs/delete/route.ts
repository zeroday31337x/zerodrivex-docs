import { NextResponse } from 'next/server'
import { deleteDocument } from '@/lib/documents'

export async function POST(req: Request) {
  const form = await req.formData()
  const id = form.get('id') as string

  await deleteDocument(id)

  return NextResponse.redirect(new URL('/admin/docs', req.url))
}
