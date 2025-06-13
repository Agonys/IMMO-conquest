import { NextRequest } from 'next/server';
import { logger } from './logger';

export const withErrorHandler = (handler: (req: NextRequest) => Promise<Response>) => {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: unknown) {
      logger.error(error);
      return new Response('Internal server error', { status: 500 });
    }
  };
};
