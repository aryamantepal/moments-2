import { Redis } from '@upstash/redis';
import { revalidatePath } from 'next/cache';

const redis = Redis.fromEnv();

// The only cache key and path a job is allowed to touch. The request body
// never chooses them, so a forged job can't delete arbitrary Redis keys.
const FEED_CACHE_KEY = 'moments:feed:latest';
const FEED_PATH = '/moments';

export const jobs = {
    "revalidate-cache": async () => {
        console.log(`[Job] Revalidating feed cache`);
        await redis.del(FEED_CACHE_KEY);

        try {
            revalidatePath(FEED_PATH);
        } catch (e) {
            console.warn("revalidatePath warning:", e);
        }
    },
};

export type JobName = keyof typeof jobs;
