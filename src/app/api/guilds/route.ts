import { gt, lt, sql } from 'drizzle-orm';
import { cacheKeys } from '@/constants';
import { db } from '@/db';
import { seasons } from '@/db/schema';
import { SeasonSelectType } from '@/db/types';
import { cache } from '@/services';
import { GetGuildsResponse, GuildEntry, GuildsSummaryLatestDBResult } from '@/types/guilds';
import { getISOTime } from '@/utils';
import { logger } from '@/utils/logger';
import { withErrorHandler } from '@/utils/withErrorHandler';

const getGuilds = async (): Promise<Response> => {
  const cacheKey = cacheKeys.guilds;

  if (cache.has(cacheKey)) {
    logger.info('Retrieving guilds from cache');
    return Response.json(cache.get(cacheKey));
  }

  logger.info('Querying DB for guilds');
  let data: GuildEntry[];
  let lastUpdated: string;
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
      return Response.json({ error: 'No season has started yet' }, { status: 404 });
    }

    const dbResult = (await db.values(sql`
      WITH best_player AS (
        SELECT
          pcl.guild_id,
          pcl.location_id,
          pcl.season_id,
          pcl.player_id,
          pcl.experience AS best_player_experience,
          pcl.kills AS best_player_kills,
          ROW_NUMBER() OVER (
            PARTITION BY pcl.guild_id, pcl.location_id, pcl.season_id
            ORDER BY pcl.experience DESC
          ) AS rn
        FROM players_contributions_latest pcl
      )
      SELECT
        gsl.updated_at as "updatedAt",
        l.key AS "locationKey",
        g.id as "guildId",
        g.name AS "guildName",
        g.icon_url AS "guildIcon",
        gsl.experience AS "totalExp",
        gsl.kills AS "kills",
        ROUND(gsl.experience * 1.0 / NULLIF(gsl.kills, 0), 2) AS "killToExpRatio",
        COUNT(DISTINCT pcl.player_id) AS "participantsCount",
        p.name AS "bestPlayerName",
        p.image_url AS "bestPlayerAvatar",
        p.background_url as "bestPlayerBackground",
        p.total_level as "bestPlayerTotalLevel",
        p.has_membership as "bestPlayerHasMembership",
        bp.best_player_experience AS "bestPlayerExperience",
        bp.best_player_kills AS "bestPlayerKills"
      FROM
        guilds_summary_latest gsl
        INNER JOIN guilds g ON gsl.guild_id = g.id
        INNER JOIN locations l ON gsl.location_id = l.id
        INNER JOIN seasons s on gsl.season_id = s.id
        INNER JOIN players_contributions_latest pcl
          ON gsl.guild_id = pcl.guild_id
          AND gsl.location_id = pcl.location_id
          AND gsl.season_id = pcl.season_id
        LEFT JOIN best_player bp
          ON bp.guild_id = gsl.guild_id
          AND bp.location_id = gsl.location_id
          AND bp.season_id = gsl.season_id
          AND bp.rn = 1
        LEFT JOIN players p ON bp.player_id = p.id
      WHERE
        s.season_number = ${currentSeason.seasonNumber}
      GROUP BY
        g.id,
        l.id
      ORDER BY
        l.id,
        participantsCount DESC,
        totalExp DESC
    `)) as unknown as GuildsSummaryLatestDBResult[];

    data = dbResult
      .map<GuildEntry>((row) => ({
        locationKey: row.locationKey,
        guildId: row.guildId,
        guildName: row.guildName,
        guildIcon: row.guildIcon,
        totalExp: row.totalExp,
        kills: row.kills,
        killToExpRatio: row.killToExpRatio,
        participantsCount: row.participantsCount,
        bestPlayer: {
          name: row.bestPlayerName,
          totalLevel: row.bestPlayerTotalLevel,
          avatar: row.bestPlayerAvatar,
          background: row.bestPlayerBackground,
          kills: row.bestPlayerKills,
          experience: row.bestPlayerExperience,
          hasMembership: Boolean(row.bestPlayerHasMembership),
        },
      }))
      .sort((a, b) => b.totalExp - a.totalExp);
    lastUpdated = dbResult[0].updatedAt;
  } catch (err) {
    logger.error({ err }, 'Get guilds database query failed');
    return Response.json({ error: 'Database guilds query error' }, { status: 500 });
  }

  const result = {
    updatedAt: lastUpdated,
    data,
  } satisfies GetGuildsResponse;

  logger.debug('Caching response');
  cache.set(cacheKey, result);

  return Response.json(result);
};

export const GET = withErrorHandler(getGuilds);
