import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { db } from '@/db';
import { locations } from '@/db/schema';
import { GuildsListSelectSchema } from '@/db/types';
import { cache } from '@/services';
import { apiZodError } from '@/utils';
import { logger } from '@/utils/logger';
import { withErrorHandler } from '@/utils/withErrorHandler';

const getGuilds = async (req: NextRequest): Promise<Response> => {
  const { success, data, error } = GuildsListSelectSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));

  if (!success) {
    return apiZodError(error);
  }
  const { locationKey } = data;

  const cacheKey = `location-${locationKey}`;
  if (cache.has(cacheKey)) {
    logger.info({ locationKey }, 'Retrieving guilds from cache');
    return Response.json(cache.get(cacheKey));
  }

  logger.info({ locationKey }, 'Querying DB for guilds');
  const response = [];
  const [location] = await db.select({ id: locations.id }).from(locations).where(eq(locations.key, locationKey));
  if (!location) {
    return Response.json([]);
  }

  const guilds = await db.query.guildSummaryDaily.findMany();

  return Response.json([]);
};

export const GET = withErrorHandler(getGuilds);
