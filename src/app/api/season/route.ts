import { NextResponse } from 'next/server';
import { cacheKeys } from '@/constants';
import { db } from '@/db';
import { SeasonSelectType } from '@/db/types';
import { cache } from '@/services';
import { getISOTime, logger, withErrorHandler } from '@/utils';

const getLocations = async (): Promise<Response> => {
  const cacheKey = cacheKeys.seasons;
  const cached = cache.get(cacheKey);

  if (cached !== undefined) {
    logger.info('Retrieving current season from cache');
    return cached ? NextResponse.json(cached) : NextResponse.json({ error: 'No active season found' }, { status: 404 });
  }

  logger.info('Querying DB for current season');

  const now = getISOTime();
  const result = (await db.query.seasons.findFirst({
    where: (seasons, { gte, lte }) => lte(seasons.startDate, now) && gte(seasons.endDate, now),
    columns: {
      seasonNumber: true,
      startDate: true,
      endDate: true,
    },
  })) satisfies SeasonSelectType | undefined;

  cache.set(cacheKey, result);

  return NextResponse.json(result);
};

export const GET = withErrorHandler(getLocations);
