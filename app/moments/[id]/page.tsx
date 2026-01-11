import { neon } from '@neondatabase/serverless';
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function MomentPage({ params }: { params: { id: string } }) {
    const { id } = params;

    const sql = neon(process.env.DATABASE_URL!);
    const moments = await sql`
    SELECT
    moments.id,
    moments.image_url,
    moments.caption,
    moments.location,
    moments.created_at,
    users.id   AS author_id,
    users.email AS author_email
  FROM moments
  JOIN users ON users.id = moments.author_id
  WHERE moments.id = ${id}
  LIMIT 1;
  `
    const moment = moments[0];
    if (!moment) notFound();
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
            <article className="max-w-2xl space-y-4 font-(family-name:--font-geist-sans)">
                <Image
                    src={moment.image_url}
                    alt={moment.caption || 'Moment'}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                />
                <h1 className="text-4xl font-bold mb-8 text-[#333333]">{moment.caption || 'Untitled Moment'}</h1>
                <p className="text-gray-600">by {moment.author_email}</p>
                {moment.location && (
                    <p className="text-gray-500">📍 {moment.location}</p>
                )}
                <p className="text-gray-400 text-sm">
                    {new Date(moment.created_at).toLocaleDateString()}
                </p>
            </article>
        </div>
    );
}
