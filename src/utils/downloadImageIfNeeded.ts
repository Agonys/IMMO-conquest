import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploaded');
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function downloadImageIfNeeded(url: string, returnPublicPath = false): Promise<string> {
  const transformedUrl = url.replaceAll(/=(\d+)/g, '=400');
  const URLObject = new URL(transformedUrl);

  if (!ALLOWED_EXTENSIONS.includes(path.extname(URLObject.pathname.toLowerCase()))) {
    throw new Error('Only PNG, JPG, JPEG are supported');
  }

  if (!['https:', 'http:'].includes(URLObject.protocol)) {
    throw new Error('image is not served as HTTP/S URL');
  }

  const validUrl = URLObject.href;

  mkdirSync(UPLOAD_DIR, { recursive: true });

  const fileName = path.basename(new URL(validUrl).pathname);
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

  return returnPublicPath ? publicPath : fileName;
}
