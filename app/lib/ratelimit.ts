import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

/**
 * Wrap a limiter so a Redis outage allows the request instead of crashing
 * the page. Losing rate limiting briefly beats taking sign-in offline.
 */
function failOpen(limiter: Ratelimit) {
    return {
        async limit(key: string): Promise<{ success: boolean }> {
            try {
                return await limiter.limit(key);
            } catch (err) {
                console.error("Rate limiter unavailable, allowing request:", err);
                return { success: true };
            }
        },
    };
}

export const rateLimit = {
    // Stricter limit for auth actions (5 attempts per minute)
    auth: failOpen(new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "60 s"),
        prefix: "ratelimit:auth",
    })),

    // Looser limit for creating moments (3 moments per minute)
    createMoment: failOpen(new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, "60 s"),
        prefix: "ratelimit:create_moment",
    })),

    // Track search fires as the user types (30 searches per minute)
    spotifySearch: failOpen(new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, "60 s"),
        prefix: "ratelimit:spotify_search",
    })),
};
