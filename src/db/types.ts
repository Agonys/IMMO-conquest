import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { guildSummaryHistory, guilds, locations, players, playersContributionHistory, seasons } from './schema';

export type SeasonInsertType = typeof seasons.$inferInsert;
export type LocationInsertType = typeof locations.$inferInsert;
export type PlayerInsertType = typeof players.$inferInsert;
export type GuildInsertType = typeof guilds.$inferInsert;
export type PlayersContributionHistoryInsertType = typeof playersContributionHistory.$inferInsert;
export type GuildSummaryHistoryInsertType = typeof guildSummaryHistory.$inferInsert;

export const seasonInsertSchema = createInsertSchema(seasons);
export const locationInsertSchema = createInsertSchema(locations);
export const playerInsertSchema = createInsertSchema(players);
export const guildInsertSchema = createInsertSchema(guilds);
export const guildSummaryInsertSchema = createInsertSchema(guildSummaryHistory);
export const playerContributionInsertSchema = createInsertSchema(playersContributionHistory);

// drizzle-orm, drizzle-zod and zod are not compatible with z.infer<typeof schema> from drizzle-zod
// Query and selects
export const LocationSelectSchema = createSelectSchema(locations).pick({
  key: true,
  name: true,
  backgroundUrl: true,
});

export const SeasonSelectSchema = createSelectSchema(seasons).pick({
  seasonNumber: true,
  startDate: true,
  endDate: true,
});

export const GuildsListSelectSchema = z.object({
  locationKey: z.string().nullable(),
  //To be introduced later on, for now select the latest one.
  // seasonNumber: z.coerce.number().int().min(1).optional(),
});

export const PlayersListSelectSchema = z.object({
  locationKey: z.string(),
});

export type LocationSelectType = typeof LocationSelectSchema._zod.input;
export type SeasonSelectType = typeof SeasonSelectSchema._zod.input;
export type GuildsListSelectType = z.infer<typeof GuildsListSelectSchema>;
export type PlayersListSelectType = z.infer<typeof PlayersListSelectSchema>;

// New data for database POST schema.
const ContributionSchema = z.object({
  id: z.number().int(),
  guild_conquest_progress_id: z.number().int(),
  character: z.object({
    name: z.object({
      raw: z.string(),
      formatted: z.string(),
    }),
    total_level: z.number().int(),
    image_url: z.string(),
    background_url: z.string(),
  }),
  kills: z.number().int(),
  experience: z.number().int(),
});

export const DataGatherFromSiteSchema = z.array(
  z.object({
    location: z.object({
      id: z.coerce.number().int(),
      key: z.string(),
      name: z.string(),
      image_url: z.string(),
    }),
    contributions: z.array(ContributionSchema),
    status: z.string(),
    colour: z.string().nullable(),
    kills: z.coerce.number().int(),
    experience: z.coerce.number().int(),
    guilds_count: z.coerce.number().int(),
    your_guild: z.object({
      kills: z.coerce.number().int(),
      experience: z.coerce.number().int(),
      position: z.coerce.number().int(),
    }),
    active_assaults: z.array(
      z.object({
        guild: z.object({
          name: z.string(),
          url: z.string(),
          tag: z.string().nullable(),
          icon_url: z.string(),
        }),
        kills: z.coerce.number().int(),
        experience: z.coerce.number().int(),
        started_at: z.string(),
        ends_in: z.string(),
      }),
    ),
    guilds: z.record(
      z.string(),
      z.object({
        id: z.coerce.number().int(),
        position: z.coerce.number().int(),
        kills: z.string(),
        experience: z.string(),
        contributions: z.array(ContributionSchema),
        guild: z.object({
          name: z.string(),
          url: z.string(),
          tag: z.string().nullable(),
          icon_url: z.string(),
          background_url: z.string(),
        }),
      }),
    ),
  }),
);

export const DatabaseDataUpdateSchema = z.object({
  data: DataGatherFromSiteSchema,
  isInitialImport: z.boolean().optional(),
  initialData: z
    .object({
      season: z.object({
        id: z.coerce.number().int().optional(),
        seasonNumber: z.coerce.number().int(),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      }),
    })
    .optional(),
});

export const DataHarFileSchema = z.object({
  log: z.object({
    creator: z.object({
      name: z.string(),
      version: z.string(),
    }),
    entries: z.array(
      z.object({
        _connectionId: z.string(),
        _initiator: z.object({
          type: z.string(),
          stack: z.object({
            callFrames: z.array(
              z.object({
                functionName: z.string(),
                scriptId: z.string(),
                url: z.string(),
                lineNumber: z.number(),
                columnNumber: z.number(),
              }),
            ),
          }),
        }),
        _priority: z.string(),
        _resourceType: z.string(),
        cache: z.record(z.any()),
        connection: z.string(),
        request: z.object({
          method: z.string(),
          url: z.string(),
          httpVersion: z.string(),
          headers: z.array(
            z.object({
              name: z.string(),
              value: z.string(),
            }),
          ),
          queryString: z.array(
            z.object({
              name: z.string(),
              value: z.string(),
            }),
          ),
          cookies: z.array(
            z.object({
              name: z.string(),
              value: z.string(),
              path: z.string(),
              domain: z.string(),
              expires: z.string(),
              httpOnly: z.boolean(),
              secure: z.boolean(),
              sameSite: z.string(),
              partitionKey: z
                .object({
                  topLevelSite: z.string(),
                  hasCrossSiteAncestor: z.boolean(),
                })
                .optional(),
            }),
          ),
          headersSize: z.number(),
          bodySize: z.number(),
          postData: z
            .object({
              mimeType: z.string(),
              text: z.string(),
            })
            .optional(),
        }),
        response: z.object({
          status: z.number(),
          statusText: z.string(),
          httpVersion: z.string(),
          headers: z.array(
            z.object({
              name: z.string(),
              value: z.string(),
            }),
          ),
          cookies: z.array(
            z.object({
              name: z.string(),
              value: z.string(),
              path: z.string(),
              domain: z.string(),
              expires: z.string(),
              httpOnly: z.boolean(),
              secure: z.boolean(),
              sameSite: z.string(),
              partitionKey: z
                .object({
                  topLevelSite: z.string(),
                  hasCrossSiteAncestor: z.boolean(),
                })
                .optional(),
            }),
          ),
          content: z.object({
            size: z.number(),
            mimeType: z.string(),
            text: z.string(),
          }),
          redirectURL: z.string(),
          headersSize: z.number(),
          bodySize: z.number(),
          _transferSize: z.number(),
          _error: z.any().nullable(),
          _fetchedViaServiceWorker: z.boolean(),
        }),
        serverIPAddress: z.string(),
        startedDateTime: z.string(),
        time: z.number(),
        timings: z.object({
          blocked: z.number(),
          dns: z.number(),
          ssl: z.number(),
          connect: z.number(),
          send: z.number(),
          wait: z.number(),
          receive: z.number(),
          _blocked_queueing: z.number(),
          _workerStart: z.number(),
          _workerReady: z.number(),
          _workerFetchStart: z.number(),
          _workerRespondWithSettled: z.number(),
        }),
      }),
    ),
    pages: z.array(z.object({})),
    version: z.string(),
  }),
});

export type DataHarFileType = z.infer<typeof DataHarFileSchema>;
export type DataGatherFromSite = z.infer<typeof DataGatherFromSiteSchema>;
