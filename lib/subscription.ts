import { supabase } from './supabase'

export interface UserSubscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan_name: string
  status: string
  created_at: string
  updated_at: string
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    // Get the current session to ensure we're authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`)
    }
    
    if (!session || !session.user) {
      return {
        id: 'free-plan',
        user_id: userId,
        stripe_customer_id: null,
        stripe_subscription_id: null,
        plan_name: 'Free',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
    
    // Verify the userId matches the session user
    if (session.user.id !== userId) {
      throw new Error('User ID mismatch')
    }



    // First try to get an active subscription
    let { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // If no active subscription found, get the most recent one
    if (!data && !error) {
      const result = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      data = result.data
      error = result.error
    }

    if (error) {
      // If table doesn't exist or RLS policy issues, return free plan
      if (error.code === 'PGRST116' || error.code === 'PGRST301' || error.message?.includes('406')) {
        return {
          id: 'free-plan',
          user_id: userId,
          stripe_customer_id: null,
          stripe_subscription_id: null,
          plan_name: 'Free',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
      throw error
    }

    // If no subscription found, return free plan
    if (!data) {
      return {
        id: 'free-plan',
        user_id: userId,
        stripe_customer_id: null,
        stripe_subscription_id: null,
        plan_name: 'Free',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
    
    return data
  } catch (error) {
    // For unexpected errors, return free plan as fallback
    return {
      id: 'free-plan',
      user_id: userId,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      plan_name: 'Free',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
}

export function getPlanDisplayName(planName: string | null): string {
  if (!planName) return 'Free Plan'
  
  switch (planName.toLowerCase()) {
    case 'free':
      return 'Free Plan'
    case 'startup plan':
    case 'startup':
      return 'Startup Plan'
    case 'agency plan':
    case 'agency':
      return 'Agency Plan'
    default:
      return planName
  }
}

export function getPlanFeatures(planName: string | null): string[] {
  if (!planName) {
    return [
      'Up to 3 clients',
      'Basic task management',
      'Email support',
      'Basic analytics'
    ]
  }
  
  switch (planName.toLowerCase()) {
    case 'startup plan':
    case 'startup':
      return [
        'Unlimited clients',
        'Priority support',
        'Advanced analytics',
        'Team collaboration',
        'Custom integrations'
      ]
    case 'agency plan':
    case 'agency':
      return [
        'Everything in Startup',
        'White-label solutions',
        'Advanced reporting',
        'Dedicated account manager',
        'Custom development',
        'SLA guarantee'
      ]
    default:
      return ['All features included']
  }
}