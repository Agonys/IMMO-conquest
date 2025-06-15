import { and, eq, gt, lt } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { db } from '@/db';
import { guilds, locations, players, playersContributionsLatest, seasons } from '@/db/schema';
import { GuildsListSelectSchema, SeasonSelectType } from '@/db/types';
import { cache } from '@/services';
import { apiZodError, getISOTime } from '@/utils';
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
  let result;
  try {
    const now = getISOTime();
    const currentSeason = cache.has('season')
      ? cache.get<Pick<SeasonSelectType, 'seasonNumber'>>('season')
      : await db.query.seasons.findFirst({
          where: () => lt(seasons.startDate, now) && gt(seasons.endDate, now),
          columns: {
            seasonNumber: true,
          },
        });

    if (!currentSeason) {
      logger.warn({ currentSeason }, "Season couldn't be found. Maybe theres isn't one?");
      return Response.json({ error: 'No season open yet' }, { status: 500 });
    }

    const selectConditions = [eq(seasons.seasonNumber, currentSeason.seasonNumber)];
    if (locationKey) {
      selectConditions.push(eq(locations.key, locationKey));
    }
    result = await db
      .select({
        location: locations.name,
        guild: guilds.name,
        kills: playersContributionsLatest.kills,
        experience: playersContributionsLatest.experience,
        player: players.name,
      })
      .from(playersContributionsLatest)
      .innerJoin(seasons, eq(playersContributionsLatest.seasonId, seasons.id))
      .innerJoin(locations, eq(playersContributionsLatest.locationId, locations.id))
      .innerJoin(players, eq(playersContributionsLatest.playerId, players.id))
      .innerJoin(guilds, eq(playersContributionsLatest.guildId, guilds.id))
      .where(and(...selectConditions));
  } catch (err) {
    logger.error({ err }, 'Get guilds database query failed');
    return Response.json({ error: 'Database guilds query error' }, { status: 500 });
  }

  logger.debug('Caching response');
  cache.set(cacheKey, result);

  return Response.json(result);
};

export const GET = withErrorHandler(getGuilds);
