'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ExtraProps } from 'react-markdown';

type Props = {
  content?: string;
};

export default function MarkdownViewer({ content }: Props) {
  return (
    <article className="prose prose-invert max-w-none break-words
      prose-headings:font-bold
      prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
      prose-p:leading-7
      prose-img:rounded-lg prose-img:border prose-img:border-white/10
      prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10
      prose-code:text-green-400
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src = '', alt = '' }) => (
            <img
              src={src}
              alt={alt}
              className="w-full max-h-[500px] object-contain rounded-lg border border-white/10"
            />
          ),

          a: ({ href = '', children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 underline"
            >
              {children}
            </a>
          ),

          // Best-practice typing for the code component
          code(props: React.ComponentProps<'code'> & ExtraProps) {
            const { inline, className, children, ...rest } = props;
            const content = String(children).replace(/\n$/, '');

            return inline ? (
              <code
                className="bg-black/50 px-1 py-0.5 rounded text-green-400 font-mono"
                {...rest}
              >
                {children}
              </code>
            ) : (
              <pre className="overflow-x-auto p-4 rounded-lg bg-black/60 border border-white/10">
                <code className={className} {...rest}>
                  {content}
                </code>
              </pre>
            );
          },
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </article>
  );
}
