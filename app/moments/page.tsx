import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation';

export default async function Moments() {

    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
        redirect("/sign-in");
    }

    const sql = neon(process.env.DATABASE_URL!);
    //     const moments = await sql`
    //   select * from moments
    //   `
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
                Moments main display
            </div>
        </div>
    );

}
