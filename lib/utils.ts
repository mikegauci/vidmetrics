export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calcEngagement(views: number, likes: number, comments: number): string {
  if (views === 0) return "0.00";
  return (((likes + comments) / views) * 100).toFixed(2);
}

export function parseChannelUrl(url: string): string | null {
  try {
    const cleaned = url.trim();

    // Direct channel ID (UCxxxx)
    if (/^UC[\w-]{22}$/.test(cleaned)) return cleaned;

    // Handle @handle without URL
    if (/^@[\w.-]+$/.test(cleaned)) return cleaned;

    const parsed = new URL(cleaned.startsWith("http") ? cleaned : `https://${cleaned}`);

    if (!parsed.hostname.includes("youtube.com") && !parsed.hostname.includes("youtu.be")) {
      return null;
    }

    const segments = parsed.pathname.split("/").filter(Boolean);

    // youtube.com/channel/UCxxxx
    if (segments[0] === "channel" && segments[1]) return segments[1];

    // youtube.com/@handle
    if (segments[0]?.startsWith("@")) return segments[0];

    // youtube.com/c/ChannelName or youtube.com/user/Username
    if ((segments[0] === "c" || segments[0] === "user") && segments[1]) {
      return segments[1];
    }

    // youtube.com/ChannelName (legacy vanity URL)
    if (segments.length === 1 && segments[0]) return segments[0];

    return null;
  } catch {
    return null;
  }
}
