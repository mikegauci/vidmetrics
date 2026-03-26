"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import ChannelOverview from "@/components/ChannelOverview";
import VideoFilters, { TimeRange, SortField, SortDirection } from "@/components/VideoFilters";
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

function sortVideos(videos: VideoData[], field: SortField, direction: SortDirection): VideoData[] {
  const sorted = [...videos];
  const dir = direction === "asc" ? 1 : -1;
  sorted.sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case "views":
        cmp = a.viewCount - b.viewCount;
        break;
      case "likes":
        cmp = a.likeCount - b.likeCount;
        break;
      case "comments":
        cmp = a.commentCount - b.commentCount;
        break;
      case "engagement": {
        const eA = parseFloat(calcEngagement(a.viewCount, a.likeCount, a.commentCount));
        const eB = parseFloat(calcEngagement(b.viewCount, b.likeCount, b.commentCount));
        cmp = eA - eB;
        break;
      }
      case "date":
        cmp = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        break;
    }
    return cmp * dir;
  });
  return sorted;
}

export default function ResultsClient({ channelId }: ResultsClientProps) {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [sortField, setSortField] = useState<SortField>("views");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
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
    vids = sortVideos(vids, sortField, sortDirection);

    return vids;
  }, [data, timeRange, searchQuery, sortField, sortDirection]);

  const topVideoIds = useMemo(() => {
    if (!data) return new Set<string>();
    const sorted = [...data.videos].sort((a, b) => b.viewCount - a.viewCount);
    return new Set(sorted.slice(0, 3).map((v) => v.id));
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-16 pb-8 md:py-8">
          <SkeletonLoader />
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-16 pb-8 md:py-8">
          <ErrorCard message={error ?? "No data available"} onRetry={fetchData} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-16 pb-8 md:py-8 space-y-8">
        <ChannelOverview channel={data.channel} videos={data.videos} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <VideoFilters
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            sortField={sortField}
            onSortChange={(field) => {
              setSortField(field);
              setSortDirection("desc");
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <ExportButton videos={processedVideos} channelName={data.channel.title} />
        </div>

        <VideoTable
          videos={processedVideos}
          topVideoIds={topVideoIds}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={(field) => {
            if (field === sortField) {
              setSortDirection((d) => (d === "desc" ? "asc" : "desc"));
            } else {
              setSortField(field);
              setSortDirection("desc");
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopVideosChart videos={processedVideos} />
          <UploadFrequencyChart videos={data.videos} />
        </div>
      </main>
    </div>
  );
}
