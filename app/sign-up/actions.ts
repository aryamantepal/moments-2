'use server';

import { neon } from '@neondatabase/serverless';
import * as bcrypt from 'bcrypt';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { rateLimit } from '@/app/lib/ratelimit';
import { createSession } from '@/app/lib/auth';

export async function signUpAction(prevState: any, formData: FormData) {
    // Rate limiting
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimit.auth.limit(ip);

    if (!success) {
        return { error: 'Too many attempts. Please try again later.' };
    }

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('username') as string;

    if (!email || !password || !name) {
        return { error: 'All fields are required' };
    }

    const sql = neon(process.env.DATABASE_URL!);

    // check if email already exists
    const existingUsers = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (existingUsers.length > 0) {
        return { error: 'User with this email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const users = await sql`
            INSERT INTO users (email, password_hash, name)
            VALUES (${email}, ${hashedPassword}, ${name})
            RETURNING id
        `;

        await createSession(users[0].id);
    } catch (e) {
        console.error('Sign up error:', e);
        return { error: 'Failed to create account. Please try again.' };
    }

    redirect('/moments');
}
