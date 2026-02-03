import { neon } from "@neondatabase/serverless";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import Navbar from '../../components/navbar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import NewMomentForm from './form';

export default async function Page() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
        redirect("/sign-in");
    }

    const sql = neon(process.env.DATABASE_URL!);
    const users = await sql`
        SELECT name FROM users WHERE id = ${userId} LIMIT 1
    `;
    const user = users[0];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userName={user.name} />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/moments"
                    className="inline-flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to moments</span>
                </Link>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Create New Moment
                    </h1>
                    <p className="text-gray-700 text-lg">
                        Share a special memory with your community
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <NewMomentForm />
                </div>

                <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-medium text-black mb-3">Tips for great moments:</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start space-x-2">
                            <span className="text-black mt-0.5">•</span>
                            <span>Choose clear, well-lit photos that capture the essence of the moment</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-black mt-0.5">•</span>
                            <span>Write authentic captions that tell the story behind the image</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-black mt-0.5">•</span>
                            <span>Add locations to help others discover beautiful places</span>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}