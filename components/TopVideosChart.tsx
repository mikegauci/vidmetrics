"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { VideoData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface TopVideosChartProps {
  videos: VideoData[];
}

export default function TopVideosChart({ videos }: TopVideosChartProps) {
  const data = [...videos]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 10)
    .map((v) => ({
      name: v.title.length > 30 ? v.title.slice(0, 30) + "..." : v.title,
      views: v.viewCount,
    }));

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-6">Top 10 Videos by Views</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => formatNumber(v)}
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={160}
            tick={{ fill: "#94A3B8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [formatNumber(Number(value)), "Views"]}
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#F1F5F9",
            }}
            cursor={{ fill: "rgba(255, 0, 0, 0.05)" }}
          />
          <Bar dataKey="views" fill="#FF0000" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
