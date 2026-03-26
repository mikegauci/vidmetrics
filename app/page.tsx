import Navbar from "@/components/Navbar";
import ChannelInput from "@/components/ChannelInput";
import RecentChannels from "@/components/RecentChannels";
import { BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 pt-32 pb-16">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BarChart3 className="w-10 h-10 text-accent" />
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary tracking-tight">
              VidMetrics
            </h1>
          </div>
          <p className="text-text-secondary text-lg sm:text-xl mb-10 max-w-lg mx-auto">
            Analyze any YouTube channel&apos;s top-performing videos instantly.
          </p>
          <ChannelInput />
          <p className="mt-8 text-xs text-text-secondary/50">
            Works with any public YouTube channel URL or @handle
          </p>
        </div>
        <RecentChannels />
      </main>
    </div>
  );
}
