import { db } from '@/db';
import { SeasonSelectType } from '@/db/types';
import { cache } from '@/services';
import { getISOTime, logger, withErrorHandler } from '@/utils';

const getLocations = async (): Promise<Response> => {
  if (cache.has('season')) {
    logger.info('Retrieving current season from cache');
    return Response.json(cache.get('season'));
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

  cache.set('season', result);

  return Response.json(result);
};

export const GET = withErrorHandler(getLocations);
