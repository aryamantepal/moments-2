import { neon } from '@neondatabase/serverless';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Navbar from '@/app/components/navbar';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default async function EditMomentPage({ params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
        redirect('/sign-in');
    }

    const { id } = await params;
    const sql = neon(process.env.DATABASE_URL!);

    // Get user info
    const users = await sql`
        SELECT name FROM users WHERE id = ${userId} LIMIT 1
    `;
    const currentUser = users[0];

    // Get moment details
    const moments = await sql`
        SELECT * FROM moments WHERE id = ${id} LIMIT 1
    `;

    const moment = moments[0];
    if (!moment) notFound();

    // Check if current user is the author
    if (moment.author_id !== parseInt(userId)) {
        redirect('/moments');
    }

    async function updateMoment(formData: FormData) {
        'use server';

        const cookieStore = await cookies();
        const userId = cookieStore.get('user_id')?.value;

        if (!userId) {
            redirect('/sign-in');
        }

        const sql = neon(process.env.DATABASE_URL!);
        const caption = formData.get('caption') as string;
        const location = formData.get('location') as string;

        // Verify ownership
        const moments = await sql`
            SELECT author_id FROM moments WHERE id = ${id}
        `;

        if (moments.length === 0 || moments[0].author_id !== parseInt(userId)) {
            throw new Error('Unauthorized');
        }

        // Update the moment
        await sql`
            UPDATE moments
            SET caption = ${caption || null},
                location = ${location || null}
            WHERE id = ${id}
        `;

        redirect(`/moments/${id}`);
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
            <Navbar userName={currentUser.name} />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href={`/moments/${id}`}
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to moment</span>
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Moment</h1>

                    <form action={updateMoment} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Caption
                            </label>
                            <textarea
                                name="caption"
                                defaultValue={moment.caption || ''}
                                rows={4}
                                placeholder="Share your thoughts about this moment..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                defaultValue={moment.location || ''}
                                placeholder="Where was this moment captured?"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                type="submit"
                                className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                            >
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                            </button>
                            <Link
                                href={`/moments/${id}`}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}