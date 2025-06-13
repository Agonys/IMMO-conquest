import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { locations } from './schema';

// drizzle-orm, drizzle-zod and zod are not compatible with z.infer<typeof schema> from drizzle-zod

export const LocationSelectSchema = createSelectSchema(locations).pick({
  key: true,
  name: true,
  backgroundUrl: true,
});
export type LocationInsertType = typeof locations.$inferInsert;
export type LocationSelectType = typeof LocationSelectSchema._zod.input;

export const GuildsListSelectSchema = z.object({
  locationKey: z.string(),
  seasonNumber: z.coerce.number().int().min(1),
  // date: z.string().datetime(),
});
export type GuildsListSelectType = z.infer<typeof GuildsListSelectSchema>;

export const PlayersListSelectSchema = z.object({
  locationKey: z.string(),
  // date: z.string().datetime(),
});
export type PlayersListSelectType = z.infer<typeof PlayersListSelectSchema>;
