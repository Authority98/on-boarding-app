import { cn } from "@/lib/utils"

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "spinner" | "dots" | "pulse" | "bars"
  className?: string
  text?: string
}

export function Loading({ 
  size = "md", 
  variant = "spinner", 
  className,
  text 
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <div className={cn(
          "animate-spin rounded-full border-2 border-muted border-t-primary",
          sizeClasses[size]
        )} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    )
  }

  if (variant === "dots") {
    const dotSize = {
      sm: "w-1.5 h-1.5",
      md: "w-2 h-2",
      lg: "w-2.5 h-2.5",
      xl: "w-3 h-3"
    }

    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <div className="flex space-x-1">
          <div className={cn(
            "bg-primary rounded-full animate-bounce",
            dotSize[size]
          )} style={{ animationDelay: "0ms" }} />
          <div className={cn(
            "bg-primary rounded-full animate-bounce",
            dotSize[size]
          )} style={{ animationDelay: "150ms" }} />
          <div className={cn(
            "bg-primary rounded-full animate-bounce",
            dotSize[size]
          )} style={{ animationDelay: "300ms" }} />
        </div>
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <div className={cn(
          "bg-primary rounded-full animate-pulse",
          sizeClasses[size]
        )} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    )
  }

  if (variant === "bars") {
    const barHeight = {
      sm: "h-3",
      md: "h-4",
      lg: "h-5",
      xl: "h-6"
    }

    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <div className="flex items-end space-x-1">
          <div className={cn(
            "w-1 bg-primary animate-pulse",
            barHeight[size]
          )} style={{ animationDelay: "0ms", animationDuration: "1s" }} />
          <div className={cn(
            "w-1 bg-primary animate-pulse",
            barHeight[size]
          )} style={{ animationDelay: "200ms", animationDuration: "1s" }} />
          <div className={cn(
            "w-1 bg-primary animate-pulse",
            barHeight[size]
          )} style={{ animationDelay: "400ms", animationDuration: "1s" }} />
          <div className={cn(
            "w-1 bg-primary animate-pulse",
            barHeight[size]
          )} style={{ animationDelay: "600ms", animationDuration: "1s" }} />
        </div>
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    )
  }

  return null
}

// Full page loading overlay
export function LoadingOverlay({ 
  text = "Loading...", 
  variant = "spinner",
  size = "lg"
}: Omit<LoadingProps, "className">) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border rounded-lg p-8 shadow-lg">
        <Loading variant={variant} size={size} text={text} />
      </div>
    </div>
  )
}

// Inline loading for buttons
export function ButtonLoading({ size = "sm" }: { size?: "sm" | "md" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5"
  }

  return (
    <div className={cn(
      "animate-spin rounded-full border-2 border-current border-t-transparent",
      sizeClasses[size]
    )} />
  )
}

// Page loading skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-32 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}