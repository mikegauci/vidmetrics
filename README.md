# VidMetrics — YouTube Competitor Analyzer

Analyze any YouTube channel's top-performing videos instantly. Paste a channel URL and see subscriber stats, video performance data, engagement rates, and visual charts.

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Add your YouTube Data API v3 key to .env.local (optional — runs in demo mode without it)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Next.js 14** (App Router, TypeScript) — framework
- **Tailwind CSS** — styling
- **Recharts** — data visualization
- **Supabase** — database for persisting channel data
- **YouTube Data API v3** — data source
- **Lucide React** — icons
- **Prettier + ESLint** — code formatting and linting
- **Claude** — used to generate a design prompt for Google Stitch, and a plan prompt for Cursor
- **Google Stitch** — generated the initial UI mockup from Claude's prompt
- **Cursor (AI IDE with Opus 4.6)** — built the project using Plan mode with the Claude-generated prompt, importing the Stitch design system via screenshots

## Features

- Channel overview with subscriber count, total views, video count, average engagement
- Sortable video table with thumbnails, views, likes, comments, engagement rate
- Time range filters (This Month / Last 3 Months / All Time)
- Search and sort by any metric
- Top 3 video highlighting
- Bar chart of top 10 videos by views
- Upload frequency line chart
- CSV export of visible data
- Skeleton loading states
- Fully mobile responsive

## Development Approach

**MVP first.** Started by building a minimal working version — a single page where you paste a YouTube channel URL and get back video stats. This validated the YouTube Data API integration early before adding any polish.

**Incremental feature layering.** Each commit added one clear feature on top of the working base: sort/filter controls, Recharts visualizations, Supabase persistence, a sidebar for recent channels, and a command palette for quick search. This kept the app stable at every step.

**AI-assisted workflow.** Used Cursor throughout development for scaffolding components, debugging API edge cases, iterating on the UI layout, and writing utility functions. AI helped speed up boilerplate-heavy work (table components, chart config, Supabase queries) so more time went into UX decisions.

**Key decisions:**
- **Supabase for persistence** — stores analyzed channel data so users can revisit past results without re-fetching.
- **TTL caching** — added time-based caching to avoid burning YouTube API quota on repeated requests.
- **Modular components** — each chart, table, and UI section is its own file, keeping the codebase navigable.

## Deploy

Deploy to Vercel with one click. Add `YOUTUBE_API_KEY` to your Vercel environment variables.
