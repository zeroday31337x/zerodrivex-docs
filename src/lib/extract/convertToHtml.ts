import { DocumentFormat } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'
import * as pdfParse from 'pdf-parse'
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
      return `<div class="doc-content">${mdHtml.toString()}</div>`

    case 'DOCX': {
      const fileBuffer = fs.readFileSync(path.resolve(process.cwd(), doc.sourcePath))
      const result = await mammoth.convertToHtml({ buffer: fileBuffer })
      return `<div class="doc-content">${result.value}</div>`
    }

    case 'PDF': {
      const fileBuffer = fs.readFileSync(path.resolve(process.cwd(), doc.sourcePath))
      const pdfData = await pdfParse.default(fileBuffer)
      // Convert PDF text into paragraphs for VM-style HTML
      const paragraphs = pdfData.text
        .split(/\r?\n\r?\n/) // split by double newlines
        .map((p) => `<p>${p.trim()}</p>`)
        .join('')
      return `<div class="doc-content">${paragraphs}</div>`
    }

    case 'TEXT':
    default:
      const lines = (doc.contentText || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `<p>${line}</p>`)
        .join('')
      return `<div class="doc-content">${lines}</div>`
  }
}
