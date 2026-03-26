"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Eye, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatNumber } from "@/lib/utils";

interface SavedChannel {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  subscriber_count: number;
  view_count: number;
  video_count: number;
  updated_at: string;
}

export default function RecentChannels() {
  const [channels, setChannels] = useState<SavedChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChannels() {
      const { data } = await supabase
        .from("channels")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(6);

      if (data) setChannels(data);
      setLoading(false);
    }

    fetchChannels();
  }, []);

  if (loading || channels.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-16">
      <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">
        Recent Analyses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <Link
            key={channel.id}
            href={`/results/${encodeURIComponent(channel.id)}`}
            className="group bg-surface border border-border rounded-xl p-4 hover:border-accent/50 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={channel.thumbnail_url}
                alt={channel.title}
                width={40}
                height={40}
                className="rounded-full"
                unoptimized
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {channel.title}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {channel.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {formatNumber(channel.subscriber_count)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatNumber(channel.view_count)}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
              View Results
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
