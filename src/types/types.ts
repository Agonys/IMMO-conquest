export interface RateLimiter {
  count: number;
  lastRequest: number;
}
