import { neon } from '@neondatabase/serverless';
import * as bcrypt from 'bcrypt';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { Sparkles, Mail, Lock, User } from 'lucide-react';
import { redirectIfAuthenticated } from '../lib/auth';
import { rateLimit } from '../lib/ratelimit';

export default async function Page() {
    await redirectIfAuthenticated();
    async function create(formData: FormData) {
        'use server';

        const sql = neon(process.env.DATABASE_URL!);

        // Rate limiting
        const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
        const { success } = await rateLimit.auth.limit(ip);

        if (!success) {
            throw new Error('Too many attempts. Please try again later.');
        }

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const hashedPassword = await bcrypt.hash(password, 10);
        const name = formData.get('username') as string;

        await sql`
            INSERT INTO users (email, password_hash, name)
            VALUES (${email}, ${hashedPassword}, ${name})
        `;

        const users = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
        const user = users[0];

        const cookieStore = await cookies();
        cookieStore.set('user_id', user.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        redirect('/moments');
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-2">
                        <Sparkles className="w-8 h-8 text-purple-600" />
                        <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Moments
                        </span>
                    </Link>
                    <p className="text-gray-600 mt-2">Create your account to get started</p>
                </div>


                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h1>

                    <form action={create} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="johndoe"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-2 bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                        >
                            Create Account
                        </button>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/sign-in" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}