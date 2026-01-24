import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/navbar';
import { Calendar, MapPin, Image as ImageIcon, ArrowLeft } from 'lucide-react';

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
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
            <Navbar userName={currentUser.name} />

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
                        <div className="w-32 h-32 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
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
                                    <p className="text-3xl font-bold text-purple-600">
                                        {moments.length}
                                    </p>
                                    <p className="text-sm text-gray-600">Moments</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-pink-600">
                                        {moments.filter(m => m.location).length}
                                    </p>
                                    <p className="text-sm text-gray-600">Locations</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-blue-600">
                                        {new Date(profileUser.created_at).getFullYear()}
                                    </p>
                                    <p className="text-sm text-gray-600">Joined</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isOwnProfile && (
                                <Link
                                    href="/moments/new"
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Add New Moment</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Moments Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {isOwnProfile ? 'Your Moments' : `${username}'s Moments`}
                    </h2>
                    <p className="text-gray-600">
                        {moments.length === 0
                            ? isOwnProfile
                                ? "You haven't shared any moments yet"
                                : `${username} hasn't shared any moments yet`
                            : `${moments.length} moment${moments.length === 1 ? '' : 's'} shared`
                        }
                    </p>
                </div>

                {/* Moments Grid */}
                {moments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {moments.map((moment) => (
                            <Link
                                key={moment.id}
                                href={`/moments/${moment.id}`}
                                className="group block"
                            >
                                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <Image
                                            src={moment.image_url}
                                            alt={moment.caption || 'Moment'}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                {moment.caption && (
                                                    <p className="font-semibold text-lg mb-2 line-clamp-2">
                                                        {moment.caption}
                                                    </p>
                                                )}
                                                {moment.location && (
                                                    <div className="flex items-center space-x-1 text-sm text-white/90">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{moment.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                {moment.caption ? (
                                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                        {moment.caption}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-gray-500 italic">
                                                        No caption
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    {new Date(moment.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ImageIcon className="w-10 h-10 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                No Moments Yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {isOwnProfile
                                    ? "Start sharing your memories by creating your first moment!"
                                    : `${username} hasn't shared any moments yet. Check back later!`
                                }
                            </p>
                            {isOwnProfile && (
                                <Link
                                    href="/moments/new"
                                    className="inline-block px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                >
                                    Create Your First Moment
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}