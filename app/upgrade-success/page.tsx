'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { LoadingPage } from '@/components/loading-page'

function UpgradeSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, refreshSubscription } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [hasProcessed, setHasProcessed] = useState(false)

  const handleSuccess = useCallback(async () => {
    const sessionId = searchParams.get('session_id')
    const plan = searchParams.get('plan')
    
    if (!sessionId || !plan) {
      router.push('/dashboard')
      return
    }
    
    try {
      // Wait for auth context to initialize if needed
      let attempts = 0
      const maxAttempts = 10 // 5 seconds total
      
      while (!user && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500))
        attempts++
      }
      
      // If still no user after waiting, redirect to signin with return URL
      if (!user) {
        const returnUrl = encodeURIComponent(`/dashboard?show_upgrade_success=true&plan=${encodeURIComponent(plan)}`)
        router.push(`/signin?returnUrl=${returnUrl}&upgrade_success=true`)
        return
      }
      
      // Force refresh subscription data
      await refreshSubscription()
      
      // Store the plan name and redirect to dashboard with popup flag
      localStorage.setItem('recent_upgrade_plan', plan)
      
      // Redirect to dashboard with popup flag
      router.push('/dashboard?show_upgrade_success=true&plan=' + encodeURIComponent(plan))
      
    } catch (error) {
      // Handle error - redirect to signin if user is not authenticated
      if (!user) {
        const returnUrl = encodeURIComponent(`/dashboard?show_upgrade_success=true&plan=${encodeURIComponent(plan || 'Unknown')}`)
        router.push(`/signin?returnUrl=${returnUrl}&upgrade_success=true`)
      } else {
        router.push('/dashboard?show_upgrade_success=true&plan=' + encodeURIComponent(plan || 'Unknown'))
      }
    } finally {
      setIsLoading(false)
    }
  }, [searchParams, router, user, refreshSubscription])

  useEffect(() => {
    if (!hasProcessed) {
      setHasProcessed(true)
      handleSuccess()
    }
  }, [handleSuccess, hasProcessed])

  if (isLoading) {
    return <LoadingPage />
  }

  // This should not render as we redirect to dashboard
  return <LoadingPage />
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <UpgradeSuccessContent />
    </Suspense>
  )
}