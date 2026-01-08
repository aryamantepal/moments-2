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
        <form action={create}>
            <input type="email" name="email" placeholder="Enter your email" />
            <input type="password" name="password" placeholder="Enter your password" />
            <button type="submit">Submit</button>
        </form>
    );
}
