import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { DataGatherFromSiteSchema } from '@/db/types';
import { transformAndUpdateDatabase } from '@/scripts/transformAndUpdateDatabase';
import { cache } from '@/services';
import { formatApiZodError, logger, withErrorHandler } from '@/utils';

const putDataIntoDB = async (req: NextRequest): Promise<Response> => {
  const apiKey = req.headers.get('x-api-key');

  if (apiKey !== process.env.SECRET_API_KEY) {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const requestedWith = req.headers.get('x-requested-with');
    const userAgent = req.headers.get('user-agent');
    const { referrer, credentials } = req;
    logger.info({ forwardedFor, requestedWith, userAgent, referrer, credentials }, 'putDataIntoDB request details');
    return Response.json({ error: 'Unauthorized - Get out of here' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const parsedData = DataGatherFromSiteSchema.parse(body);
    if (!parsedData.length) {
      throw new Error('No data provided');
    }

    const time = await transformAndUpdateDatabase({ data: body });
    logger.info(`database update took ${time}s, clearing cache`);
    cache.clear();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      logger.error({ error }, 'Zod parsing error');
      return Response.json({ error: formatApiZodError(error) }, { status: 400 });
    }

    if (error instanceof Error) {
      logger.error({ error: error.message });
      return Response.json({ error: error.message }, { status: 400 });
    }
  }

  return Response.json({ success: true }, { status: 200 });
};

export const POST = withErrorHandler(putDataIntoDB);
