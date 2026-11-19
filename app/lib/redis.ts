import { Redis } from '@upstash/redis';

// Redis only backs caches and rate limits, so callers treat it as optional.
// No retries: when it's unreachable, fail fast and fall back.
export const redis = Redis.fromEnv({ retry: { retries: 0 } });
