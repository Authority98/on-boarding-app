"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import { Loading, LoadingOverlay, ButtonLoading, PageLoadingSkeleton } from "@/components/ui/loading"
import { LoadingPage, SimpleLoadingPage } from "@/components/loading-page"
import { useLoading, useLoadingState } from "@/components/loading-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Loader2, Sparkles } from "lucide-react"

export default function LoadingDemoPage() {
  const [buttonLoading, setButtonLoading] = useState(false)
  const [showPageLoading, setShowPageLoading] = useState(false)
  const { showOverlay, hideOverlay, showPageLoading: showFullPageLoading, hidePageLoading } = useLoading()
  const { withLoading } = useLoadingState()

  const simulateAsyncAction = async () => {
    setButtonLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setButtonLoading(false)
  }

  const showOverlayDemo = () => {
    showOverlay("Processing your request...")
    setTimeout(() => {
      hideOverlay()
    }, 3000)
  }

  const showPageLoadingDemo = () => {
    showFullPageLoading("Loading workspace...")
    setTimeout(() => {
      hidePageLoading()
    }, 4000)
  }

  const withLoadingDemo = async () => {
    await withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 2500))
    }, "Saving changes...")
  }

  if (showPageLoading) {
    return <LoadingPage title="PlankPort" subtitle="Demonstrating page loading..." variant="dots" showProgress={true} />
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Loading Animations Demo
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore the beautiful loading animations available in PlankPort
        </p>
      </div>

      {/* Loading Variants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Loading Spinner Variants
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <h3 className="font-medium">Spinner</h3>
              <Loading variant="spinner" size="lg" text="Loading..." />
            </div>
            <div className="text-center space-y-3">
              <h3 className="font-medium">Dots</h3>
              <Loading variant="dots" size="lg" text="Processing..." />
            </div>
            <div className="text-center space-y-3">
              <h3 className="font-medium">Pulse</h3>
              <Loading variant="pulse" size="lg" text="Syncing..." />
            </div>
            <div className="text-center space-y-3">
              <h3 className="font-medium">Bars</h3>
              <Loading variant="bars" size="lg" text="Analyzing..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Interactive Loading Buttons
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <LoadingButton 
              loading={buttonLoading} 
              onClick={simulateAsyncAction}
              loadingText="Processing..."
              icon={<Loader2 className="w-4 h-4" />}
            >
              Simulate Action
            </LoadingButton>
            
            <LoadingButton 
              variant="outline" 
              size="sm"
              loading={buttonLoading}
              onClick={simulateAsyncAction}
            >
              Small Button
            </LoadingButton>
            
            <LoadingButton 
              variant="destructive" 
              loading={buttonLoading}
              onClick={simulateAsyncAction}
              loadingText="Deleting..."
            >
              Delete Item
            </LoadingButton>
          </div>
        </CardContent>
      </Card>

      {/* Full Page Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Full Page Loading States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setShowPageLoading(true)}>
              Show Loading Page
            </Button>
            <Button variant="outline" onClick={showOverlayDemo}>
              Show Overlay Loading
            </Button>
            <Button variant="secondary" onClick={showPageLoadingDemo}>
              Show Page Loading Provider
            </Button>
            <Button variant="ghost" onClick={withLoadingDemo}>
              With Loading Hook
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Skeleton Loading Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded animate-pulse w-4/5" />
                    <div className="h-3 bg-muted rounded animate-pulse w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back to Dashboard */}
      <div className="text-center">
        <Button asChild variant="outline">
          <a href="/dashboard">Back to Dashboard</a>
        </Button>
      </div>
    </div>
  )
}