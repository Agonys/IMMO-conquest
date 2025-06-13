import { db } from '@/db';
import { locations } from '@/db/schema';
import { LocationSelectType } from '@/db/types';
import { cache } from '@/services';
import { logger, withErrorHandler } from '@/utils';

const getLocations = async (): Promise<Response> => {
  if (cache.has('locations')) {
    logger.info('Retrieving locations from cache');
    return Response.json(cache.get('locations'));
  }

  logger.info('Querying DB for locations');

  const result = (await db
    .select({
      key: locations.key,
      name: locations.name,
      backgroundUrl: locations.backgroundUrl,
    })
    .from(locations)) satisfies LocationSelectType[];

  cache.set('locations', result);

  return Response.json(result);
};

export const GET = withErrorHandler(getLocations);
