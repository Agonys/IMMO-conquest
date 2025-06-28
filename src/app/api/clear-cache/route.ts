import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/services';
import { logger, withErrorHandler } from '@/utils';

const clearCacheRequest = async (req: NextRequest): Promise<Response> => {
  const apiKey = req.headers.get('x-api-key');

  if (apiKey !== process.env.SECRET_API_KEY) {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const requestedWith = req.headers.get('x-requested-with');
    const userAgent = req.headers.get('user-agent');
    const { referrer } = req;
    logger.info({ forwardedFor, requestedWith, userAgent, referrer }, 'clearCacheRequest request details');
    return NextResponse.json({ error: 'Unauthorized - Get out of here' }, { status: 401 });
  }

  try {
    cache.clear();
    logger.info('cache cleared');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    logger.error(e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};

export const POST = withErrorHandler(clearCacheRequest);
