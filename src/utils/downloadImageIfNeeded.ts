import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploaded');

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function downloadImageIfNeeded(url: string): Promise<string> {
  let validUrl: string;

  try {
    const transformedUrl = url.replaceAll(/=(\d+)/g, '=400');
    const URLObject = new URL(transformedUrl);

    if (!URLObject.pathname.endsWith('.png') && !URLObject.pathname.endsWith('.jpg')) {
      throw new Error('Only PNG and JPG is supported');
    }

    if (!['https:', 'http:'].includes(URLObject.protocol)) {
      throw new Error('image is not served as HTTP/S URL');
    }

    validUrl = URLObject.href;
  } catch (error) {
    throw error;
  }

  mkdirSync(UPLOAD_DIR, { recursive: true });

  const fileName = validUrl.split('/').pop();
  if (!fileName) {
    throw new Error(`Couldn't find file name: ${validUrl}`);
  }

  const filePath = path.join(UPLOAD_DIR, fileName);
  const publicPath = `/uploaded/${fileName}`;

  if (!existsSync(filePath)) {
    console.log('download', filePath);
    // 500ms sleep so we don't flood the CDN when processing 300+ entities
    await sleep(500);
    const res = await fetch(validUrl);
    if (!res.ok) throw new Error(`Failed to download image: ${validUrl}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(filePath, buffer);
  }

  return publicPath;
}
