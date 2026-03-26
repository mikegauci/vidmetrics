"use client";

import { Download } from "lucide-react";
import { VideoData } from "@/lib/types";
import { formatDate, calcEngagement } from "@/lib/utils";

interface ExportButtonProps {
  videos: VideoData[];
  channelName: string;
}

export default function ExportButton({ videos, channelName }: ExportButtonProps) {
  function handleExport() {
    const headers = [
      "Title",
      "Date",
      "Views",
      "Likes",
      "Comments",
      "Engagement Rate (%)",
      "Video URL",
    ];

    const rows = videos.map((v) => [
      `"${v.title.replace(/"/g, '""')}"`,
      formatDate(v.publishedAt),
      v.viewCount,
      v.likeCount,
      v.commentCount,
      calcEngagement(v.viewCount, v.likeCount, v.commentCount),
      `https://youtube.com/watch?v=${v.id}`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${channelName.replace(/\s+/g, "_")}_vidmetrics_export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border hover:border-text-secondary/50 rounded-lg text-sm font-medium text-text-primary transition-colors"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
}
