import { Redis } from '@upstash/redis';

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';

// Use Redis to cache the token if available, otherwise fallback to memory (for local dev without redis)
const redis = process.env.UPSTASH_REDIS_REST_URL ? Redis.fromEnv() : null;

let memoryToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken() {
    // 1. Check Redis/Memory Cache
    if (redis) {
        const cachedToken = await redis.get<string>('spotify:access_token');
        if (cachedToken) return cachedToken;
    } else {
        if (memoryToken && Date.now() < memoryToken.expiresAt) {
            return memoryToken.value;
        }
    }

    // 2. Refresh Token
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Missing Spotify Client ID or Secret');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch Spotify token: ${response.statusText}`);
    }

    const data = await response.json();
    const token = data.access_token;
    const expiresIn = data.expires_in; // usually 3600 seconds

    // 3. Cache Token
    if (redis) {
        await redis.set('spotify:access_token', token, { ex: expiresIn - 60 });
    } else {
        memoryToken = {
            value: token,
            expiresAt: Date.now() + (expiresIn - 60) * 1000,
        };
    }

    return token;
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artist: string;
    album: string;
    albumArtUrl: string;
    previewUrl: string | null;
    externalUrl: string;
}

export async function searchTracks(query: string): Promise<SpotifyTrack[]> {
    if (!query) return [];

    const token = await getAccessToken();

    const params = new URLSearchParams({
        q: query,
        type: 'track',
        limit: '5',
    });

    const response = await fetch(`${SPOTIFY_SEARCH_URL}?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        console.error('Spotify Search Error:', await response.text());
        return [];
    }

    const data = await response.json();

    return data.tracks.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artists.map((a: any) => a.name).join(', '),
        album: item.album.name,
        albumArtUrl: item.album.images[0]?.url || '',
        previewUrl: item.preview_url,
        externalUrl: item.external_urls.spotify,
    }));
}
