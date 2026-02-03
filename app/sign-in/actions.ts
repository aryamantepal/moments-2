'use server';

import { neon } from '@neondatabase/serverless';
import * as bcrypt from 'bcrypt';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { rateLimit } from '@/app/lib/ratelimit';

export async function signInAction(prevState: any, formData: FormData) {
    // Rate limiting
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimit.auth.limit(ip);

    if (!success) {
        return { error: 'Too many login attempts. Please try again later.' };
    }

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const sql = neon(process.env.DATABASE_URL!);
    const users = await sql`
        SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;

    if (users.length === 0) {
        return { error: 'Invalid credentials' };
    }

    const user = users[0];

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        return { error: 'Invalid credentials' };
    }

    const cookieStore = await cookies();
    cookieStore.set('user_id', user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    redirect('/moments');
}
