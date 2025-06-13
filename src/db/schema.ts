import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestampFields = {
  createdAt: text('created_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text('deleted_at'),
};

export const seasons = sqliteTable('seasons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  seasonNumber: integer('season_number').notNull(),
  startDate: text('start_time').notNull(),
  endDate: text('end_date').notNull(),
  ...timestampFields,
});

export const guilds = sqliteTable('guilds', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  tag: text('tag'),
  iconUrl: text('icon_url').notNull(),
  backgroundUrl: text('background_url').notNull(),
  ...timestampFields,
});

export const players = sqliteTable('players', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  totalLevel: integer('total_level').notNull(),
  hasMembership: integer('has_membership', { mode: 'boolean' }).notNull().default(false),
  imageUrl: text('image_url'),
  backgroundUrl: text('background_url'),
  ...timestampFields,
});

export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey(),
  key: text('key').notNull(),
  name: text('name').notNull(),
  backgroundUrl: text('background_url'),
  ...timestampFields,
});

export const conquestContributionsDaily = sqliteTable('conquest_contributions_daily', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  seasonId: integer('season_id').references(() => seasons.id),
  locationId: integer('location_id').references(() => locations.id),
  guildId: integer('guild_id').references(() => guilds.id),
  playerId: integer('player_id').references(() => players.id),
  kills: integer('kills').default(0),
  experience: integer('experience').default(0),
  ...timestampFields,
});

export const guildSummaryDaily = sqliteTable('guilds_summary_daily', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  seasonId: integer('season_id').references(() => seasons.id),
  locationId: integer('location_id').references(() => locations.id),
  guildId: integer('guild_id').references(() => guilds.id),
  kills: integer('kills').default(0),
  experience: integer('experience').default(0),
  ...timestampFields,
});
