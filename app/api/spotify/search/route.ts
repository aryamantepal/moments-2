import { NextRequest, NextResponse } from 'next/server';
import { searchTracks } from '../../lib/spotify';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ tracks: [] });
    }

    try {
        const tracks = await searchTracks(query);
        return NextResponse.json({ tracks });
    } catch (error) {
        console.error('Spotify API Error:', error);
        return NextResponse.json(
            { error: 'Failed to search tracks' },
            { status: 500 }
        );
    }
}
