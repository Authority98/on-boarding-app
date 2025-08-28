/**
 * Manual Subscription Sync Script
 * 
 * This script manually syncs Stripe subscription data to Supabase when webhooks fail.
 * Run this when a user has completed payment but the subscription isn't showing in the app.
 */

const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function syncMissingSubscription() {
  console.log('🔄 Starting manual subscription sync...');
  
  // Initialize clients
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    // Step 1: Get all recent Stripe subscriptions
    console.log('📊 Fetching recent Stripe subscriptions...');
    const subscriptions = await stripe.subscriptions.list({
      status: 'active',
      limit: 10,
      expand: ['data.customer', 'data.items.data.price']
    });

    console.log(`Found ${subscriptions.data.length} active Stripe subscriptions`);

    // Step 2: Check each subscription against our database
    for (const subscription of subscriptions.data) {
      console.log(`\n🔍 Checking subscription: ${subscription.id}`);
      
      // Get customer email to find user
      const customer = subscription.customer;
      if (typeof customer === 'string') {
        console.log('⚠️ Customer data not expanded, skipping...');
        continue;
      }
      
      const customerEmail = customer.email;
      console.log(`📧 Customer email: ${customerEmail}`);
      
      // Find user by email in Supabase
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) {
        console.log('❌ Error fetching users:', userError.message);
        continue;
      }
      
      const user = userData.users.find(u => u.email === customerEmail);
      if (!user) {
        console.log('⚠️ No user found with this email, skipping...');
        continue;
      }
      
      console.log(`👤 Found user: ${user.id}`);
      
      // Check if subscription exists in our database
      const { data: existingSubscription, error: subError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('stripe_subscription_id', subscription.id)
        .single();
        
      if (subError && subError.code !== 'PGRST116') {
        console.log('❌ Error checking existing subscription:', subError.message);
        continue;
      }
      
      if (existingSubscription) {
        console.log('✅ Subscription already exists in database');
        continue;
      }
      
      // Get plan details from subscription
      const priceId = subscription.items.data[0]?.price?.id;
      console.log(`💰 Price ID: ${priceId}`);
      
      // Map price IDs to plan names and billing periods
      const priceToPlans = {
        'price_1RwJoKJqCJQV0KJvtvIAiMJp': 'Startup Plan', // Startup Monthly
        'price_1RwJoLJqCJQV0KJvytdq2XPq': 'Startup Plan', // Startup Yearly
        'price_1RwJoMJqCJQV0KJvwV3HyyIu': 'Agency Plan',  // Agency Monthly
        'price_1RwJoMJqCJQV0KJvhEd3P4vk': 'Agency Plan',  // Agency Yearly
      };
      
      const priceToBillingPeriod = {
        'price_1RwJoKJqCJQV0KJvtvIAiMJp': 'monthly', // Startup Monthly
        'price_1RwJoLJqCJQV0KJvytdq2XPq': 'annual',  // Startup Yearly
        'price_1RwJoMJqCJQV0KJvwV3HyyIu': 'monthly', // Agency Monthly
        'price_1RwJoMJqCJQV0KJvhEd3P4vk': 'annual',  // Agency Yearly
      };
      
      const planName = priceToPlans[priceId];
      const billingPeriod = priceToBillingPeriod[priceId];
      
      if (!planName) {
        console.log('⚠️ Unknown price ID, skipping...');
        continue;
      }
      
      console.log(`📋 Plan: ${planName} (${billingPeriod})`);
      
      // Step 3: Create subscription record
      console.log('💾 Creating subscription record in database...');
      
      // First, mark any existing subscriptions for this user as inactive
      await supabase
        .from('user_subscriptions')
        .update({ status: 'inactive', updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('status', 'active');
        
      // Then create the new subscription
      const { data: newSubscription, error: insertError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          stripe_customer_id: customer.id,
          stripe_subscription_id: subscription.id,
          plan_name: planName,
          billing_period: billingPeriod,
          status: subscription.status,
          created_at: new Date(subscription.created * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
        
      if (insertError) {
        console.log('❌ Error creating subscription record:', insertError.message);
        continue;
      }
      
      console.log('✅ Successfully synced subscription:', newSubscription.id);
      console.log(`   👤 User: ${user.email}`);
      console.log(`   📋 Plan: ${planName} (${billingPeriod})`);
      console.log(`   🔗 Stripe ID: ${subscription.id}`);
    }
    
    console.log('\n🎉 Manual subscription sync completed!');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run the sync
syncMissingSubscription();