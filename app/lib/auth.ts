import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const SESSION_COOKIE = 'session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 1 week, in seconds

export interface User {
    id: number;
    email: string;
    name: string;
    created_at: Date;
}

function sign(payload: string): string {
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
        throw new Error('SESSION_SECRET is not set');
    }
    return createHmac('sha256', secret).update(payload).digest('base64url');
}

/**
 * Start a session for the given user. The cookie holds `<userId>.<expiresAt>.<hmac>`
 * so the server can detect tampering without a session table.
 */
export async function createSession(userId: number) {
    const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
    const payload = `${userId}.${expiresAt}`;

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE,
        path: '/',
    });
}

/**
 * Get the current user's ID from a verified session cookie (null if absent, tampered or expired)
 */
export async function getCurrentUserId(): Promise<number | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const [id, expiresAt, signature] = token.split('.');
    if (!id || !expiresAt || !signature) return null;

    const expected = Buffer.from(sign(`${id}.${expiresAt}`));
    const actual = Buffer.from(signature);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
        return null;
    }

    if (Date.now() > Number(expiresAt)) return null;

    const userId = Number(id);
    return Number.isSafeInteger(userId) ? userId : null;
}

/**
 * Get the current user (returns null if not signed in)
 */
export async function getCurrentUser(): Promise<User | null> {
    const userId = await getCurrentUserId();

    if (!userId) return null;

    const users = await sql`
        SELECT id, email, name, created_at
        FROM users
        WHERE id = ${userId}
        LIMIT 1
    ` as unknown as User[];

    return users[0] || null;
}

/**
 * Require authentication - redirects to sign-in if not authenticated
 */
export async function requireAuth(): Promise<User> {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/sign-in');
    }

    return user;
}

/**
 * Redirect to /moments if already authenticated
 */
export async function redirectIfAuthenticated() {
    const user = await getCurrentUser();

    if (user) {
        redirect('/moments');
    }
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    redirect('/sign-in');
}
