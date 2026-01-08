import { neon } from '@neondatabase/serverless';
import * as bcrypt from 'bcrypt';

export default function Page() {
    async function create(formData: FormData) {
        'use server';

        const sql = neon(process.env.DATABASE_URL!);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const hashedPassword = await bcrypt.hash(password, 10);

        await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${hashedPassword})
    `;
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
                </form>
            </div>
        </div>
    );

}
