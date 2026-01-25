import { neon } from '@neondatabase/serverless';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/navbar';
import { Plus, MapPin, Calendar } from 'lucide-react';
import { requireAuth } from '../lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function Moments() {
    const user = await requireAuth();

    const sql = neon(process.env.DATABASE_URL!);


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
        ORDER BY moments.created_at DESC
    `;

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
            <Navbar userName={user.username} currentPage="moments" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            All Moments
                        </h1>
                        <p className="text-gray-600">
                            Explore memories from your community
                        </p>
                    </div>
                    <Link
                        href="/moments/new"
                        className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">New Moment</span>
                    </Link>
                </div>

                {moments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {moments.map((moment) => (
                            <Link
                                key={moment.id}
                                href={`/moments/${moment.id}`}
                                className="group block"
                            >
                                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <Image
                                            src={moment.image_url}
                                            alt={moment.caption || 'Moment'}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
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

                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold text-xs">
                                                        {moment.author_name?.charAt(0).toUpperCase() || moment.author_email.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {moment.author_name || moment.author_email}
                                                    </p>
                                                </div>
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
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-10 h-10 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                No Moments Yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Be the first to share a moment with the community!
                            </p>
                            <Link
                                href="/moments/new"
                                className="inline-block px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                            >
                                Create First Moment
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}