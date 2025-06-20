import { Logger as AxiomLogger } from 'next-axiom';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/middlewares';
import { logger } from './utils/logger';

const isProduction = process.env.NODE_ENV === 'production';
const corsOrigins = ['https://idlemmo-conquest.com'];
const blockedSites: string[] = [];

function isAllowedOrigin(origin: string | null) {
  if (!isProduction) return true;
  return origin && corsOrigins.includes(origin);
}

function isBlockedReferer(referer: string | null) {
  if (isProduction || referer === null) return false;

  try {
    const url = new URL(referer);
    return blockedSites.includes(url.host);
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const axiomLogger = new AxiomLogger({ source: 'middleware' });
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const forwardedFor = req.headers.get('x-forwarded-for');
  const { method, nextUrl, headers } = req;

  axiomLogger.middleware(req);

  if (!forwardedFor) return new Response('No ip found', { status: 403 });
  const ip = forwardedFor.split(',')[0];
  if (!ip) return new Response('No ip found', { status: 403 });

  axiomLogger.info('Request received', {
    ip,
    method,
    url: nextUrl.pathname,
    origin,
    referer,
    headers: Object.fromEntries(headers.entries()), // log all headers
  });

  if (isBlockedReferer(referer)) {
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
  response.headers.set('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return response;
  }

  const rateLimitResponse = rateLimit(ip);

  if (rateLimitResponse.isBlocked) {
    logger.warn({ ip, origin, referer, req }, 'User rate limited');
    return new NextResponse('ey ey ey, slow down', { status: 429 });
  }

  response.headers.set('X-Ratelimit-Limit', `${rateLimitResponse.limit}`);
  response.headers.set('X-Ratelimit-Remaining', `${rateLimitResponse.remaining}`);

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
