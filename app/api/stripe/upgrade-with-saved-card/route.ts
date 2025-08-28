import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const stripe = getStripe();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { priceId, userId, planName, paymentMethodId } = await request.json();

    if (!priceId || !userId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get user data from Supabase
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find or create Stripe customer
    const existingCustomers = await stripe.customers.list({
      email: user.user.email,
      limit: 1,
    });

    let customerId: string;

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.user.email,
        name: user.user.user_metadata?.full_name || user.user.email,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;
    }

    // Verify that the payment method belongs to this customer
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    if (paymentMethod.customer !== customerId) {
      return NextResponse.json(
        { error: 'Payment method does not belong to this customer' },
        { status: 403 }
      );
    }

    // Check if customer already has an active subscription
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    let subscription;

    if (existingSubscriptions.data.length > 0) {
      // Update existing subscription
      const existingSubscription = existingSubscriptions.data[0];
      
      subscription = await stripe.subscriptions.update(existingSubscription.id, {
        items: [{
          id: existingSubscription.items.data[0].id,
          price: priceId,
        }],
        default_payment_method: paymentMethodId,
        proration_behavior: 'create_prorations',
        metadata: {
          userId,
          planName,
        },
      });
    } else {
      // Create new subscription
      subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        default_payment_method: paymentMethodId,
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId,
          planName,
        },
      });
    }

    // Check if payment requires confirmation (3D Secure, etc.)
    const latestInvoice = subscription.latest_invoice as any;
    const paymentIntent = latestInvoice?.payment_intent;

    if (paymentIntent?.status === 'requires_action') {
      return NextResponse.json({
        subscription: subscription,
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
      });
    }

    if (paymentIntent?.status === 'succeeded' || subscription.status === 'active') {
      // Update subscription in Supabase
      const billingPeriod = priceId.includes('annual') ? 'annual' : 'monthly';
      
      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: customerId,
          plan_name: planName.toLowerCase().replace(' plan', ''),
          billing_period: billingPeriod,
          status: subscription.status,
          current_period_start: new Date((subscription as any).current_period_start * 1000),
          current_period_end: new Date((subscription as any).current_period_end * 1000),
        });

      return NextResponse.json({
        subscription: subscription,
        success: true,
      });
    }

    return NextResponse.json(
      { error: 'Payment failed or requires additional action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Upgrade with saved payment method error:', error);
    return NextResponse.json(
      { error: 'Failed to process upgrade', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}