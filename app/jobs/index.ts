import { Redis } from '@upstash/redis';
import { revalidatePath } from 'next/cache';

const redis = Redis.fromEnv();

export const jobs = {
    "revalidate-cache": async (data: { path?: string, key?: string }) => {
        console.log(`[Job] Responding to cache revalidation request`, data);

        if (data.key) {
            console.log(`[Job] Deleting redis key: ${data.key}`);
            await redis.del(data.key);
        }

        if (data.path) {
            console.log(`[Job] Revalidating path: ${data.path}`);
            // Note: revalidatePath might not work exactly as expected in a purely async background context
            // distinct from the user request, but it's fine for clearing ISR caches often.
            // However, for pure data cache, Redis key deletion is the main thing.
            try {
                revalidatePath(data.path);
            } catch (e) {
                // Sometimes context is missing, but usually fine in Next.js 14+ specific actions
                console.warn("revalidatePath warning:", e);
            }
        }
    },
    "process-image": async (data: { momentId: number, imageUrl: string }) => {
        console.log(`[Job] Simulating image processing for moment ${data.momentId}`);
        // Simulate a long running task
        await new Promise(r => setTimeout(r, 2000));
        console.log(`[Job] Image processed for: ${data.imageUrl}`);
    }
};

export type JobName = keyof typeof jobs;
