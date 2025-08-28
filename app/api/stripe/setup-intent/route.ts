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

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
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

    // Check if customer already exists in Stripe
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

    // Create Setup Intent for saving payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session', // For future payments
      metadata: {
        userId: userId,
      },
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: customerId,
    });

  } catch (error) {
    console.error('Setup Intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create setup intent', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}