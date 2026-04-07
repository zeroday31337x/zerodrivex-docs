// src/lib/extract/convertToHtml.ts
import { DocumentFormat } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import { remark } from 'remark'
import html from 'remark-html'

export async function convertToHtml(doc: {
  format: DocumentFormat
  sourcePath: string
  contentText?: string
}) {
  switch (doc.format) {
    case 'HTML':
      return doc.contentText || ''

    case 'MARKDOWN':
      if (!doc.contentText) return ''
      const mdHtml = await remark().use(html).process(doc.contentText)
      return mdHtml.toString()

    case 'DOCX': {
      const fileBuffer = fs.readFileSync(path.resolve(process.cwd(), doc.sourcePath))
      const result = await mammoth.extractRawText({ buffer: fileBuffer })
      return `<pre>${result.value}</pre>`
    }

    case 'PDF': {
      const fileBuffer = fs.readFileSync(path.resolve(process.cwd(), doc.sourcePath))
      const pdfData = await pdfParse(fileBuffer)
      return `<pre>${pdfData.text}</pre>`
    }

    case 'TEXT':
    default:
      return `<pre>${doc.contentText || ''}</pre>`
  }
}
