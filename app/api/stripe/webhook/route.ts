import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    // Webhook signature verification failed
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planName = session.metadata?.planName;

        if (userId && planName) {
          // First, mark any existing subscriptions for this user as inactive
          await supabase
            .from('user_subscriptions')
            .update({ status: 'inactive', updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('status', 'active');

          // Then create/update the new subscription
          const { error } = await supabase
            .from('user_subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              plan_name: planName,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'stripe_subscription_id'
            });

          if (error) {
            // Error updating subscription
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get the plan name from the subscription's price/product
        let planName = null;
        if (subscription.items.data.length > 0) {
          const priceId = subscription.items.data[0].price.id;
          
          // Map price IDs to plan names
          const priceToPlans: { [key: string]: string } = {
            'price_1RwJoKJqCJQV0KJvtvIAiMJp': 'Startup Plan', // Startup Monthly
            'price_1RwJoLJqCJQV0KJvytdq2XPq': 'Startup Plan', // Startup Yearly
            'price_1RwJoMJqCJQV0KJvwV3HyyIu': 'Agency Plan',  // Agency Monthly
            'price_1RwJoMJqCJQV0KJvhEd3P4vk': 'Agency Plan',  // Agency Yearly
          };
          
          planName = priceToPlans[priceId];
        }
        
        // Update subscription status and plan name if available
        const updateData: any = {
          status: subscription.status,
          updated_at: new Date().toISOString(),
        };
        
        if (planName) {
          updateData.plan_name = planName;
        }
        
        const { error } = await supabase
          .from('user_subscriptions')
          .update(updateData)
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          // Error updating subscription
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Mark subscription as canceled
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          // Error canceling subscription
        }
        break;
      }

      default:
        // Unhandled event type
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    // Error processing webhook
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}