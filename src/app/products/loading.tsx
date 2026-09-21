import { SkeletonCard } from "@/components/products/skeleton-card"

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filter bar placeholder */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1.5">
              <div className="h-7 w-48 bg-muted/60 rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted/40 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 bg-muted/50 rounded-lg animate-pulse" />
              <div className="h-8 w-28 bg-muted/50 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-7 w-20 bg-muted/50 rounded-full animate-pulse shrink-0" />
            ))}
          </div>
        </div>

        {/* Responsive Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}
