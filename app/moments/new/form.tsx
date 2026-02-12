'use client';

import { useActionState, useState, useEffect } from 'react';
import { Upload, MapPin, Type, Image as ImageIcon, Music, Search, X } from 'lucide-react';
import { createMomentAction } from './actions';

interface SpotifyTrack {
    id: string;
    name: string;
    artist: string;
    album: string;
    albumArtUrl: string;
    previewUrl: string | null;
    externalUrl: string;
}

export default function NewMomentForm() {
    const [state, action, isPending] = useActionState(createMomentAction, null);

    // Spotify Search State
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SpotifyTrack[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
    const [showResults, setShowResults] = useState(false);

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.tracks || []);
                setShowResults(true);
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelectTrack = (track: SpotifyTrack) => {
        setSelectedTrack(track);
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    return (
        <form action={action} className="space-y-6">
            {state?.error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {state.error}
                </div>
            )}

            {/* Hidden input for Spotify Track */}
            <input
                type="hidden"
                name="spotify_track"
                value={selectedTrack ? JSON.stringify(selectedTrack) : ''}
            />

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

            {/* Spotify Section */}
            <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                    <Music className="w-4 h-4 text-black" />
                    <span>Add Song</span>
                </label>

                {!selectedTrack ? (
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for a song..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                if (!showResults) setShowResults(true);
                            }}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none bg-gray-50 text-black placeholder:text-gray-500"
                        />
                        {isSearching && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-black rounded-full"></div>
                            </div>
                        )}

                        {/* Search Results Dropdown */}
                        {showResults && results.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                                {results.map((track) => (
                                    <button
                                        key={track.id}
                                        type="button"
                                        onClick={() => handleSelectTrack(track)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                                    >
                                        <img
                                            src={track.albumArtUrl}
                                            alt={track.name}
                                            className="w-10 h-10 rounded object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {track.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {track.artist}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg text-white">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <img
                                src={selectedTrack.albumArtUrl}
                                alt={selectedTrack.name}
                                className="w-10 h-10 rounded object-cover"
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {selectedTrack.name}
                                </p>
                                <p className="text-xs text-gray-300 truncate">
                                    {selectedTrack.artist}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedTrack(null)}
                            className="p-2 ml-2 hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-300" />
                        </button>
                    </div>
                )}
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
