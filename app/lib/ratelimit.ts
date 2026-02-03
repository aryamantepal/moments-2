import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis.
     *
     * @default "@upstash/ratelimit"
     */
    prefix: "@upstash/ratelimit",
});


export const rateLimit = {
    // Stricter limit for auth actions (5 attempts per minute)
    auth: new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "60 s"),
        prefix: "ratelimit:auth",
    }),

    // Looser limit for creating moments (3 moments per minute)
    createMoment: new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, "60 s"),
        prefix: "ratelimit:create_moment",
    })
};
