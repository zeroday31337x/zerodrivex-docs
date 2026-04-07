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
      // Use mammoth to preserve headings, bold, lists
      const result = await mammoth.convertToHtml({ buffer: fileBuffer })
      // Wrap in container to match VM abstract section
      return `<div class="doc-content">${result.value}</div>`
    }

    case 'PDF': {
      const fileBuffer = fs.readFileSync(path.resolve(process.cwd(), doc.sourcePath))
      const pdfData = await pdfParse(fileBuffer)

      // Convert lines to paragraphs
      const paragraphs = pdfData.text
        .split(/\r?\n\r?\n/) // split by double newlines
        .map((p) => `<p>${p.trim()}</p>`)
        .join('')

      return `<div class="doc-content">${paragraphs}</div>`
    }

    case 'TEXT':
    default:
      // Plain text wrapped in paragraphs
      const lines = (doc.contentText || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `<p>${line}</p>`)
        .join('')
      return `<div class="doc-content">${lines}</div>`
  }
}
