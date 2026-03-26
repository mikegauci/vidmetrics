"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { parseChannelUrl } from "@/lib/utils";

export default function ChannelInput() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a YouTube channel URL");
      return;
    }

    const identifier = parseChannelUrl(url);
    if (!identifier) {
      setError("Invalid YouTube channel URL. Try a link like youtube.com/@channelname");
      return;
    }

    setLoading(true);
    router.push(`/results/${encodeURIComponent(identifier)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError("");
          }}
          placeholder="Paste a YouTube channel URL..."
          className="w-full pl-12 pr-4 py-4 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-secondary/60 text-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
        />
      </div>

      {error && <p className="mt-2 text-sm text-negative pl-1">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent/90 disabled:opacity-60 text-white rounded-xl text-base font-semibold transition-all"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Analyze Channel
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
