"use client";

import Image from "next/image";
import { TrendingUp, TrendingDown, Trophy } from "lucide-react";
import { VideoData } from "@/lib/types";
import { formatNumber, formatDate, calcEngagement } from "@/lib/utils";

interface VideoTableProps {
  videos: VideoData[];
  topVideoIds: Set<string>;
}

export default function VideoTable({ videos, topVideoIds }: VideoTableProps) {
  if (videos.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-12 text-center">
        <p className="text-text-secondary">No videos match your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-4 py-3">
                Video
              </th>
              <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-4 py-3">
                Date
              </th>
              <th className="text-right text-xs font-medium text-text-secondary uppercase tracking-wider px-4 py-3">
                Views
              </th>
              <th className="text-right text-xs font-medium text-text-secondary uppercase tracking-wider px-4 py-3">
                Likes
              </th>
              <th className="text-right text-xs font-medium text-text-secondary uppercase tracking-wider px-4 py-3">
                Comments
              </th>
              <th className="text-right text-xs font-medium text-text-secondary uppercase tracking-wider px-4 py-3">
                Engagement
              </th>
              <th className="text-center text-xs font-medium text-text-secondary uppercase tracking-wider px-4 py-3">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => {
              const engagement = parseFloat(
                calcEngagement(video.viewCount, video.likeCount, video.commentCount)
              );
              const isTop = topVideoIds.has(video.id);
              const avgViews =
                videos.reduce((s, v) => s + v.viewCount, 0) / videos.length;
              const trendUp = video.viewCount >= avgViews;

              return (
                <tr
                  key={video.id}
                  className={`border-b border-border/50 hover:bg-background/30 transition-colors ${
                    isTop ? "bg-accent/5" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          width={96}
                          height={54}
                          className="rounded-md object-cover"
                          unoptimized
                        />
                        {isTop && (
                          <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            <Trophy className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary line-clamp-2">
                          {video.title}
                        </p>
                        {isTop && (
                          <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
                            Top {index + 1}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                    {formatDate(video.publishedAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary text-right font-medium tabular-nums">
                    {formatNumber(video.viewCount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary text-right tabular-nums">
                    {formatNumber(video.likeCount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary text-right tabular-nums">
                    {formatNumber(video.commentCount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary text-right font-medium tabular-nums">
                    {engagement.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    {trendUp ? (
                      <TrendingUp className="w-4 h-4 text-positive inline-block" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-negative inline-block" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
