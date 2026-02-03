import { Redis } from '@upstash/redis';
import { neon } from '@neondatabase/serverless';

const redis = Redis.fromEnv();
const sql = neon(process.env.DATABASE_URL!);

async function fix() {
    console.log("--- Cache Clearing ---");
    const key = 'moments:feed:latest';
    await redis.del(key);
    console.log(`Deleted Redis key: ${key}`);

    console.log("\n--- DB Structure Verification ---");
    const moments = await sql`SELECT id, images, image_url FROM moments LIMIT 5`;
    moments.forEach((m, i) => {
        console.log(`\nMoment ${i + 1} (${m.id}):`);
        console.log(`- Type of 'images': ${typeof m.images}`);
        console.log(`- Is Array: ${Array.isArray(m.images)}`);
        console.log(`- Value:`, JSON.stringify(m.images));
    });
}

fix().catch(console.error);
