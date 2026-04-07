'use client';

import DOMPurify from 'dompurify';

type Props = {
  content: string;
};

export default function HtmlViewer({ content }: Props) {
  // Sanitize HTML to prevent XSS attacks
  const clean = DOMPurify.sanitize(content || '', {
    ALLOWED_TAGS: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'em', 'u', 's', 'ul', 'ol', 'li',
      'a', 'blockquote', 'pre', 'code', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'br', 'hr', 'div', 'span'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'title'],
  });

  return (
    <div className="max-w-none overflow-x-auto prose-wrapper">
      <div
        className="prose prose-invert max-w-none break-words
          prose-headings:font-bold
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:leading-7
          prose-img:rounded-lg prose-img:border prose-img:border-white/10 prose-img:max-h-[500px]
          prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10
          prose-code:text-green-400
          [&_table]:w-full [&_table]:border [&_table]:border-white/10
          [&_td]:border [&_td]:border-white/10 [&_td]:p-2
          [&_th]:border [&_th]:border-white/10 [&_th]:p-2
        "
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </div>
  );
}
