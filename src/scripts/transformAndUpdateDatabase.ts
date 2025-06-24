import { and, desc, gte, lte } from 'drizzle-orm';
import { db } from '@/db';
import {
  guildSummaryHistory,
  guildSummaryLatest,
  guilds,
  locations,
  players,
  playersContributionHistory,
  playersContributionsLatest,
  seasons,
} from '@/db/schema';
import {
  DataHarFileSchema,
  DataHarFileType,
  GuildInsertType,
  GuildSummaryHistoryInsertType,
  LocationInsertType,
  PlayerInsertType,
  PlayersContributionHistoryInsertType,
  SeasonInsertType,
  guildInsertSchema,
  locationInsertSchema,
  playerInsertSchema,
  seasonInsertSchema,
} from '@/db/types';
import { DataGatherFromSite } from '@/db/types';
import { getISOTime, numericStringToNumber } from '@/utils';
import { downloadImageIfNeeded } from '@/utils/downloadImageIfNeeded';
import { buildConflictUpdateColumns } from '../utils/buildConflictUpdateColumns';
import { decideSeason } from './pickSeason';

const now = new Date().toISOString();
// date of records, could be different than now and creation time
const date = getISOTime({ date: now });
const metadataFields = {
  createdAt: now,
  updatedAt: now,
  deletedAt: null,
};
const guildsMap = new Map<number, GuildInsertType>();
const playersMap = new Map<string, PlayerInsertType>();
const locationsMap = new Map<number, LocationInsertType>();
const playersContributionsList: PlayersContributionHistoryInsertType[] = [];
const guildSummaryList: GuildSummaryHistoryInsertType[] = [];

// const seasonData = seasonInsertSchema.parse({
//   id: 4,
//   seasonNumber: 4,
//   startDate: '2025-05-12T12:00:00.000Z',
//   endDate: '2025-07-11T12:00:00.000Z',
//   ...metadataFields,
// });

export interface TransformAndUpdateDatabaseProps {
  data: DataGatherFromSite | DataHarFileType;
  isInitialImport?: boolean;
  initialData?: {
    season: SeasonInsertType;
  };
}

interface TransformAndUpdateDatabaseResult {
  time: number;
  insertedAndUpadedData: Record<string, number>;
}

export const transformAndUpdateDatabase = async ({
  data,
  initialData,
  isInitialImport,
}: TransformAndUpdateDatabaseProps): Promise<TransformAndUpdateDatabaseResult> => {
  const timeNow = performance.now();
  let transformedData = data;

  const insertedAndUpadedData: Record<string, number> = {};

  if (!Array.isArray(transformedData)) {
    const parsed = DataHarFileSchema.parse(data);
    transformedData = parsed.log.entries.map((e) => JSON.parse(e.response.content.text)) as DataGatherFromSite;
  }

  for await (const zone of transformedData) {
    try {
      const { location, guilds } = zone;

      const parsedLocation = locationInsertSchema.parse({
        id: location.id,
        key: location.key,
        name: location.name,
        backgroundUrl: await downloadImageIfNeeded(location.image_url),
        ...metadataFields,
      });
      locationsMap.set(location.id, parsedLocation);

      for await (const guildObject of Object.values(guilds)) {
        const { guild, contributions } = guildObject;
        const { name, url, tag, icon_url, background_url } = guild;

        const guildId = new URLSearchParams(url.split('?')[1]).get('guild_id');

        if (!guildId) {
          console.warn(`No ID found while processing guild`, { url, name, tag });
          continue;
        }

        const backgroundImageName = await downloadImageIfNeeded(background_url);
        const iconImageName = await downloadImageIfNeeded(icon_url);

        const parsedData = guildInsertSchema.parse({
          name,
          tag,
          date,
          id: +guildId,
          iconUrl: iconImageName,
          backgroundUrl: backgroundImageName,
          ...metadataFields,
        });

        guildsMap.set(+guildId, parsedData);

        for await (const { character } of contributions) {
          const { total_level, image_url, background_url, name } = character;
          const { raw, formatted } = name;

          const hasMembership = formatted.includes('membership-gradient');

          const parsedData = playerInsertSchema.parse({
            hasMembership,
            date,
            name: raw,
            totalLevel: total_level,
            imageUrl: await downloadImageIfNeeded(image_url),
            backgroundUrl: await downloadImageIfNeeded(background_url),
            ...metadataFields,
          });

          playersMap.set(raw, parsedData);
        }
      }
    } catch (error) {
      console.error(`Failed to process zone: ${zone.location.name}`, error);
      throw error;
    }
  }

  await db.transaction(async (tx) => {
    let insertedSeason: SeasonInsertType[] = [];
    let seasonId: number;

    if (isInitialImport) {
      if (!initialData?.season) {
        throw new Error('Is initial import but no season was provided.');
      }

      const seasonData = seasonInsertSchema.parse({
        ...initialData.season,
      });

      insertedSeason = await tx
        .insert(seasons)
        .values(seasonData)
        .onConflictDoNothing({ target: seasons.id })
        .returning();

      if (insertedSeason.length === 0) {
        throw new Error('Trying to insert initial season data when season data is already in database.');
      }
    }

    const insertedLocations = await tx
      .insert(locations)
      .values([...locationsMap.values()])
      .onConflictDoUpdate({
        target: locations.id,
        set: buildConflictUpdateColumns(locations, ['key', 'name', 'backgroundUrl', 'updatedAt']),
      })
      .returning();

    // Inserting guilds
    const insertedGuilds = await tx
      .insert(guilds)
      .values([...guildsMap.values()])
      .onConflictDoUpdate({
        target: guilds.id,
        set: buildConflictUpdateColumns(guilds, ['name', 'tag', 'iconUrl', 'backgroundUrl', 'updatedAt']),
      })
      .returning();

    const insertedPlayers = await tx
      .insert(players)
      .values([...playersMap.values()])
      .onConflictDoUpdate({
        target: players.name,
        set: buildConflictUpdateColumns(players, [
          'name',
          'totalLevel',
          'hasMembership',
          'imageUrl',
          'backgroundUrl',
          'updatedAt',
        ]),
      })
      .returning();

    if (insertedSeason[0]?.id) {
      seasonId = insertedSeason[0].id;
    } else {
      const [ongoingSeason] = await tx
        .select()
        .from(seasons)
        .where(and(lte(seasons.startDate, now), gte(seasons.endDate, now)))
        .limit(1);
      let lastSeason = ongoingSeason;
      if (!lastSeason) {
        const recentSeasonQueryResult = await tx.select().from(seasons).orderBy(desc(seasons.endDate)).limit(1);
        if (!recentSeasonQueryResult.length) {
          throw new Error('No season exist in database');
        }

        lastSeason = recentSeasonQueryResult[0];
      }

      const decision = decideSeason({
        now,
        ongoingSeason,
        lastSeason,
      });

      if (decision.type === 'error') {
        throw new Error(decision.reason);
      }

      if (decision.type === 'ongoing') {
        seasonId = decision.season.id!;
      } else {
        // Insert new season and get its id
        const [insertedSeason] = await tx
          .insert(seasons)
          .values({
            ...decision.newSeason,
            ...metadataFields,
          })
          .returning();
        if (!insertedSeason) {
          throw new Error('Failed to create new season');
        }
        seasonId = insertedSeason.id;
      }
    }

    transformedData.forEach((zone) => {
      const { guilds, location } = zone;
      const locationId = location.id;

      Object.values(guilds).forEach((guildObject) => {
        const { contributions, kills: guildKills, experience: guildExperience, guild } = guildObject;
        const { url, tag, name } = guild;
        const guildId = parseInt(new URLSearchParams(guild.url.split('?')[1]).get('guild_id') ?? '', 10);
        if (!guildId || isNaN(guildId)) {
          console.warn(`No ID found while trying to insert daily contributions`, { url, tag, name });
          return;
        }

        guildSummaryList.push({
          date: now,
          seasonId,
          locationId,
          guildId,
          kills: numericStringToNumber(guildKills),
          experience: numericStringToNumber(guildExperience),
          ...metadataFields,
        });

        contributions.forEach((contributor) => {
          const name = contributor.character.name.raw;
          const { kills: contributorKills, experience: contributorExperience } = contributor;

          const playerId = insertedPlayers.find((p) => p.name === name)?.id;
          if (!playerId) {
            console.error(`trying to find playerId of a player who wasn't inserted`, { name, contributor, guildId });
            console.log(insertedPlayers.find((p) => p.name === name));
            throw new Error(`Player not found in inserted players: ${name}`);
          }

          playersContributionsList.push({
            date: now,
            seasonId,
            locationId,
            guildId,
            playerId,
            kills: contributorKills,
            experience: contributorExperience,
            ...metadataFields,
          });
        });
      });
    });

    // inserting contributors and guilds into history
    const playersContributionHistoryInsertedRows = await tx
      .insert(playersContributionHistory)
      .values(playersContributionsList)
      .returning();
    const guildSummaryHistoryInsertedRows = await tx.insert(guildSummaryHistory).values(guildSummaryList).returning();

    // Update latest table to hold current data
    const playersContributionsLatestInsertedRows = await tx
      .insert(playersContributionsLatest)
      .values(playersContributionsList)
      .onConflictDoUpdate({
        target: [
          playersContributionsLatest.seasonId,
          playersContributionsLatest.locationId,
          playersContributionsLatest.guildId,
          playersContributionsLatest.playerId,
        ],
        set: buildConflictUpdateColumns(playersContributionsLatest, ['date', 'experience', 'kills', 'updatedAt']),
      })
      .returning();

    const guildSummaryLatestInsertedRows = await tx
      .insert(guildSummaryLatest)
      .values(guildSummaryList)
      .onConflictDoUpdate({
        target: [guildSummaryLatest.seasonId, guildSummaryLatest.locationId, guildSummaryLatest.guildId],
        set: buildConflictUpdateColumns(guildSummaryLatest, ['date', 'experience', 'kills', 'updatedAt']),
      })
      .returning();

    insertedAndUpadedData['insertedLocations'] = insertedLocations.length;
    insertedAndUpadedData['insertedGuilds'] = insertedGuilds.length;
    insertedAndUpadedData['insertedPlayers'] = insertedPlayers.length;
    insertedAndUpadedData['playersContributionHistoryInsertedRows'] = playersContributionHistoryInsertedRows.length;
    insertedAndUpadedData['guildSummaryHistoryInsertedRows'] = guildSummaryHistoryInsertedRows.length;
    insertedAndUpadedData['playersContributionsLatestInsertedRows'] = playersContributionsLatestInsertedRows.length;
    insertedAndUpadedData['guildSummaryLatestInsertedRows'] = guildSummaryLatestInsertedRows.length;
  });

  return { time: +((performance.now() - timeNow) / 1000).toFixed(2), insertedAndUpadedData };
};
