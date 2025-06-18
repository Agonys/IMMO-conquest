import { NextResponse } from 'next/server';
import { cacheKeys } from '@/constants';
import { db } from '@/db';
import { locations } from '@/db/schema';
import { LocationSelectType } from '@/db/types';
import { cache } from '@/services';
import { logger, withErrorHandler } from '@/utils';

const getLocations = async (): Promise<Response> => {
  const cacheKey = cacheKeys.locations;
  const cached = cache.get(cacheKey);

  if (cached !== undefined) {
    logger.info('Retrieving locations from cache');
    return cached ? NextResponse.json(cached) : NextResponse.json({ error: 'No locations found' }, { status: 404 });
  }

  logger.info('Querying DB for locations');

  const result = (await db
    .select({
      key: locations.key,
      name: locations.name,
      backgroundUrl: locations.backgroundUrl,
    })
    .from(locations)) satisfies LocationSelectType[];

  cache.set(cacheKey, result);

  return NextResponse.json(result);
};

export const GET = withErrorHandler(getLocations);
