import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-card overflow-hidden shadow-2xs">
      {/* 1. Image Placeholder */}
      <div className="relative aspect-square w-full bg-muted/40 animate-pulse border-b border-slate-200/80 dark:border-slate-800/80" />

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        {/* 2. Category & Title */}
        <div className="space-y-1.5">
          <div className="h-3 w-16 bg-muted/60 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-muted/70 rounded animate-pulse" />
        </div>

        {/* 3. Price & Button */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-2.5">
          <div className="h-5 w-20 bg-muted/70 rounded animate-pulse" />
          <div className="h-9 w-full bg-muted/50 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}
