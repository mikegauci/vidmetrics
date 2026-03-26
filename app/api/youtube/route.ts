import { NextRequest, NextResponse } from "next/server";
import { fetchChannelData, fetchChannelVideos } from "@/lib/youtube";
import { AnalysisResponse } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const cache = new Map<string, { data: AnalysisResponse; timestamp: number }>();

function getCached(key: string): AnalysisResponse | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export async function GET(request: NextRequest) {
  const channelId = request.nextUrl.searchParams.get("channelId");

  if (!channelId) {
    return NextResponse.json({ error: "channelId query parameter is required" }, { status: 400 });
  }

  const cached = getCached(channelId);
  if (cached) {
    return NextResponse.json(cached);
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "YouTube API key is not configured" }, { status: 500 });
  }

  try {
    const channel = await fetchChannelData(channelId, apiKey);
    const videos = await fetchChannelVideos(channel.id, apiKey);
    const result: AnalysisResponse = { channel, videos };

    cache.set(channelId, { data: result, timestamp: Date.now() });
    // Also cache by resolved ID so both @handle and UCxxx hit the same entry
    if (channelId !== channel.id) {
      cache.set(channel.id, { data: result, timestamp: Date.now() });
    }

    await supabase.from("channels").upsert(
      {
        id: channel.id,
        title: channel.title,
        description: channel.description,
        thumbnail_url: channel.thumbnailUrl,
        subscriber_count: channel.subscriberCount,
        view_count: channel.viewCount,
        video_count: channel.videoCount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("YouTube API error:", error);

    const isQuota = error instanceof Error && error.message === "QUOTA_EXCEEDED";
    if (isQuota) {
      return NextResponse.json(
        { error: "YouTube API daily quota reached. Please try again tomorrow." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch channel data" },
      { status: 500 }
    );
  }
}
