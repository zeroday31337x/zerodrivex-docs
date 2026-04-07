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
      // Convert to **clean semantic HTML**, not raw text
      const result = await mammoth.convertToHtml({ buffer: fileBuffer })
      // Wrap in VM-style container
      return `<div class="vm-doc">${result.value}</div>`
    }

    case 'PDF': {
      const fileBuffer = fs.readFileSync(path.resolve(process.cwd(), doc.sourcePath))
      const pdfData = await pdfParse(fileBuffer)
      // Split text into paragraphs for cleaner HTML
      const paragraphs = pdfData.text
        .split(/\n{2,}/)
        .map((p) => `<p>${p.trim()}</p>`)
        .join('\n')
      return `<div class="vm-doc">${paragraphs}</div>`
    }

    case 'TEXT':
    default:
      // Split text lines into paragraphs
      const text = doc.contentText || ''
      const lines = text
        .split(/\n{1,}/)
        .map((l) => `<p>${l.trim()}</p>`)
        .join('\n')
      return `<div class="vm-doc">${lines}</div>`
  }
}
