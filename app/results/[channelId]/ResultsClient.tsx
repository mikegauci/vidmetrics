"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ChannelOverview from "@/components/ChannelOverview";
import VideoFilters, { TimeRange, SortField } from "@/components/VideoFilters";
import VideoTable from "@/components/VideoTable";
import TopVideosChart from "@/components/TopVideosChart";
import UploadFrequencyChart from "@/components/UploadFrequencyChart";
import ExportButton from "@/components/ExportButton";
import SkeletonLoader from "@/components/SkeletonLoader";
import ErrorCard from "@/components/ErrorCard";
import { AnalysisResponse, VideoData } from "@/lib/types";
import { calcEngagement } from "@/lib/utils";

interface ResultsClientProps {
  channelId: string;
}

function filterByTime(videos: VideoData[], range: TimeRange): VideoData[] {
  if (range === "all") return videos;

  const now = new Date();
  const cutoff = new Date();
  if (range === "month") cutoff.setMonth(now.getMonth() - 1);
  if (range === "3months") cutoff.setMonth(now.getMonth() - 3);

  return videos.filter((v) => new Date(v.publishedAt) >= cutoff);
}

function sortVideos(videos: VideoData[], field: SortField): VideoData[] {
  const sorted = [...videos];
  sorted.sort((a, b) => {
    switch (field) {
      case "views":
        return b.viewCount - a.viewCount;
      case "likes":
        return b.likeCount - a.likeCount;
      case "comments":
        return b.commentCount - a.commentCount;
      case "engagement": {
        const eA = parseFloat(calcEngagement(a.viewCount, a.likeCount, a.commentCount));
        const eB = parseFloat(calcEngagement(b.viewCount, b.likeCount, b.commentCount));
        return eB - eA;
      }
      case "date":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      default:
        return 0;
    }
  });
  return sorted;
}

export default function ResultsClient({ channelId }: ResultsClientProps) {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [sortField, setSortField] = useState<SortField>("views");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/youtube?channelId=${encodeURIComponent(channelId)}`);
      if (!res.ok) throw new Error("Failed to fetch channel data");
      const json: AnalysisResponse = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const processedVideos = useMemo(() => {
    if (!data) return [];
    let vids = data.videos;

    // Time filter
    vids = filterByTime(vids, timeRange);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      vids = vids.filter((v) => v.title.toLowerCase().includes(q));
    }

    // Sort
    vids = sortVideos(vids, sortField);

    return vids;
  }, [data, timeRange, searchQuery, sortField]);

  const topVideoIds = useMemo(() => {
    if (!data) return new Set<string>();
    const sorted = [...data.videos].sort((a, b) => b.viewCount - a.viewCount);
    return new Set(sorted.slice(0, 3).map((v) => v.id));
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonLoader />
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorCard message={error ?? "No data available"} onRetry={fetchData} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <ChannelOverview channel={data.channel} videos={data.videos} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <VideoFilters
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            sortField={sortField}
            onSortChange={setSortField}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <ExportButton
            videos={processedVideos}
            channelName={data.channel.title}
          />
        </div>

        <VideoTable videos={processedVideos} topVideoIds={topVideoIds} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopVideosChart videos={processedVideos} />
          <UploadFrequencyChart videos={data.videos} />
        </div>
      </main>
    </div>
  );
}
