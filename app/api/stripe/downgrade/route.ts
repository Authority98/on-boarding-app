import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { targetPlan, userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    if (!targetPlan) {
      return NextResponse.json({ error: 'Target plan required' }, { status: 400 })
    }

     // Get current subscription
     const { data: subscription, error: subError } = await supabase
       .from('user_subscriptions')
       .select('*')
       .eq('user_id', userId)
       .eq('status', 'active')
       .single()

    if (subError || !subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    // Cancel current subscription at period end
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true
    })

    // If downgrading to free, just cancel the subscription
    if (targetPlan === 'free') {
      // Update subscription status in database
      await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'canceled',
          plan_name: 'Free',
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription.id)

      return NextResponse.json({ 
        success: true, 
        message: 'Subscription will be canceled at the end of the current billing period' 
      })
    }

    // For downgrading to a paid plan (e.g., Agency to Startup)
    // We'll need to create a new subscription with the target plan
    const priceIds = {
      startup: {
        monthly: 'price_1RwJoKJqCJQV0KJvtvIAiMJp',
        annual: 'price_1RwJoLJqCJQV0KJvytdq2XPq'
      }
    }

    if (targetPlan === 'startup') {
      // Get customer from Stripe
      const customer = await stripe.customers.retrieve(subscription.stripe_customer_id)
      
      if (customer.deleted) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
      }

      // Create new subscription for the downgraded plan
      const newSubscription = await stripe.subscriptions.create({
        customer: subscription.stripe_customer_id,
        items: [{
          price: priceIds.startup.monthly // Default to monthly, can be made configurable
        }],
        metadata: {
           userId: userId,
           planName: 'Startup Plan'
         }
      })

      // Update database with new subscription
      await supabase
        .from('user_subscriptions')
        .update({
          stripe_subscription_id: newSubscription.id,
          plan_name: 'Startup Plan',
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription.id)

      return NextResponse.json({ 
        success: true, 
        message: 'Successfully downgraded to Startup Plan' 
      })
    }

    return NextResponse.json({ error: 'Invalid target plan' }, { status: 400 })

  } catch (error) {
    // Handle downgrade error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}