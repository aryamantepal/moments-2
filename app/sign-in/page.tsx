import { neon } from '@neondatabase/serverless';
import * as bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock } from 'lucide-react';

export default function Page() {
    async function signIn(formData: FormData) {
        'use server';

        const sql = neon(process.env.DATABASE_URL!);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const users = await sql`
            SELECT * FROM users WHERE email = ${email} LIMIT 1
        `;

        if (users.length === 0) {
            throw new Error('Invalid credentials');
        }

        const user = users[0];

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

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
        <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-2">
                        <Sparkles className="w-8 h-8 text-purple-600" />
                        <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Moments
                        </span>
                    </Link>
                    <p className="text-gray-600 mt-2">Welcome back! Sign in to continue</p>
                </div>

                {/* Sign In Card */}
                <div className='bg-white rounded-2xl shadow-xl p-8'>
                    <h1 className='text-2xl font-bold text-gray-900 mb-6'>Sign In</h1>

                    <form action={signIn} className='flex flex-col gap-4'>
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none'
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none'
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className='w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all'
                        >
                            Sign In
                        </button>

                        {/* Sign Up Link */}
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link href="/sign-up" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}