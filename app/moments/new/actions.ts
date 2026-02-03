'use server';

import { put } from '@vercel/blob';
import { neon } from "@neondatabase/serverless";
import { cookies, headers } from 'next/headers';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { rateLimit } from '@/app/lib/ratelimit';

export async function createMomentAction(prevState: any, formData: FormData) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
        return { error: 'Unauthorized' };
    }

    // Rate limiting
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    // Rate limit by user ID if logged in, else IP
    const { success } = await rateLimit.createMoment.limit(userId ?? ip);

    if (!success) {
        return { error: 'You are posting too fast. Please try again later.' };
    }

    const caption = (formData.get("caption") as string) || null;
    const location = (formData.get("location") as string) || null;
    const image = formData.get("image") as File;

    if (!image || image.size === 0) {
        return { error: 'Image is required' };
    }

    try {
        const blob = await put(
            `moments/${crypto.randomUUID()}-${image.name}`,
            image,
            { access: 'public' }
        );

        const sql = neon(process.env.DATABASE_URL!);
        await sql`
            INSERT INTO moments (image_url, caption, location, author_id)
            VALUES (
                ${blob.url},
                ${caption},
                ${location},
                ${Number(userId)}
            )
        `;
    } catch (e) {
        console.error('Create moment error:', e);
        return { error: 'Failed to create moment. Please try again.' };
    }

    revalidatePath('/moments');
    redirect('/moments');
}
