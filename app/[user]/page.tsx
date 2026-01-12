import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function Moments({ params }: { params: { user: string } }) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
        redirect('/sign-in');
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Decode the user parameter in case it has URL encoding
    const userEmail = decodeURIComponent(params.user);

    const moments = await sql`
        SELECT
            moments.id,
            moments.image_url,
            moments.caption,
            moments.location,
            moments.created_at,
            users.id AS author_id,
            users.email AS author_email
        FROM moments
        JOIN users ON users.id = moments.author_id
        WHERE users.email = ${userEmail}
        ORDER BY moments.created_at DESC
    `;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <h1 className="text-4xl font-bold mb-8 text-center text-[#333333]">
                Moments by {userEmail}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {moments.map((moment) => (
                    <Link
                        key={moment.id}
                        href={`/moments/${moment.id}`}
                        className="group block"
                    >
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
                            <Image
                                src={moment.image_url}
                                alt={moment.caption || 'Moment'}
                                fill
                                sizes="(max-width: 768px) 100vw,
                       (max-width: 1200px) 50vw,
                       33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                                <div className="text-white opacity-0 group-hover:opacity-100 transition text-center px-4">
                                    {moment.caption && (
                                        <p className="font-semibold text-lg mb-1">
                                            {moment.caption}
                                        </p>
                                    )}
                                    <p className="text-sm">by {moment.author_email}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}