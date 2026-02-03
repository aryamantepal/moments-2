import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/navbar';
import { Calendar, MapPin, Image as ImageIcon, ArrowLeft, Map as MapIcon } from 'lucide-react';
import MomentMapClient from '../components/MomentMapClient';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function UserProfile({ params }: { params: Promise<{ user: string }> }) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
        redirect('/sign-in');
    }

    // Get current user info for navbar
    const sql = neon(process.env.DATABASE_URL!);
    const currentUsers = await sql`
        SELECT name FROM users WHERE id = ${userId} LIMIT 1
    `;
    const currentUser = currentUsers[0];

    // Await params since it's now a Promise in Next.js 15
    const { user } = await params;
    const username = decodeURIComponent(user);

    // Get profile user info
    const profileUsers = await sql`
        SELECT id, name, email, created_at
        FROM users
        WHERE name = ${username}
        LIMIT 1
    `;

    const profileUser = profileUsers[0];

    if (!profileUser) {
        redirect('/moments');
    }

    // Get moments by this user
    const moments = await sql`
        SELECT
            moments.id,
            moments.image_url,
            moments.caption,
            moments.location,
            moments.created_at,
            moments.latitude,
            moments.longitude,
            users.id AS author_id,
            users.name AS author_name,
            users.email AS author_email
        FROM moments
        JOIN users ON users.id = moments.author_id
        WHERE users.name = ${username}
        ORDER BY moments.created_at DESC
    `;

    const isOwnProfile = currentUser.name === username;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userName={currentUser.name} currentPage="profile" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link
                    href="/moments"
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to all moments</span>
                </Link>

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        {/* Avatar */}
                        <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-5xl">
                                {username.charAt(0).toUpperCase()}
                            </span>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                {username}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {profileUser.email}
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-black">
                                        {moments.length}
                                    </p>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold text-[10px]">Moments</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-black">
                                        {moments.filter(m => m.location).length}
                                    </p>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold text-[10px]">Locations</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-black">
                                        {new Date(profileUser.created_at).getFullYear()}
                                    </p>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold text-[10px]">Joined</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isOwnProfile && (
                                <Link
                                    href="/moments/new"
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Add New Moment</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Moments Section */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {isOwnProfile ? 'Your Travel Map' : `${username}'s Travel Map`}
                        </h2>
                        <p className="text-gray-600">
                            {moments.length === 0
                                ? "No locations visited yet"
                                : `Exploring ${moments.filter(m => m.location).length} location${moments.filter(m => m.location).length === 1 ? '' : 's'} across the globe`
                            }
                        </p>
                    </div>
                </div>

                {/* Map View */}
                {moments.length > 0 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <MomentMapClient moments={moments} />
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapIcon className="w-10 h-10 text-black" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                No Travels Recorded
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {isOwnProfile
                                    ? "Start pinning your memories on the map by creating moments with locations!"
                                    : `${username} hasn't pinned any locations yet.`
                                }
                            </p>
                            {isOwnProfile && (
                                <Link
                                    href="/moments/new"
                                    className="inline-block px-6 py-3 bg-black text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                >
                                    Record Your First Trip
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}