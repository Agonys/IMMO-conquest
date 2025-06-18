import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { DatabaseDataUpdateSchema } from '@/db/types';
import { transformAndUpdateDatabase } from '@/scripts/transformAndUpdateDatabase';
import { cache } from '@/services';
import { formatApiZodError, logger, withErrorHandler } from '@/utils';

const putDataIntoDB = async (req: NextRequest): Promise<Response> => {
  const apiKey = req.headers.get('x-api-key');

  if (apiKey !== process.env.SECRET_API_KEY) {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const requestedWith = req.headers.get('x-requested-with');
    const userAgent = req.headers.get('user-agent');
    const { referrer } = req;
    logger.info({ forwardedFor, requestedWith, userAgent, referrer }, 'putDataIntoDB request details');
    return NextResponse.json({ error: 'Unauthorized - Get out of here' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { data, initialData, isInitialImport } = DatabaseDataUpdateSchema.parse(body);
    if (!data.length) {
      throw new Error('No data provided');
    }

    if (isInitialImport && !initialData) {
      throw new Error('Inital import without initial data');
    }

    const time = await transformAndUpdateDatabase({ data, isInitialImport, initialData });
    logger.info(`database update took ${time}s, clearing cache`);
    cache.clear();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      logger.error({ error }, 'Zod parsing error');
      return NextResponse.json({ error: formatApiZodError(error) }, { status: 400 });
    }

    if (error instanceof Error) {
      logger.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
};

export const POST = withErrorHandler(putDataIntoDB);
