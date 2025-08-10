import { Loading } from "@/components/ui/loading"

export default function TemplatesLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded animate-pulse w-56" />
          <div className="h-4 bg-muted rounded animate-pulse w-80" />
        </div>
        <div className="h-10 bg-muted rounded animate-pulse w-36" />
      </div>

      {/* Search Skeleton */}
      <div className="max-w-md">
        <div className="h-10 bg-muted rounded animate-pulse" />
      </div>

      {/* Template Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border rounded-lg p-6 space-y-4">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded animate-pulse w-32" />
                  <div className="h-4 bg-muted rounded animate-pulse w-16" />
                </div>
              </div>
              <div className="h-8 w-8 bg-muted rounded animate-pulse" />
            </div>
            
            {/* Description */}
            <div className="h-4 bg-muted rounded animate-pulse w-full" />
            
            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="h-3 bg-muted rounded animate-pulse w-16" />
              <div className="h-3 bg-muted rounded animate-pulse w-20" />
            </div>
            
            {/* Task Items */}
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-muted rounded-full animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-3 bg-muted rounded animate-pulse w-24" />
                      <div className="h-2 bg-muted rounded animate-pulse w-20" />
                    </div>
                  </div>
                  <div className="h-5 bg-muted rounded animate-pulse w-16" />
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="h-8 bg-muted rounded animate-pulse w-20" />
              <div className="h-3 bg-muted rounded animate-pulse w-24" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Loading indicator */}
      <div className="flex justify-center py-8">
        <Loading variant="dots" size="lg" text="Loading templates..." />
      </div>
    </div>
  )
}
