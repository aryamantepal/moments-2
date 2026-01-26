# Moments 🎶📷

**Music for the photos you see.**

Moments is a minimalist web app where every photo tells a story through song. Capture how you felt in an instant by pairing your photos with the perfect track.

## What is Moments?

Think **Instagram meets Spotify** — a feed of photo moments, each paired with a song that defines the vibe. No filters, no endless scrolling, just pure emotional snapshots backed by music. ideally a really simple travel blog :p

## Features

- 📸 **Upload photos** with drag-and-drop simplicity
- 🎵 **Search and attach songs** from Spotify's catalog
- ✏️ **Add captions** to give context to your moment
- 🧭 **Browse a feed** of moments from friends

(coming soon): map reference of everywhere you've been

## Tech Stack

**Frontend**
- Next.js 14+ (App Router) — Fast, modern React framework
- TypeScript — Type safety for fewer bugs
- Tailwind CSS — Rapid, responsive styling
- shadcn/ui — Beautiful, customizable components

**Backend**
- Next.js API Routes — Serverless functions, no separate backend
- Prisma ORM — Type-safe database access
- PostgreSQL — Reliable, scalable data storage (via Supabase/Railway)

**Services**
- Clerk / NextAuth.js — Authentication solved
- Uploadthing / Cloudinary — Hassle-free image uploads
- Spotify Web API — Song search and embeds

**Deployment**
- Vercel — Zero-config deployment with Git push

## Why This Stack?

Built for **speed**. Single codebase, typed end-to-end, deploys in seconds. No microservices complexity, no container orchestration — just ship features fast.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (free tier: [Railway](https://railway.app) or [Supabase](https://supabase.com))
- Spotify Developer account
- Clerk account (for auth)

### Installation

```bash
# Clone the repo
git clone https://github.com/aryamantepal/moments.git
cd moments

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys (see .env.example for required vars)

# Initialize database
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start posting moments.

## Project Structure

```
moments/
├── app/
│   ├── (auth)/          # Login/signup flows
│   ├── (main)/          # Main app pages (feed, upload, profile)
│   └── api/             # API routes (moments, upload, Spotify)
├── components/          # Reusable UI components
│   ├── ui/              # shadcn base components
│   └── ...              # MomentCard, UploadForm, etc.
├── lib/                 # Utilities and helpers
│   ├── db.ts            # Prisma client
│   └── spotify.ts       # Spotify API integration
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  moments   Moment[]
  likes     Like[]
}

model Moment {
  id         String   @id @default(cuid())
  userId     String
  imageUrl   String
  songId     String   // Spotify track ID
  songName   String
  artistName String
  caption    String?
  likes      Like[]
  createdAt  DateTime @default(now())
}

model Like {
  id       String @id @default(cuid())
  userId   String
  momentId String
  
  @@unique([userId, momentId])
}
```

## License

MIT — Use this however you want.

---

**Built with ☕ and good music.**
