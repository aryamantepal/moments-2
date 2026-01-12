import { neon } from '@neondatabase/serverless';
import * as bcrypt from 'bcrypt';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function Page() {
    async function create(formData: FormData) {
        'use server';

        const sql = neon(process.env.DATABASE_URL!);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const hashedPassword = await bcrypt.hash(password, 10);
        const username = formData.get('username') as string;

        await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${hashedPassword}, ${username})
    `;
        const users = await sql`SELECT * FROM users where email = ${email} LIMIT 1`;
        const user = users[0];

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
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-semibold">Sign-up Page</h1>

                <form action={create} className="flex flex-col gap-3">
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        className="border p-2 rounded"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className="border p-2 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-black text-white p-2 rounded"
                    >
                        Submit
                    </button>
                    <Link href="/sign-in" className="text-sm underline cursor-pointer">
                        Have an account? Click here to sign in
                    </Link>
                </form>
            </div>
        </div>
    );

}
