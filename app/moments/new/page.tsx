import Form from "next/form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from '@vercel/blob';
import { neon } from "@neondatabase/serverless";
import { cookies } from 'next/headers';
import Navbar from '../../components/navbar';
import Link from 'next/link';
import { ArrowLeft, Upload, MapPin, Type, Image as ImageIcon } from 'lucide-react';

export default async function Page() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
        redirect("/sign-in");
    }

    // Get user info for navbar
    const sql = neon(process.env.DATABASE_URL!);
    const users = await sql`
        SELECT name FROM users WHERE id = ${userId} LIMIT 1
    `;
    const user = users[0];

    async function create(formData: FormData) {
        'use server';

        const cookieStore = await cookies();
        const userId = cookieStore.get('user_id')?.value;

        if (!userId) {
            redirect("/sign-in");
        }

        const sql = neon(process.env.DATABASE_URL!);
        const caption = (formData.get("caption") as string) || null;
        const location = (formData.get("location") as string) || null;
        const image = formData.get("image") as File;

        if (!image) {
            throw new Error('Image is required');
        }

        const blob = await put(
            `moments/${crypto.randomUUID()}-${image.name}`,
            image,
            { access: 'public' }
        );

        await sql`
            INSERT INTO moments (image_url, caption, location, author_id)
            VALUES (
                ${blob.url},
                ${caption},
                ${location},
                ${Number(userId)}
            )
        `;

        revalidatePath('/moments');
        redirect('/moments');
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
            <Navbar userName={user.name} />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link
                    href="/moments"
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to moments</span>
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Create New Moment
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Share a special memory with your community
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <Form action={create} className="space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label htmlFor="image" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                <ImageIcon className="w-4 h-4 text-purple-600" />
                                <span>Image *</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    required
                                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                Upload a photo to share with the community
                            </p>
                        </div>

                        {/* Caption */}
                        <div>
                            <label htmlFor="caption" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                <Type className="w-4 h-4 text-purple-600" />
                                <span>Caption</span>
                            </label>
                            <textarea
                                id="caption"
                                name="caption"
                                placeholder="What's this moment about? Share your story..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Optional - Add context to your moment
                            </p>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                <MapPin className="w-4 h-4 text-purple-600" />
                                <span>Location</span>
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="Where was this taken?"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Optional - Add a location to your moment
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center space-x-2 bg-linear-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <Upload className="w-5 h-5" />
                                <span>Upload Moment</span>
                            </button>
                        </div>
                    </Form>
                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-purple-50 rounded-2xl p-6 border border-purple-100">
                    <h3 className="font-semibold text-purple-900 mb-3">Tips for great moments:</h3>
                    <ul className="space-y-2 text-sm text-purple-800">
                        <li className="flex items-start space-x-2">
                            <span className="text-purple-600 mt-0.5">•</span>
                            <span>Choose clear, well-lit photos that capture the essence of the moment</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-purple-600 mt-0.5">•</span>
                            <span>Write authentic captions that tell the story behind the image</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-purple-600 mt-0.5">•</span>
                            <span>Add locations to help others discover beautiful places</span>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}