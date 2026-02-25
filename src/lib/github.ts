const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO ?? 'ZeroDriveX1/zerodrivex-docs';
const GITHUB_DOCS_PATH = process.env.GITHUB_DOCS_PATH ?? 'public/docs';

export async function uploadToGithub(file: File, slug: string): Promise<string> {
  if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is not set');

  const ext = file.name.split('.').pop() ?? 'bin';
  const path = `${GITHUB_DOCS_PATH}/${slug}.${ext}`;
  const content = Buffer.from(await file.arrayBuffer()).toString('base64');

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `docs: upload ${slug}`,
      content,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub upload failed: ${err}`);
  }

  const data = await res.json();
  return data.content.download_url as string;
}
