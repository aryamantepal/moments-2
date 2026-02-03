import Link from 'next/link';
import { Sparkles, LogOut, Home, Image } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface NavbarProps {
    userName?: string;
    currentPage?: 'moments' | 'profile' | 'home';
}

export default function Navbar({ userName, currentPage }: NavbarProps) {
    return (
        <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/moments" className="flex items-center space-x-2 group">
                        <Sparkles className="w-5 h-5 text-black" />
                        <span className="text-xl font-bold text-black tracking-tight">
                            Moments
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link
                            href="/moments"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${currentPage === 'moments'
                                ? 'bg-black text-white font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                                }`}
                        >
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>

                        <Link
                            href="/moments/new"
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-all"
                        >
                            <Image className="w-4 h-4" />
                            <span>New Moment</span>
                        </Link>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {/* User Profile */}
                        {userName && (
                            <div className="hidden sm:flex items-center space-x-3">
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                        {userName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-black">{userName}</p>
                                </div>
                            </div>
                        )}

                        {/* Sign Out Button */}
                        <form action={signOut}>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    );
}

async function signOut() {
    'use server';
    const cookieStore = await cookies();
    cookieStore.delete('user_id');
    redirect('/sign-in');
}