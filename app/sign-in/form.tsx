'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { signInAction } from './actions';

export default function SignInForm() {
    const [state, action, isPending] = useActionState(signInAction, null);

    return (
        <form action={action} className='flex flex-col gap-4'>
            {state?.error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {state.error}
                </div>
            )}

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

            <button
                type="submit"
                disabled={isPending}
                className='w-full mt-2 bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {isPending ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/sign-up" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </form>
    );
}
