import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { redirectIfAuthenticated } from '@/app/lib/auth';
import SignInForm from './form';

export default async function Page() {
    await redirectIfAuthenticated();

    return (
        <div className='min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-2">
                        <Sparkles className="w-8 h-8 text-purple-600" />
                        <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Moments
                        </span>
                    </Link>
                    <p className="text-gray-600 mt-2">Welcome back! Sign in to continue</p>
                </div>

                <div className='bg-white rounded-2xl shadow-xl p-8'>
                    <h1 className='text-2xl font-bold text-gray-900 mb-6'>Sign In</h1>
                    <SignInForm />
                </div>
            </div>
        </div>
    );
}