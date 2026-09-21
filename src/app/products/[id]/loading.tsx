export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-3.5 w-12 bg-muted/60 rounded animate-pulse" />
          <div className="h-3.5 w-3 bg-muted/40 rounded animate-pulse" />
          <div className="h-3.5 w-16 bg-muted/60 rounded animate-pulse" />
          <div className="h-3.5 w-3 bg-muted/40 rounded animate-pulse" />
          <div className="h-3.5 w-28 bg-muted/60 rounded animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Image Skeleton */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl bg-muted/40 animate-pulse border border-slate-200 dark:border-slate-800" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-xl bg-muted/50 animate-pulse border border-slate-200 dark:border-slate-800"
                />
              ))}
            </div>
          </div>

          {/* Right Column: Buying Hierarchy Skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="space-y-2">
              <div className="h-3 w-20 bg-muted/60 rounded animate-pulse" />
              <div className="h-8 w-4/5 bg-muted/70 rounded animate-pulse" />
            </div>

            <div className="h-8 w-32 bg-muted/70 rounded animate-pulse pb-4 border-b border-slate-200 dark:border-slate-800" />

            <div className="space-y-2">
              <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-muted/50 rounded animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="h-3 w-16 bg-muted/60 rounded animate-pulse" />
              <div className="flex gap-2.5">
                <div className="h-8 w-24 bg-muted/50 rounded-lg animate-pulse" />
                <div className="h-8 w-28 bg-muted/50 rounded-lg animate-pulse" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <div className="h-12 w-28 bg-muted/50 rounded-xl animate-pulse" />
              <div className="h-12 flex-1 bg-muted/70 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
