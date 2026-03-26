import { NextRequest, NextResponse } from "next/server";
import { fetchChannelData, fetchChannelVideos } from "@/lib/youtube";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const channelId = request.nextUrl.searchParams.get("channelId");

  if (!channelId) {
    return NextResponse.json({ error: "channelId query parameter is required" }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "YouTube API key is not configured" }, { status: 500 });
  }

  try {
    const channel = await fetchChannelData(channelId, apiKey);
    const videos = await fetchChannelVideos(channel.id, apiKey);

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

    return NextResponse.json({ channel, videos });
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch channel data" },
      { status: 500 }
    );
  }
}
