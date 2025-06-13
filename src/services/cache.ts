import TTLCache from '@isaacs/ttlcache';

const HOUR_IN_SECONDS = 60 * 60;
export const cache = new TTLCache({ max: 256, ttl: 1000 * HOUR_IN_SECONDS });
