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
                <label htmlFor="image" className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                    <ImageIcon className="w-4 h-4 text-black" />
                    <span>Image *</span>
                </label>
                <div className="relative">
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        multiple
                        required
                        onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                                // Basic preview logic could go here, or just let users see file count
                                const count = files.length;
                                const label = document.getElementById('file-label');
                                if (label) label.innerText = `${count} image${count > 1 ? 's' : ''} selected`;
                            }
                        }}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-black focus:ring-0 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer"
                    />
                    <p id="file-label" className="mt-2 text-sm font-medium text-black"></p>
                </div>
                <p className="mt-2 text-xs text-gray-600">
                    Upload a photo to share with the community
                </p>
            </div>

            <div>
                <label htmlFor="caption" className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                    <Type className="w-4 h-4 text-black" />
                    <span>Caption</span>
                </label>
                <textarea
                    id="caption"
                    name="caption"
                    placeholder="What's this moment about? Share your story..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none resize-none bg-gray-50 text-black placeholder:text-gray-500"
                />
                <p className="mt-2 text-xs text-gray-600">
                    Optional - Add context to your moment
                </p>
            </div>

            <div>
                <label htmlFor="location" className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                    <MapPin className="w-4 h-4 text-black" />
                    <span>Location</span>
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Where was this taken?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none bg-gray-50 text-black placeholder:text-gray-500"
                />
                <p className="mt-2 text-xs text-gray-600">
                    Optional - Add a location to your moment
                </p>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center space-x-2 bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Upload className="w-5 h-5" />
                    <span>{isPending ? 'Uploading...' : 'Upload Moment'}</span>
                </button>
            </div>
        </form>
    );
}
