'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
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
    
    // Debug logging removed - session restoration working
    
    if (!sessionId || !plan) {
      // Missing required parameters, redirect to dashboard
      router.push('/dashboard')
      return
    }
    
    try {
      // First, try to restore session from storage immediately
      const { data: { session: immediateSession } } = await supabase.auth.getSession()
      
      if (immediateSession?.user) {
        // Force refresh subscription data
        await refreshSubscription()
        
        // Store the plan name and redirect to dashboard with popup flag
        localStorage.setItem('recent_upgrade_plan', plan)
        
        router.push('/dashboard?show_upgrade_success=true&plan=' + encodeURIComponent(plan))
        return
      }
      
      // If no immediate session, wait for auth context to initialize
      let attempts = 0
      const maxAttempts = 20 // 10 seconds total
      
      // Wait for auth context to initialize if needed
      while (!user && attempts < maxAttempts) {
        // Force a session refresh attempt every 5 attempts
        if (attempts % 5 === 0 && attempts > 0) {
          try {
            const { data: { session } } = await supabase.auth.getSession()
            
            // If we found a session during forced check, break the loop
            if (session?.user) {
              break
            }
          } catch (error) {
            // Session check failed, continue waiting
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 500))
        attempts++
      }
      
      // Check one more time if we have a user (either from context or forced refresh)
      const finalUser = user || (await supabase.auth.getSession()).data.session?.user
      
      if (!finalUser) {
        // No user found after waiting, redirect to signin with return URL
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