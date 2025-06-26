import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { DataHarFileSchema, DatabaseDataUpdateSchema } from '@/db/types';
import { TransformAndUpdateDatabaseProps, transformAndUpdateDatabase } from '@/scripts/transformAndUpdateDatabase';
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

  let successData: Record<string, number> = {};
  try {
    const body = await req.json();
    let data: TransformAndUpdateDatabaseProps['data'];
    let isInitialImport: TransformAndUpdateDatabaseProps['isInitialImport'];
    let initialData: TransformAndUpdateDatabaseProps['initialData'];

    const harFile = DataHarFileSchema.safeParse(body);
    if (harFile.success) {
      data = harFile.data;
    } else {
      const DBUpdateStructure = DatabaseDataUpdateSchema.safeParse(body);

      if (!DBUpdateStructure.success) {
        return NextResponse.json({ error: formatApiZodError(DBUpdateStructure.error) }, { status: 400 });
      }

      if (!DBUpdateStructure?.data?.data.length) {
        throw new Error('No data provided');
      }

      data = DBUpdateStructure.data.data;
    }

    if (isInitialImport && !initialData) {
      throw new Error('Inital import without initial data');
    }

    const { time, insertedAndUpadedData } = await transformAndUpdateDatabase({ data, isInitialImport, initialData });
    logger.info(`database update took ${time}s, clearing cache`);
    logger.info(insertedAndUpadedData);
    successData = insertedAndUpadedData;
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

    logger.error({ error });
  }

  return NextResponse.json({ success: true, successData }, { status: 200 });
};

export const POST = withErrorHandler(putDataIntoDB);
