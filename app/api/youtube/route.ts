import { NextRequest, NextResponse } from "next/server";
import { fetchChannelData, fetchChannelVideos } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const channelId = request.nextUrl.searchParams.get("channelId");

  if (!channelId) {
    return NextResponse.json(
      { error: "channelId query parameter is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "YouTube API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const channel = await fetchChannelData(channelId, apiKey);
    const videos = await fetchChannelVideos(channel.id, apiKey);
    return NextResponse.json({ channel, videos });
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch channel data" },
      { status: 500 }
    );
  }
}
