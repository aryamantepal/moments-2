import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { redirectIfAuthenticated } from '@/app/lib/auth';
import SignInForm from './form';

export default async function Page() {
    await redirectIfAuthenticated();

    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-2">
                        <Sparkles className="w-8 h-8 text-black" />
                        <span className="text-3xl font-bold text-black tracking-tight">
                            Moments
                        </span>
                    </Link>
                    <p className="text-gray-500 mt-2">Welcome back</p>
                </div>

                <div className='bg-white rounded-2xl shadow-xl p-8'>
                    <h1 className='text-2xl font-bold text-gray-900 mb-6'>Sign In</h1>
                    <SignInForm />
                </div>
            </div>
        </div>
    );
}