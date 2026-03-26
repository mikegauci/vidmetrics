"use client";

import { Search } from "lucide-react";

export type TimeRange = "month" | "3months" | "all";
export type SortField =
  | "views"
  | "likes"
  | "comments"
  | "engagement"
  | "date";
export type SortDirection = "asc" | "desc";

interface VideoFiltersProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  sortField: SortField;
  onSortChange: (field: SortField) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const TIME_TABS: { value: TimeRange; label: string }[] = [
  { value: "month", label: "This Month" },
  { value: "3months", label: "Last 3 Months" },
  { value: "all", label: "All Time" },
];

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "views", label: "Views" },
  { value: "likes", label: "Likes" },
  { value: "comments", label: "Comments" },
  { value: "engagement", label: "Engagement Rate" },
  { value: "date", label: "Date" },
];

export default function VideoFilters({
  timeRange,
  onTimeRangeChange,
  sortField,
  onSortChange,
  searchQuery,
  onSearchChange,
}: VideoFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Time range tabs */}
      <div className="flex rounded-lg border border-border overflow-hidden">
        {TIME_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTimeRangeChange(tab.value)}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              timeRange === tab.value
                ? "bg-accent text-white"
                : "bg-surface text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <select
        value={sortField}
        onChange={(e) => onSortChange(e.target.value as SortField)}
        className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>

      {/* Search */}
      <div className="relative flex-1 max-w-xs w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search videos..."
          className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>
    </div>
  );
}
