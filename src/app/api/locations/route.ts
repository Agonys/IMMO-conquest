import { cacheKeys } from '@/constants';
import { db } from '@/db';
import { locations } from '@/db/schema';
import { LocationSelectType } from '@/db/types';
import { cache } from '@/services';
import { logger, withErrorHandler } from '@/utils';

const getLocations = async (): Promise<Response> => {
  const cacheKey = cacheKeys.locations;

  if (cache.has(cacheKey)) {
    logger.info('Retrieving locations from cache');
    return Response.json(cache.get(cacheKey));
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

  return Response.json(result);
};

export const GET = withErrorHandler(getLocations);
