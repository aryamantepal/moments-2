import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export interface User {
    id: number;
    email: string;
    username: string;
    created_at: Date;
}

/**
 * Get the current user's ID from cookies (returns null if not signed in)
 */
export async function getCurrentUserId(): Promise<number | null> {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id');

    if (!userId) return null;

    return parseInt(userId.value, 10);
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
        redirect('/signin');
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
    cookieStore.delete('user_id');
    redirect('/signin');
}