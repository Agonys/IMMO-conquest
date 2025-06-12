export interface RateLimiter {
  count: number;
  lastRequest: number;
}

export interface Location {
  name: string;
  image: string;
}
