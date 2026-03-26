import { ChannelData, VideoData } from "./types";

const BASE = "https://www.googleapis.com/youtube/v3";

export async function fetchChannelData(identifier: string, apiKey: string): Promise<ChannelData> {
  let url: string;

  if (identifier.startsWith("UC")) {
    // Direct channel ID lookup
    url = `${BASE}/channels?part=snippet,statistics&id=${identifier}&key=${apiKey}`;
  } else if (identifier.startsWith("@")) {
    // Exact handle resolution via forHandle (no fuzzy search)
    const handle = identifier.startsWith("@") ? identifier : `@${identifier}`;
    url = `${BASE}/channels?part=snippet,statistics&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`;
  } else {
    // Legacy username or custom name — try forUsername first, fall back to search
    const byUsername = `${BASE}/channels?part=snippet,statistics&forUsername=${encodeURIComponent(identifier)}&key=${apiKey}`;
    const usernameRes = await fetch(byUsername);
    if (usernameRes.ok) {
      const usernameData = await usernameRes.json();
      if (usernameData.items?.length) {
        const ch = usernameData.items[0];
        return parseChannel(ch);
      }
    }

    // Fall back to search as last resort
    const searchUrl = `${BASE}/search?part=snippet&type=channel&q=${encodeURIComponent(identifier)}&maxResults=1&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error(`Search failed: ${searchRes.status}`);
    const searchData = await searchRes.json();
    if (!searchData.items?.length) throw new Error("Channel not found");
    const channelId = searchData.items[0].snippet.channelId;
    url = `${BASE}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Channels API failed: ${res.status}`);
  const data = await res.json();

  if (!data.items?.length) throw new Error("Channel not found");
  return parseChannel(data.items[0]);
}

function parseChannel(ch: {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium?: { url: string }; default?: { url: string } };
  };
  statistics: {
    subscriberCount?: string;
    viewCount?: string;
    videoCount?: string;
  };
}): ChannelData {
  return {
    id: ch.id,
    title: ch.snippet.title,
    description: ch.snippet.description,
    thumbnailUrl: ch.snippet.thumbnails.medium?.url ?? ch.snippet.thumbnails.default?.url ?? "",
    subscriberCount: parseInt(ch.statistics.subscriberCount ?? "0", 10),
    viewCount: parseInt(ch.statistics.viewCount ?? "0", 10),
    videoCount: parseInt(ch.statistics.videoCount ?? "0", 10),
  };
}

export async function fetchChannelVideos(
  channelId: string,
  apiKey: string,
  maxResults: number = 50
): Promise<VideoData[]> {
  // Get video IDs via search
  const searchUrl = `${BASE}/search?part=id&channelId=${channelId}&order=date&type=video&maxResults=${maxResults}&key=${apiKey}`;
  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) throw new Error(`Search API failed: ${searchRes.status}`);
  const searchData = await searchRes.json();

  const videoIds = (searchData.items || [])
    .map((item: { id: { videoId?: string } }) => item.id.videoId)
    .filter(Boolean)
    .join(",");

  if (!videoIds) return [];

  // Get full video details
  const detailsUrl = `${BASE}/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`;
  const detailsRes = await fetch(detailsUrl);
  if (!detailsRes.ok) throw new Error(`Videos API failed: ${detailsRes.status}`);
  const detailsData = await detailsRes.json();

  return (detailsData.items || []).map(
    (v: {
      id: string;
      snippet: {
        title: string;
        thumbnails: { medium?: { url: string }; default?: { url: string } };
        publishedAt: string;
      };
      statistics: {
        viewCount?: string;
        likeCount?: string;
        commentCount?: string;
      };
    }) => ({
      id: v.id,
      title: v.snippet.title,
      thumbnailUrl: v.snippet.thumbnails.medium?.url ?? v.snippet.thumbnails.default?.url ?? "",
      publishedAt: v.snippet.publishedAt,
      viewCount: parseInt(v.statistics.viewCount ?? "0", 10),
      likeCount: parseInt(v.statistics.likeCount ?? "0", 10),
      commentCount: parseInt(v.statistics.commentCount ?? "0", 10),
    })
  );
}
