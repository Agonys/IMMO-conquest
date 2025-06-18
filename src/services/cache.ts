import TTLCache from '@isaacs/ttlcache';

const HOUR_IN_SECONDS = 60 * 60;

const globalForCache = globalThis as unknown as { __cache?: TTLCache<string, unknown> };

export const cache =
  globalForCache.__cache ?? (globalForCache.__cache = new TTLCache({ max: 256, ttl: 1000 * HOUR_IN_SECONDS }));
