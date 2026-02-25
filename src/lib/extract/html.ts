import { htmlToText } from 'html-to-text';

export async function extractHtml(buffer: Buffer): Promise<string> {
  const html = buffer.toString('utf-8');

  return htmlToText(html, {
    wordwrap: false,
    selectors: [
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'img', format: 'skip' },
    ],
  });
}
