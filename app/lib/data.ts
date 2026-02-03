import { neon } from '@neondatabase/serverless';
import { Redis } from '@upstash/redis';

const sql = neon(process.env.DATABASE_URL!);
const redis = Redis.fromEnv();

const CACHE_KEY = 'moments:feed:latest';
const CACHE_TTL = 3600; // 1 hour

export async function getMoments(cursor?: string) {
    // If we have a cursor, we are scrolling. Skip cache to avoid complexity for now.
    // Also skip cache if we want fresh data (but here we focus on the first page).
    if (cursor) {
        return await fetchFromDb(cursor);
    }

    // Try to get from cache for the first page
    const cached = await redis.get<any[]>(CACHE_KEY);
    if (cached) {
        console.log('CACHE HIT');
        return cached;
    }

    console.log('CACHE MISS');
    const moments = await fetchFromDb();

    // Cache the result
    if (moments.length > 0) {
        await redis.set(CACHE_KEY, moments, { ex: CACHE_TTL });
    }

    return moments;
}

async function fetchFromDb(cursor?: string) {
    const pageSize = 12;
    // Query one extra to check for hasMore
    const limit = pageSize + 1;

    const moments = await sql`
        SELECT
            moments.id,
            moments.image_url,
            moments.images,
            moments.caption,
            moments.location,
            moments.created_at,
            moments.latitude,
            moments.longitude,
            users.id AS author_id,
            users.name AS author_name,
            users.email AS author_email
        FROM moments
        JOIN users ON users.id = moments.author_id
        WHERE ${cursor ? sql`moments.created_at < ${cursor}` : sql`TRUE`}
        ORDER BY moments.created_at DESC
        LIMIT ${limit}
    `;

    return moments;
}
