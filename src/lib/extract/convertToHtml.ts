// src/lib/extract/convertToHtml.ts
import { DocumentFormat } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import { remark } from 'remark'
import html from 'remark-html'

// Utility to escape HTML
function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

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

      let htmlContent = ''

      for (let line of lines) {
        line = line.trim()
        if (!line) continue

        // Heuristic: ALL CAPS → heading
        if (line.match(/^[A-Z0-9 \-]{3,}$/)) {
          htmlContent += `<h2>${escapeHtml(line)}</h2>`
        } else if (line.length > 100) {
          htmlContent += `<p>${escapeHtml(line)}</p>`
        } else {
          // Short lines → could be subheading
          htmlContent += `<h3>${escapeHtml(line)}</h3>`
        }
      }

      // Wrap in VM-style abstract container
      return `<div class="abstract">${htmlContent}</div>`
    }

    case 'TEXT':
    default:
      return `<div class="abstract"><pre>${escapeHtml(doc.contentText || '')}</pre></div>`
  }
}
