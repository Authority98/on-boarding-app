"use client"

import { useEffect, useState } from "react"
import { Loading } from "@/components/ui/loading"
import { cn } from "@/lib/utils"

interface LoadingPageProps {
  title?: string
  subtitle?: string
  variant?: "spinner" | "dots" | "pulse" | "bars"
  showProgress?: boolean
  className?: string
}

export function LoadingPage({ 
  title = "PlankPort",
  subtitle = "Loading your workspace...",
  variant = "spinner",
  showProgress = false,
  className
}: LoadingPageProps) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState(subtitle)

  const loadingSteps = [
    "Initializing workspace...",
    "Loading user data...",
    "Preparing dashboard...",
    "Almost ready..."
  ]

  useEffect(() => {
    if (!showProgress) return

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        
        // Update loading text based on progress
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length)
        if (stepIndex < loadingSteps.length) {
          setLoadingText(loadingSteps[stepIndex])
        }
        
        return newProgress
      })
    }, 200)

    return () => clearInterval(interval)
  }, [showProgress])

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4",
      className
    )}>
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Logo/Brand */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full" />
        </div>

        {/* Loading Animation */}
        <div className="py-8">
          <Loading 
            variant={variant} 
            size="xl" 
            text={showProgress ? loadingText : subtitle}
            className="scale-110"
          />
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-ping" style={{ animationDelay: "0s" }} />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-primary/30 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/25 rounded-full animate-ping" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-primary/20 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
        </div>
      </div>
    </div>
  )
}

// Simplified loading page for quick transitions
export function SimpleLoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading variant="spinner" size="lg" text="Loading..." />
    </div>
  )
}