import { NextRequest, NextResponse } from 'next/server';
import { searchTracks } from '@/app/lib/spotify-client';
import { getCurrentUserId } from '@/app/lib/auth';
import { rateLimit } from '@/app/lib/ratelimit';

export async function GET(request: NextRequest) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success } = await rateLimit.spotifySearch.limit(String(userId));
    if (!success) {
        return NextResponse.json({ error: 'Too many searches' }, { status: 429 });
    }

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
