import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/middlewares';
import { logger } from './utils/logger';

const isProduction = process.env.NODE_ENV === 'production';
const corsOrigins = isProduction
  ? ['https://idlemmo-conquest.com']
  : ['http://localhost:3000', 'http://localhost:3001'];

function isAllowedOrigin(origin: string | null) {
  return origin && corsOrigins.includes(origin);
}

function isAllowedReferer(referer: string | null) {
  if (!referer) return true;
  try {
    const url = new URL(referer);
    return corsOrigins.includes(url.origin);
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const { method } = req;
  const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];

  if (method !== 'GET' && method !== 'OPTIONS') {
    logger.warn({ ip, method, req }, 'Blocked: Method Not Allowed');
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  if (!isAllowedReferer(referer)) {
    logger.warn({ ip, referer, req }, 'Blocked: Referer Forbidden');
    return new NextResponse('Referer Forbidden', { status: 403 });
  }

  if (origin) {
    if (!isAllowedOrigin(origin)) {
      logger.warn({ ip, origin, req }, 'Blocked: CORS Forbidden');
      return new NextResponse('CORS Forbidden', { status: 403 });
    }

    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Vary', 'Origin');
  }

  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return response;
  }

  if (rateLimit(ip)) {
    logger.warn({ ip, origin, referer, req }, 'User rate limited');
    return new NextResponse('ey ey ey, slow down', { status: 429 });
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
