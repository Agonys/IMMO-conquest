import { RateLimiter } from '@/types';
import { logger } from '@/utils/logger';

const rateLimitMap = new Map<string, RateLimiter>();
const MAX_REQUESTS = 60;
const TIME_WINDOW = MAX_REQUESTS * 1000;
const LOGGER_TRESHOLD_MODIFIER = 1.5;

export const rateLimit = (ip?: string): boolean => {
  const now = Date.now();
  if (!ip) return true;

  const record = rateLimitMap.get(ip);
  console.log('rateLimit', record);
  if (!record || now - record.lastRequest > TIME_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return false;
  }

  record.count++;
  record.lastRequest = now;
  rateLimitMap.set(ip, record);

  if (record.count < MAX_REQUESTS) {
    return false;
  }

  if (record.count > LOGGER_TRESHOLD_MODIFIER * 1.5) {
    logger.warn(
      { ip },
      `User is exceending limit of ${LOGGER_TRESHOLD_MODIFIER * MAX_REQUESTS} requests per ${TIME_WINDOW / 1000}s`,
    );
  }
  return true;
};
