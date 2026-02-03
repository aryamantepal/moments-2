import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function check() {
    try {
        // Try to select the images column
        await sql`SELECT images FROM moments LIMIT 1`;
        console.log('SUCCESS: Column images exists.');
    } catch (e: any) {
        if (e.message.includes('column "images" does not exist')) {
            console.log('FAILURE: Column images MISSING.');
        } else {
            console.log('ERROR:', e.message);
        }
    }
}

check();
