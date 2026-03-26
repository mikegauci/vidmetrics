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

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (dark theme)
- **Recharts** (data visualization)
- **YouTube Data API v3** (with automatic mock data fallback)
- **Lucide React** (icons)

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
- Automatic mock data fallback for demo reliability

## Deploy

Deploy to Vercel with one click. Add `YOUTUBE_API_KEY` to your Vercel environment variables.
