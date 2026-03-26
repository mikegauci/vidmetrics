"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ArrowRight, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { parseChannelUrl, formatNumber } from "@/lib/utils";

interface SavedChannel {
  id: string;
  title: string;
  thumbnail_url: string;
  subscriber_count: number;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<SavedChannel[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setUrl("");
    setError("");
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      supabase
        .from("channels")
        .select("id, title, thumbnail_url, subscriber_count")
        .order("updated_at", { ascending: false })
        .limit(5)
        .then(({ data }) => {
          if (data) setChannels(data);
        });
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!url.trim()) return;

    const identifier = parseChannelUrl(url);
    if (!identifier) {
      setError("Invalid YouTube channel URL or @handle");
      return;
    }
    setLoading(true);
    close();
    router.push(`/results/${encodeURIComponent(identifier)}`);
    setTimeout(() => setLoading(false), 1000);
  }

  function handleChannelClick(channelId: string) {
    close();
    router.push(`/results/${encodeURIComponent(channelId)}`);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

      {/* Panel */}
      <div className="relative w-full max-w-lg mx-4 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            {loading ? (
              <Loader2 className="w-5 h-5 text-accent animate-spin shrink-0" />
            ) : (
              <Search className="w-5 h-5 text-text-secondary shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder="Paste a YouTube channel URL or @handle..."
              className="flex-1 bg-transparent text-text-primary placeholder:text-text-secondary/50 text-base focus:outline-none"
            />
            <button
              type="button"
              onClick={close}
              className="p-1 text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {url.trim() && (
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-border"
            >
              <ArrowRight className="w-4 h-4 text-accent shrink-0" />
              <span className="text-sm text-text-primary">
                Analyze <span className="text-accent font-medium">{url}</span>
              </span>
            </button>
          )}
        </form>

        {error && <p className="px-4 py-2 text-sm text-negative border-b border-border">{error}</p>}

        {channels.length > 0 && (
          <div className="py-2">
            <p className="px-4 py-1 text-[11px] font-medium text-text-secondary uppercase tracking-wider">
              Recent Channels
            </p>
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => handleChannelClick(ch.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
              >
                <Image
                  src={ch.thumbnail_url}
                  alt={ch.title}
                  width={28}
                  height={28}
                  className="rounded-full shrink-0"
                  unoptimized
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-primary truncate">{ch.title}</p>
                  <p className="text-[11px] text-text-secondary">
                    {formatNumber(ch.subscriber_count)} subscribers
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-background/50">
          <span className="text-[11px] text-text-secondary/50">
            Works with any public channel URL or @handle
          </span>
          <kbd className="text-[11px] text-text-secondary/50 bg-surface border border-border rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>
      </div>
    </div>
  );
}
