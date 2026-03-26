"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
  GitCompareArrows,
  Bookmark,
  Command,
  Loader2,
  Menu,
  X,
  Trash2,
} from "lucide-react";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase";
import { parseChannelUrl, formatNumber } from "@/lib/utils";

interface SavedChannel {
  id: string;
  title: string;
  thumbnail_url: string;
  subscriber_count: number;
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [searchError, setSearchError] = useState("");
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<SavedChannel[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function fetchChannels() {
      const { data } = await supabase
        .from("channels")
        .select("id, title, thumbnail_url, subscriber_count")
        .order("updated_at", { ascending: false })
        .limit(5);
      if (data) setChannels(data);
    }
    fetchChannels();
  }, []);

  async function handleDeleteChannel(e: React.MouseEvent, channelId: string) {
    e.preventDefault();
    e.stopPropagation();
    const res = await fetch(`/api/channels/${encodeURIComponent(channelId)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setChannels((prev) => prev.filter((ch) => ch.id !== channelId));
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchError("");
    if (!url.trim()) return;

    const identifier = parseChannelUrl(url);
    if (!identifier) {
      setSearchError("Invalid URL or handle");
      return;
    }
    setLoading(true);
    setUrl("");
    router.push(`/results/${encodeURIComponent(identifier)}`);
    setTimeout(() => setLoading(false), 1000);
  }

  const showLabels = mobileOpen || !collapsed;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
        <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <Logo className="w-6 h-6 text-accent shrink-0" />
          {showLabels && (
            <span className="text-lg font-bold text-text-primary tracking-tight">VidMetrics</span>
          )}
        </Link>
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {/* Search */}
        <div>
          {showLabels ? (
            <form onSubmit={handleSearch}>
              <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider px-2 mb-2 block">
                New Analysis
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (searchError) setSearchError("");
                  }}
                  placeholder="URL or @handle..."
                  className="w-full pl-8 pr-8 py-2 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-text-secondary hover:text-accent transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
              {searchError && <p className="mt-1 text-xs text-negative px-1">{searchError}</p>}
              <p className="mt-2 flex items-center gap-1 text-[11px] text-text-secondary/40 px-1">
                <Command className="w-3 h-3" />
                <span>K to quick search</span>
              </p>
            </form>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              className="w-full flex justify-center p-2 text-text-secondary hover:text-accent rounded-lg hover:bg-white/5 transition-colors"
              title="New Analysis"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Recent Channels */}
        <div>
          {showLabels && (
            <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider px-2 mb-2 block">
              Recent
            </span>
          )}
          <div className="space-y-1">
            {channels.map((ch) => (
              <div key={ch.id} className="group/item relative">
                <Link
                  href={`/results/${encodeURIComponent(ch.id)}`}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  title={ch.title}
                >
                  <Image
                    src={ch.thumbnail_url}
                    alt={ch.title}
                    width={24}
                    height={24}
                    className="rounded-full shrink-0"
                    unoptimized
                  />
                  {showLabels && (
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-text-primary truncate group-hover/item:text-accent transition-colors">
                        {ch.title}
                      </p>
                      <p className="text-[11px] text-text-secondary">
                        {formatNumber(ch.subscriber_count)} subs
                      </p>
                    </div>
                  )}
                </Link>
                {showLabels && (
                  <button
                    onClick={(e) => handleDeleteChannel(e, ch.id)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded text-text-secondary/0 group-hover/item:text-text-secondary hover:!text-negative hover:bg-negative/10 transition-all"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {channels.length === 0 && showLabels && (
              <p className="text-xs text-text-secondary/40 px-2">No recent channels</p>
            )}
          </div>
        </div>

        {/* Coming Soon */}
        <div>
          {showLabels && (
            <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider px-2 mb-2 block">
              Coming Soon
            </span>
          )}
          <div className="space-y-1">
            <div
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg opacity-40 cursor-default ${
                !showLabels ? "justify-center" : ""
              }`}
              title="Compare Channels"
            >
              <GitCompareArrows className="w-5 h-5 text-text-secondary shrink-0" />
              {showLabels && <span className="text-sm text-text-secondary">Compare</span>}
            </div>
            <div
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg opacity-40 cursor-default ${
                !showLabels ? "justify-center" : ""
              }`}
              title="Bookmarks"
            >
              <Bookmark className="w-5 h-5 text-text-secondary shrink-0" />
              {showLabels && <span className="text-sm text-text-secondary">Bookmarks</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Collapse Toggle - desktop only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex items-center justify-center gap-2 px-4 h-12 border-t border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors shrink-0"
      >
        {collapsed ? (
          <PanelLeftOpen className="w-5 h-5" />
        ) : (
          <>
            <PanelLeftClose className="w-5 h-5" />
            <span className="text-sm">Collapse</span>
          </>
        )}
      </button>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-40 p-2 bg-surface border border-border rounded-lg hover:bg-white/5 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-text-primary" />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar: overlay drawer on mobile, inline on desktop */}
      <aside
        className={`
          h-screen flex flex-col bg-surface border-r border-border transition-all duration-300
          fixed top-0 left-0 z-50 w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:top-0 md:z-auto
          ${collapsed ? "md:w-16" : "md:w-64"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
