export async function extractTextPlain(buffer: Buffer): Promise<string> {
  return buffer.toString('utf-8');
}
