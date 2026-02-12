'use server';

import { put } from '@vercel/blob';
import { neon } from "@neondatabase/serverless";
import { cookies, headers } from 'next/headers';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { rateLimit } from '@/app/lib/ratelimit';
import { Redis } from '@upstash/redis';
import { enqueueJob } from '@/app/lib/queue';
import crypto from 'node:crypto';

const redis = Redis.fromEnv();

export async function createMomentAction(prevState: any, formData: FormData) {
    console.log("[createMomentAction] Action started");

    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('user_id')?.value;

        if (!userId) {
            console.log("[createMomentAction] Unauthorized");
            return { error: 'Unauthorized' };
        }

        // Rate limiting
        const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
        console.log("[createMomentAction] Rate limiting for user:", userId);
        const { success } = await rateLimit.createMoment.limit(userId ?? ip);

        if (!success) {
            console.log("[createMomentAction] Rate limited");
            return { error: 'You are posting too fast. Please try again later.' };
        }

        const caption = (formData.get("caption") as string) || null;
        const location = (formData.get("location") as string) || null;
        const imageFiles = formData.getAll("image") as File[];

        console.log(`[createMomentAction] Processing ${imageFiles.length} images`);

        if (!imageFiles || imageFiles.length === 0 || (imageFiles[0] instanceof File && imageFiles[0].size === 0)) {
            return { error: 'At least one image is required' };
        }

        // Geocoding
        let latitude: number | null = null;
        let longitude: number | null = null;

        if (location) {
            try {
                const geoResponse = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
                    {
                        headers: {
                            'User-Agent': 'MomentsApp/1.0'
                        }
                    }
                );
                const geoData = await geoResponse.json();
                if (geoData && geoData.length > 0) {
                    latitude = parseFloat(geoData[0].lat);
                    longitude = parseFloat(geoData[0].lon);
                    console.log(`[createMomentAction] Geocoded ${location} to ${latitude}, ${longitude}`);
                }
            } catch (geoErr) {
                console.error("[createMomentAction] Geocoding failed:", geoErr);
            }
        }

        const uploadPromises = imageFiles.map(file => {
            const fileName = file.name || 'unnamed-file';
            return put(`moments/${crypto.randomUUID()}-${fileName}`, file, { access: 'public' });
        });

        const blobs = await Promise.all(uploadPromises);
        const imageUrls = blobs.map(b => b.url);
        console.log("[createMomentAction] Images uploaded:", imageUrls.length);

        const sql = neon(process.env.DATABASE_URL!);
        await sql`
            INSERT INTO moments (image_url, images, caption, location, author_id, latitude, longitude, spotify_track)
            VALUES (
                ${imageUrls[0]},
                ${JSON.stringify(imageUrls)}::jsonb,
                ${caption},
                ${location},
                ${Number(userId)},
                ${latitude},
                ${longitude},
                ${formData.get('spotify_track') ? JSON.parse(formData.get('spotify_track') as string) : null}
            )
        `;
        console.log("[createMomentAction] Database record created");

        // Failsafe: Clear Redis cache synchronously so the feed updates immediately
        // even if the background job fails or is delayed.
        try {
            await redis.del('moments:feed:latest');
            console.log("[createMomentAction] Cache cleared synchronously");
        } catch (redisErr) {
            console.error("[createMomentAction] Sync cache clear failed:", redisErr);
        }

        try {
            await enqueueJob("revalidate-cache", {
                key: 'moments:feed:latest',
                path: '/moments'
            });

            await enqueueJob("process-image", {
                momentId: 0,
                imageUrl: imageUrls[0]
            });
            console.log("[createMomentAction] Jobs enqueued");
        } catch (jobErr) {
            console.error("[createMomentAction] Job enqueue failed (non-blocking):", jobErr);
        }

        revalidatePath('/moments');
        console.log("[createMomentAction] Path revalidated, redirecting...");

    } catch (e: any) {
        console.error('[createMomentAction] CRITICAL ERROR:', e);
        return { error: `Server error: ${e.message || 'Unknown issue'}` };
    }

    // Redirect must be called outside try-catch to work correctly in some Next.js environments
    redirect('/moments');
}
