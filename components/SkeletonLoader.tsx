function Pulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse rounded-lg bg-surface ${className ?? ""}`} style={style} />;
}

export function StatCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <Pulse className="h-4 w-24 mb-3" />
      <Pulse className="h-8 w-32" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-border">
      <Pulse className="w-24 h-14 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Pulse className="h-4 w-3/4" />
        <Pulse className="h-3 w-1/3" />
      </div>
      <Pulse className="h-4 w-16" />
      <Pulse className="h-4 w-16" />
      <Pulse className="h-4 w-16" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <Pulse className="h-5 w-48 mb-6" />
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 10 }).map((_, i) => (
          <Pulse
            key={i}
            className="flex-1"
            style={{ height: `${Math.random() * 80 + 20}%` } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

export default function SkeletonLoader() {
  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Pulse className="h-10 w-32" />
        <Pulse className="h-10 w-32" />
        <Pulse className="h-10 flex-1 max-w-xs" />
      </div>

      {/* Table rows */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
