import { RateLimiter } from '@/types';
import { logger } from '@/utils/logger';

const rateLimitMap = new Map<string, RateLimiter>();
const MAX_REQUESTS = 60;
const TIME_WINDOW = MAX_REQUESTS * 1000;
const LOGGER_TRESHOLD_MODIFIER = 1.5;

interface RateLimitResponse {
  remaining: number;
  limit: number;
  isBlocked: boolean;
}

const response = {
  remaining: MAX_REQUESTS,
  isBlocked: false,
  limit: MAX_REQUESTS,
};

export const rateLimit = (ip?: string): RateLimitResponse => {
  const now = Date.now();

  if (!ip)
    return {
      ...response,
      isBlocked: true,
      remaining: 0,
    };

  const record = rateLimitMap.get(ip);
  if (!record || now - record.lastRequest > TIME_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return {
      ...response,
      remaining: MAX_REQUESTS - 1,
    };
  }

  record.count++;
  record.lastRequest = now;
  rateLimitMap.set(ip, record);

  if (record.count < MAX_REQUESTS) {
    return {
      ...response,
      remaining: MAX_REQUESTS - record.count,
    };
  }

  if (record.count > LOGGER_TRESHOLD_MODIFIER * MAX_REQUESTS) {
    logger.warn(
      { ip },
      `User is exceending limit of ${LOGGER_TRESHOLD_MODIFIER * MAX_REQUESTS} requests per ${TIME_WINDOW / 1000}s`,
    );
  }
  return {
    ...response,
    remaining: 0,
    isBlocked: true,
  };
};
