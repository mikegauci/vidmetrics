"use client";

import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 group">
          <Logo className="w-6 h-6 text-accent" />
          <span className="text-lg font-bold text-text-primary tracking-tight">VidMetrics</span>
        </Link>

        <div className="flex items-center gap-4" />
      </div>
    </nav>
  );
}
