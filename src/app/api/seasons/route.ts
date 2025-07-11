import { NextResponse } from 'next/server';
import { cacheKeys } from '@/constants';
import { db } from '@/db';
import { SeasonSelectType } from '@/db/types';
import { cache } from '@/services';
import { GetSeasonsResponse } from '@/types/seasons';
import { getISOTime, logger, withErrorHandler } from '@/utils';

const getSeasons = async (): Promise<Response> => {
  const cacheKey = cacheKeys.seasons;
  const cached = cache.get(cacheKey);

  if (cached !== undefined) {
    logger.info('Retrieving seasons list from cache');
    return NextResponse.json(cached);
  }

  logger.info('Querying DB for seasons list');

  const now = getISOTime();
  const list = (
    await db.query.seasons.findMany({
      columns: { seasonNumber: true, startDate: true, endDate: true },
    })
  ).sort((a, b) => b.seasonNumber - a.seasonNumber) satisfies SeasonSelectType[] | undefined;
  const currentSeason = list.find((s) => s.startDate < now && s.endDate > now);

  const response = {
    list,
    currentSeason,
  } satisfies GetSeasonsResponse;

  cache.set(cacheKey, response);

  return NextResponse.json(response);
};

export const GET = withErrorHandler(getSeasons);
