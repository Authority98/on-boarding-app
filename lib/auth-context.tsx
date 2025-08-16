"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { getUserSubscription, UserSubscription } from './subscription'

interface AuthContextType {
  user: User | null
  session: Session | null
  subscription: UserSubscription | null
  loading: boolean
  subscriptionLoading: boolean
  refreshSubscription: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscriptionLoading, setSubscriptionLoading] = useState(false)

  const refreshSubscription = async () => {
    setSubscriptionLoading(true)
    try {
      // Get current session to ensure we have the latest user data
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        setSubscription(null)
        return
      }
      
      const userSubscription = await getUserSubscription(session.user.id)
      setSubscription(userSubscription)
    } catch (error) {
      setSubscription(null)
    } finally {
      setSubscriptionLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    
    const initializeAuth = async () => {
      // Add a small delay to ensure any URL-based session detection completes
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    }
    
    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      authSubscription.unsubscribe()
    }
  }, [])

  // Load subscription when user changes
  useEffect(() => {
    if (user && !loading) {
      refreshSubscription()
    } else if (!user) {
      setSubscription(null)
    }
  }, [user, loading])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const value = {
    user,
    session,
    subscription,
    loading,
    subscriptionLoading,
    refreshSubscription,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}