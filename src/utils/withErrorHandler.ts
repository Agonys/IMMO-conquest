import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

type Handler = (() => Promise<Response>) | ((req: NextRequest) => Promise<Response>);
export const withErrorHandler = (handler: Handler) => {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: unknown) {
      logger.error(error);
      return new NextResponse('Internal server error', { status: 500 });
    }
  };
};
