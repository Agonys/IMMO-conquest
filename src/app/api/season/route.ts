import { cacheKeys } from '@/constants';
import { db } from '@/db';
import { SeasonSelectType } from '@/db/types';
import { cache } from '@/services';
import { getISOTime, logger, withErrorHandler } from '@/utils';

const getLocations = async (): Promise<Response> => {
  const cacheKey = cacheKeys.seasons;

  if (cache.has(cacheKey)) {
    logger.info('Retrieving current season from cache');
    return Response.json(cache.get(cacheKey));
  }

  logger.info('Querying DB for current season');

  const now = getISOTime();

  const result = (await db.query.seasons.findFirst({
    where: (seasons, { gt, lt }) => lt(seasons.startDate, now) && gt(seasons.endDate, now),
    columns: {
      seasonNumber: true,
      startDate: true,
      endDate: true,
    },
  })) satisfies SeasonSelectType | undefined;

  cache.set(cacheKey, result);

  return Response.json(result);
};

export const GET = withErrorHandler(getLocations);
