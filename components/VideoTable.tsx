"use client";

import Image from "next/image";
import { TrendingUp, TrendingDown, Trophy, ChevronUp, ChevronDown } from "lucide-react";
import { VideoData } from "@/lib/types";
import { SortField, SortDirection } from "@/components/VideoFilters";
import { formatNumber, formatDate, calcEngagement } from "@/lib/utils";

interface VideoTableProps {
  videos: VideoData[];
  topVideoIds: Set<string>;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const SORTABLE_COLUMNS: { key: SortField; label: string; align: "left" | "right" }[] = [
  { key: "date", label: "Date", align: "left" },
  { key: "views", label: "Views", align: "right" },
  { key: "likes", label: "Likes", align: "right" },
  { key: "comments", label: "Comments", align: "right" },
  { key: "engagement", label: "Engagement", align: "right" },
];

function SortIcon({ field, sortField, sortDirection }: { field: SortField; sortField: SortField; sortDirection: SortDirection }) {
  if (field !== sortField) {
    return (
      <span className="inline-flex flex-col ml-1 opacity-30">
        <ChevronUp className="w-3 h-3 -mb-1" />
        <ChevronDown className="w-3 h-3" />
      </span>
    );
  }
  return (
    <span className="inline-flex ml-1 text-accent">
      {sortDirection === "asc" ? (
        <ChevronUp className="w-3.5 h-3.5" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5" />
      )}
    </span>
  );
}

export default function VideoTable({ videos, topVideoIds, sortField, sortDirection, onSort }: VideoTableProps) {
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
              <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-4 py-3 min-w-[300px]">
                Video
              </th>
              {SORTABLE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className={`text-xs font-medium text-text-secondary uppercase tracking-wider px-4 py-3 cursor-pointer select-none hover:text-text-primary transition-colors ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  <span className={`inline-flex items-center ${col.align === "right" ? "justify-end" : ""}`}>
                    {col.label}
                    <SortIcon field={col.key} sortField={sortField} sortDirection={sortDirection} />
                  </span>
                </th>
              ))}
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
