'use client';

import { useActionState } from 'react';
import { Upload, MapPin, Type, Image as ImageIcon } from 'lucide-react';
import { createMomentAction } from './actions';

export default function NewMomentForm() {
    const [state, action, isPending] = useActionState(createMomentAction, null);

    return (
        <form action={action} className="space-y-6">
            {state?.error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {state.error}
                </div>
            )}

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

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center space-x-2 bg-linear-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Upload className="w-5 h-5" />
                    <span>{isPending ? 'Uploading...' : 'Upload Moment'}</span>
                </button>
            </div>
        </form>
    );
}
