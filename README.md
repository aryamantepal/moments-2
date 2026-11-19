# Moments

A social platform for travelers to share "sound-scenes": photo + music moments pinned to a map.

## Features
- Post a moment with one or more photos, a caption, a location (geocoded to a map pin) and a Spotify track
- Browse the community feed, or a user's travel map on their profile
- Edit and delete your own moments

## Tech stack
- **Framework:** Next.js (App Router, Server Actions), React, TypeScript, Tailwind CSS
- **Database:** Postgres on [Neon](https://neon.tech)
- **Image storage:** Vercel Blob
- **Cache, rate limiting & background jobs:** Upstash Redis, Upstash Ratelimit, Upstash QStash
- **Music:** Spotify Web API (client-credentials search)
- **Maps:** Leaflet + OpenStreetMap / Nominatim geocoding
- **Hosting:** Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # or: vercel env pull .env.local
npm run dev
```

Then open http://localhost:3000.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string |
| `SESSION_SECRET` | Secret used to sign session cookies (`openssl rand -base64 32`) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for photo uploads |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Feed cache and rate limits |
| `QSTASH_TOKEN` | Publishing background jobs |
| `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY` | Verifying requests to `/api/queue` |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | Spotify track search |
| `NEXT_PUBLIC_APP_URL` | Public base URL used for QStash callbacks outside Vercel |

### Scripts
- `scripts/add-spotify-column.ts` adds the `spotify_track` column to `moments`
- `scripts/check-db.ts` checks that the `images` column exists
- `scripts/fix-cache.ts` clears the cached feed

## Links
- [Demo](https://moments-2-brown.vercel.app/)
