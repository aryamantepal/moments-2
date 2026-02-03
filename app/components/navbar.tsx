
import Link from 'next/link';
import { Sparkles, LogOut, Home, Image as ImageIcon, Map as MapIcon } from 'lucide-react';
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
                            <ImageIcon className="w-4 h-4" />
                            <span>New Moment</span>
                        </Link>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {/* User Profile / Map */}
                        {userName && (
                            <Link
                                href={`/${userName}`}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${currentPage === 'profile' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-black'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage === 'profile' ? 'bg-white text-black' : 'bg-black text-white'
                                    }`}>
                                    <span className="font-medium text-sm">
                                        {userName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-sm hidden sm:block">
                                    <p className="font-medium">{userName}</p>
                                </div>
                                <MapIcon className="w-4 h-4 ml-1 opacity-60" />
                            </Link>
                        )}

                        {/* Sign Out Button */}
                        <form action={signOut}>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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