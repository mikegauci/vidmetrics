"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { VideoData } from "@/lib/types";

interface UploadFrequencyChartProps {
  videos: VideoData[];
}

export default function UploadFrequencyChart({ videos }: UploadFrequencyChartProps) {
  // Group uploads by month
  const monthCounts = new Map<string, number>();

  videos.forEach((v) => {
    const d = new Date(v.publishedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthCounts.set(key, (monthCounts.get(key) || 0) + 1);
  });

  const data = Array.from(monthCounts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => {
      const [y, m] = month.split("-");
      const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      return { month: label, uploads: count };
    });

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-6">Upload Frequency Over Time</h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ left: 0, right: 20 }}>
          <defs>
            <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF0000" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#FF0000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [String(value), "Uploads"]}
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#F1F5F9",
            }}
          />
          <Area
            type="monotone"
            dataKey="uploads"
            stroke="#FF0000"
            strokeWidth={2}
            fill="url(#uploadGradient)"
            dot={{ fill: "#FF0000", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#FF0000" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
