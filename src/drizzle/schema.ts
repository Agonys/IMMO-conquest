import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const seasons = sqliteTable('season', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
});

export const guilds = sqliteTable('guild', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  tag: text('tag'),
  logoUrl: text('logo_url'),
  backgroundUrl: text('background_url'),
});

export const players = sqliteTable('player', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  backgroundUrl: text('background_url'),
});

export const locations = sqliteTable('location', {
  id: integer('id').primaryKey(),
  key: text('key').notNull(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
});

export const conquestContributions = sqliteTable('conquest_contribution', {
  id: integer('id').primaryKey(),
  seasonId: integer('season_id').references(() => seasons.id),
  locationId: integer('location_id').references(() => locations.id),
  guildId: integer('guild_id').references(() => guilds.id),
  playerId: integer('player_id').references(() => players.id),
  kills: integer('kills').default(0),
  experience: integer('experience').default(0),
});

export const guildLocationSeasons = sqliteTable('guild_location_season', {
  id: integer('id').primaryKey(),
  seasonId: integer('season_id').references(() => seasons.id),
  locationId: integer('location_id').references(() => locations.id),
  guildId: integer('guild_id').references(() => guilds.id),
  kills: integer('kills').default(0),
  experience: integer('experience').default(0),
});
