import { neon } from '@neondatabase/serverless';
import { notFound } from "next/navigation";
import Image from "next/image";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '../../components/navbar';
import Link from 'next/link';
import { MapPin, Calendar, User, ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react';

export default async function MomentPage({ params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
        redirect('/sign-in');
    }

    const { id } = await params;
    const sql = neon(process.env.DATABASE_URL!);

    // Get user info for navbar
    const users = await sql`
        SELECT name FROM users WHERE id = ${userId} LIMIT 1
    `;
    const currentUser = users[0];

    // Get moment details
    const moments = await sql`
        SELECT
            moments.id,
            moments.image_url,
            moments.caption,
            moments.location,
            moments.created_at,
            users.id AS author_id,
            users.name AS author_name,
            users.email AS author_email
        FROM moments
        JOIN users ON users.id = moments.author_id
        WHERE moments.id = ${id}
        LIMIT 1;
    `;

    const moment = moments[0];
    if (!moment) notFound();

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
            <Navbar userName={currentUser.name} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/moments"
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to all moments</span>
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                            <div className="relative aspect-square bg-gray-100">
                                <Image
                                    src={moment.image_url}
                                    alt={moment.caption || 'Moment'}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 66vw"
                                />
                            </div>

                            <div className="p-6 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                                            <Heart className="w-5 h-5" />
                                            <span className="text-sm font-medium">Like</span>
                                        </button>
                                        <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                                            <MessageCircle className="w-5 h-5" />
                                            <span className="text-sm font-medium">Comment</span>
                                        </button>
                                    </div>
                                    <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                                        <Share2 className="w-5 h-5" />
                                        <span className="text-sm font-medium">Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 sticky top-24">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                    Posted By
                                </h3>
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-lg">
                                            {moment.author_name?.charAt(0).toUpperCase() || moment.author_email.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {moment.author_name || 'Anonymous'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {moment.author_email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {moment.caption && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                        Caption
                                    </h3>
                                    <p className="text-gray-900 text-lg leading-relaxed">
                                        {moment.caption}
                                    </p>
                                </div>
                            )}

                            {moment.location && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                        Location
                                    </h3>
                                    <div className="flex items-center space-x-2 text-gray-700">
                                        <MapPin className="w-5 h-5 text-purple-600" />
                                        <span className="text-base">{moment.location}</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                    Date
                                </h3>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                    <span className="text-base">
                                        {new Date(moment.created_at).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}