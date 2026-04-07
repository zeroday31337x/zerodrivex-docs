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

      // Extract headings and paragraphs using mammoth's structured output
      const result = await mammoth.convertToHtml({ buffer: fileBuffer })
      let htmlContent = result.value // Already HTML, includes <p>, <strong>, <em>, <h1>-<h6>
      
      // Optional: wrap in VM-style container
      htmlContent = `<div class="abstract">${htmlContent}</div>`

      return htmlContent
    }

    case 'PDF': {
      const fileBuffer = fs.readFileSync(path.resolve(process.cwd(), doc.sourcePath))
      const pdfData = await pdfParse(fileBuffer)
      const lines = pdfData.text.split('\n').filter(Boolean)

      // Convert lines into paragraphs and simple headings
      let htmlContent = ''
      for (let line of lines) {
        line = line.trim()
        if (!line) continue
        if (line.match(/^[A-Z ]{3,}$/)) {
          // Simple heuristic: ALL CAPS lines → <h2>
          htmlContent += `<h2>${line}</h2>`
        } else if (line.length > 80) {
          htmlContent += `<p>${line}</p>`
        } else {
          htmlContent += `<p>${line}</p>`
        }
      }

      // Wrap in VM-style abstract container
      htmlContent = `<div class="abstract">${htmlContent}</div>`
      return htmlContent
    }

    case 'TEXT':
    default:
      return `<div class="abstract"><pre>${doc.contentText || ''}</pre></div>`
  }
}
