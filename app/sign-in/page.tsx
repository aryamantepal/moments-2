import { neon } from '@neondatabase/serverless';
import * as bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
    async function signIn(formData: FormData) {
        'use server';

        const sql = neon(process.env.DATABASE_URL!);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const users = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;

        if (users.length === 0) {
            throw new Error('Invalid credentials');
        }

        const user = users[0];

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const cookieStore = await cookies();
        cookieStore.set('user_id', user.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        redirect('/');
    }

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='flex flex-col gap'>
                <h1 className='text-2xl font-semibold'>Sign-in Page</h1>
                <form action={signIn} className='flex flex-col gap-3'>
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        className='border p-2 rounded'
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        className='border p-2 rounded'
                    />
                    <button
                        type="submit"
                        className='bg-black text-white p-2 rounded'
                    >
                        Submit
                    </button>
                    <Link href="/sign-up" className="text-sm underline cursor-pointer">
                        Don't have an account? Click here to sign up
                    </Link>
                </form>
            </div>
        </div>
    );
}
