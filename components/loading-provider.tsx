"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { usePathname } from "next/navigation"
import { LoadingOverlay } from "@/components/ui/loading"
import { LoadingPage } from "@/components/loading-page"

interface LoadingContextType {
  isLoading: boolean
  setLoading: (loading: boolean) => void
  showPageLoading: (text?: string) => void
  hidePageLoading: () => void
  showOverlay: (text?: string) => void
  hideOverlay: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}

interface LoadingProviderProps {
  children: ReactNode
  enableRouteLoading?: boolean
}

export function LoadingProvider({ 
  children, 
  enableRouteLoading = true 
}: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPageLoader, setShowPageLoader] = useState(false)
  const [showOverlayLoader, setShowOverlayLoader] = useState(false)
  const [loadingText, setLoadingText] = useState("Loading...")
  const [overlayText, setOverlayText] = useState("Loading...")
  const [routeLoading, setRouteLoading] = useState(false)
  
  const pathname = usePathname()

  // Handle route changes
  useEffect(() => {
    if (!enableRouteLoading) return

    setRouteLoading(true)
    const timer = setTimeout(() => {
      setRouteLoading(false)
    }, 300) // Short delay to show loading for quick transitions

    return () => clearTimeout(timer)
  }, [pathname, enableRouteLoading])

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const showPageLoading = (text = "Loading...") => {
    setLoadingText(text)
    setShowPageLoader(true)
  }

  const hidePageLoading = () => {
    setShowPageLoader(false)
  }

  const showOverlay = (text = "Loading...") => {
    setOverlayText(text)
    setShowOverlayLoader(true)
  }

  const hideOverlay = () => {
    setShowOverlayLoader(false)
  }

  const contextValue: LoadingContextType = {
    isLoading,
    setLoading,
    showPageLoading,
    hidePageLoading,
    showOverlay,
    hideOverlay
  }

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      
      {/* Route Loading */}
      {routeLoading && (
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading page...</p>
          </div>
        </div>
      )}
      
      {/* Page Loading */}
      {showPageLoader && (
        <div className="fixed inset-0 z-50">
          <LoadingPage 
            subtitle={loadingText}
            variant="dots"
            showProgress={true}
          />
        </div>
      )}
      
      {/* Overlay Loading */}
      {showOverlayLoader && (
        <LoadingOverlay text={overlayText} variant="spinner" size="lg" />
      )}
    </LoadingContext.Provider>
  )
}

// Hook for easy loading management in components
export function useLoadingState() {
  const { setLoading, showOverlay, hideOverlay } = useLoading()
  
  const withLoading = async <T,>(asyncFn: () => Promise<T>, text?: string): Promise<T> => {
    try {
      showOverlay(text)
      const result = await asyncFn()
      return result
    } finally {
      hideOverlay()
    }
  }

  return {
    setLoading,
    showOverlay,
    hideOverlay,
    withLoading
  }
}