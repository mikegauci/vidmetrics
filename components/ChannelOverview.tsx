"use client";

import Image from "next/image";
import { Users, Eye, Film, TrendingUp } from "lucide-react";
import { ChannelData, VideoData } from "@/lib/types";
import { formatNumber, calcEngagement } from "@/lib/utils";

interface ChannelOverviewProps {
  channel: ChannelData;
  videos: VideoData[];
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-text-secondary" />
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );
}

export default function ChannelOverview({
  channel,
  videos,
}: ChannelOverviewProps) {
  const avgEngagement =
    videos.length > 0
      ? (
          videos.reduce(
            (sum, v) => sum + parseFloat(calcEngagement(v.viewCount, v.likeCount, v.commentCount)),
            0
          ) / videos.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="space-y-6">
      {/* Channel header */}
      <div className="flex items-center gap-4">
        <Image
          src={channel.thumbnailUrl}
          alt={channel.title}
          width={56}
          height={56}
          className="rounded-full"
          unoptimized
        />
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            {channel.title}
          </h1>
          <p className="text-sm text-text-secondary line-clamp-1">
            {channel.description}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Subscribers"
          value={formatNumber(channel.subscriberCount)}
          icon={Users}
        />
        <StatCard
          label="Total Views"
          value={formatNumber(channel.viewCount)}
          icon={Eye}
        />
        <StatCard
          label="Videos"
          value={formatNumber(channel.videoCount)}
          icon={Film}
        />
        <StatCard
          label="Avg Engagement"
          value={`${avgEngagement}%`}
          icon={TrendingUp}
        />
      </div>
    </div>
  );
}
