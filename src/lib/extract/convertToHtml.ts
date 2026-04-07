// src/lib/extract/convertToHtml.ts
import { DocumentFormat } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import { remark } from 'remark'
import html from 'remark-html'

// Escape HTML special chars
function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Heuristic function for PDF lines → headings or paragraphs
function pdfLineToHtml(line: string): string {
  line = line.trim()
  if (!line) return ''

  // ALL CAPS → h2 heading
  if (line.match(/^[A-Z0-9 \-]{3,}$/)) return `<h2>${escapeHtml(line)}</h2>`
  // Short line → h3 subheading
  if (line.length <= 60) return `<h3>${escapeHtml(line)}</h3>`
  // Everything else → paragraph
  return `<p>${escapeHtml(line)}</p>`
}

export async function convertToHtml(doc: {
  format: DocumentFormat
  sourcePath: string
  contentText?: string
}) {
  switch (doc.format) {
    case 'HTML':
      return `<div class="abstract">${doc.contentText || ''}</div>`

    case 'MARKDOWN':
      if (!doc.contentText) return '<div class="abstract"></div>'
      const mdHtml = await remark().use(html).process(doc.contentText)
      return `<div class="abstract">${mdHtml.toString()}</div>`

    case 'DOCX': {
      const fileBuffer = fs.readFileSync(path.resolve(process.cwd(), doc.sourcePath))
      const result = await mammoth.convertToHtml({ buffer: fileBuffer })
      return `<div class="abstract">${result.value}</div>`
    }

    case 'PDF': {
      const fileBuffer = fs.readFileSync(path.resolve(process.cwd(), doc.sourcePath))
      const pdfData = await pdfParse(fileBuffer)
      const lines = pdfData.text.split('\n').filter(Boolean)
      const htmlContent = lines.map(pdfLineToHtml).join('\n')
      return `<div class="abstract">${htmlContent}</div>`
    }

    case 'TEXT':
    default:
      return `<div class="abstract"><pre>${escapeHtml(doc.contentText || '')}</pre></div>`
  }
}
