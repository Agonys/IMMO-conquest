import { NextRequest } from 'next/server';
import { logger } from './logger';

export const withErrorHandler = (handler: (request: NextRequest) => Promise<Response>) => {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error: unknown) {
      logger.error(error);
      return new Response('Internal server error', { status: 500 });
    }
  };
};
