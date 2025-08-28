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
    
    // Environment-specific debugging for Netlify vs localhost
    const isNetlify = typeof window !== 'undefined' && window.location.hostname.includes('netlify')
    const debugPrefix = isNetlify ? '🌐 NETLIFY' : '🏠 LOCALHOST'
    
    console.log(`${debugPrefix} Upgrade Success Debug:`, {
      sessionId,
      plan,
      user: user ? { id: user.id, email: user.email } : null,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
      timestamp: new Date().toISOString()
    })
    
    if (!sessionId || !plan) {
      console.log(`${debugPrefix} Missing sessionId or plan, redirecting to dashboard`)
      router.push('/dashboard')
      return
    }
    
    // Handle saved card upgrades (no real Stripe session)
    if (sessionId === 'saved_card_upgrade') {
      console.log(`${debugPrefix} Processing saved card upgrade success`)
      
      // For saved card upgrades, we already have the user session
      if (user) {
        console.log(`${debugPrefix} User authenticated, proceeding to dashboard`)
        
        // Force refresh subscription data
        await refreshSubscription()
        
        // Store the plan name and redirect to dashboard with popup flag
        localStorage.setItem('recent_upgrade_plan', plan)
        
        router.push('/dashboard?show_upgrade_success=true&plan=' + encodeURIComponent(plan))
        return
      } else {
        console.log(`${debugPrefix} No user for saved card upgrade, waiting for auth...`)
        // Wait a bit for auth context to initialize
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (user) {
          await refreshSubscription()
          localStorage.setItem('recent_upgrade_plan', plan)
          router.push('/dashboard?show_upgrade_success=true&plan=' + encodeURIComponent(plan))
          return
        } else {
          // Fallback to signin if no user
          const returnUrl = encodeURIComponent(`/dashboard?show_upgrade_success=true&plan=${encodeURIComponent(plan)}`)
          router.push(`/signin?returnUrl=${returnUrl}&upgrade_success=true`)
          return
        }
      }
    }
    
    try {
      // Enhanced session restoration for Netlify compatibility
      console.log(`${debugPrefix} Attempting enhanced session restoration...`)
      
      // Try multiple session restoration methods
      let session = null
      
      // Method 1: Direct session check
      const { data: { session: immediateSession } } = await supabase.auth.getSession()
      session = immediateSession
      
      console.log(`${debugPrefix} Method 1 - Direct session check:`, {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        sessionExpiry: session?.expires_at
      })
      
      // Method 2: If no session, try refreshing from storage
      if (!session && isNetlify) {
        console.log(`${debugPrefix} Method 2 - Attempting storage-based refresh...`)
        try {
          const { data: { session: refreshedSession } } = await supabase.auth.refreshSession()
          session = refreshedSession
          console.log(`${debugPrefix} Storage refresh result:`, {
            hasSession: !!session,
            userId: session?.user?.id
          })
        } catch (refreshError) {
          console.log(`${debugPrefix} Storage refresh failed:`, refreshError)
        }
      }
      
      // Method 3: Check for session in URL fragments (Netlify specific)
      if (!session && isNetlify && typeof window !== 'undefined') {
        console.log(`${debugPrefix} Method 3 - Checking URL fragments...`)
        const urlParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = urlParams.get('access_token')
        const refreshToken = urlParams.get('refresh_token')
        
        if (accessToken && refreshToken) {
          console.log(`${debugPrefix} Found tokens in URL, attempting to set session...`)
          try {
            const { data: { session: urlSession } } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            session = urlSession
            console.log(`${debugPrefix} URL session restoration:`, {
              hasSession: !!session,
              userId: session?.user?.id
            })
          } catch (urlError) {
            console.log(`${debugPrefix} URL session restoration failed:`, urlError)
          }
        }
      }
      
      if (session?.user) {
        console.log(`${debugPrefix} Session restored successfully, proceeding to dashboard`)
        
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
      console.log(`${debugPrefix} Waiting for user authentication...`)
      while (!user && attempts < maxAttempts) {
        console.log(`${debugPrefix} Attempt ${attempts + 1}/${maxAttempts} - No user yet`)
        
        // Force a session refresh attempt every 5 attempts
        if (attempts % 5 === 0 && attempts > 0) {
          console.log(`${debugPrefix} Forcing session refresh...`)
          try {
            const { data: { session } } = await supabase.auth.getSession()
            console.log(`${debugPrefix} Forced session check result:`, {
              hasSession: !!session,
              userId: session?.user?.id,
              sessionExpiry: session?.expires_at
            })
            
            // If we found a session during forced check, break the loop
            if (session?.user) {
              console.log(`${debugPrefix} Session found during forced check!`)
              break
            }
          } catch (error) {
            console.log(`${debugPrefix} Error during forced session check:`, error)
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 500))
        attempts++
      }
      
      // Check one more time if we have a user (either from context or forced refresh)
      const finalUser = user || (await supabase.auth.getSession()).data.session?.user
      
      if (!finalUser) {
        console.log(`${debugPrefix} No user found after waiting, redirecting to signin`)
        const returnUrl = encodeURIComponent(`/dashboard?show_upgrade_success=true&plan=${encodeURIComponent(plan)}`)
        router.push(`/signin?returnUrl=${returnUrl}&upgrade_success=true`)
        return
      }
      
      console.log(`${debugPrefix} User found, refreshing subscription...`)
      // Force refresh subscription data
      await refreshSubscription()
      
      // Store the plan name and redirect to dashboard with popup flag
      localStorage.setItem('recent_upgrade_plan', plan)
      
      console.log(`${debugPrefix} Redirecting to dashboard with success popup`)
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