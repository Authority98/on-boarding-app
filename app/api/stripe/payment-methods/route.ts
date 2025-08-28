import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
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

    const stripe = getStripe();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

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

    // Find Stripe customer by email
    const existingCustomers = await stripe.customers.list({
      email: user.user.email,
      limit: 1,
    });

    if (existingCustomers.data.length === 0) {
      return NextResponse.json({ paymentMethods: [] });
    }

    const customerId = existingCustomers.data[0].id;

    // Get payment methods for the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    // Format payment methods for frontend
    const formattedPaymentMethods = paymentMethods.data.map(pm => ({
      id: pm.id,
      brand: pm.card?.brand,
      last4: pm.card?.last4,
      expMonth: pm.card?.exp_month,
      expYear: pm.card?.exp_year,
      funding: pm.card?.funding,
      created: pm.created,
    }));

    return NextResponse.json({ 
      paymentMethods: formattedPaymentMethods,
      customerId: customerId 
    });

  } catch (error) {
    console.error('Payment methods retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment methods', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const stripe = getStripe();
    const { paymentMethodId } = await request.json();

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    // Detach payment method from customer
    await stripe.paymentMethods.detach(paymentMethodId);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Payment method deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment method', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}