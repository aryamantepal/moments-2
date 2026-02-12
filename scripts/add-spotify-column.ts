
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
    console.log('Starting migration...');
    try {
        await sql`
            ALTER TABLE moments 
            ADD COLUMN IF NOT EXISTS spotify_track JSONB;
        `;
        console.log('SUCCESS: Added spotify_track column to moments table.');
    } catch (e: any) {
        console.error('Migration failed:', e);
    }
}

migrate();
