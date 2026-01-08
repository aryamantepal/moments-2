import { neon } from '@neondatabase/serverless';
import * as bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Page() {
    async function signIn(formData: FormData) {
        'use server';

        const sql = neon(process.env.DATABASE_URL!);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        // const hashedPassword = await bcrypt.hash(password, 10);

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
        <div>
            <h1>Sign-in Page</h1>
            <form action={signIn}>
                <input name="email" type="email" placeholder="Enter your email" required />
                <input name="password" type="password" placeholder="Enter your password" required />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
