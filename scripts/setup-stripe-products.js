const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createStripeProducts() {
  try {
    console.log('Creating Stripe products and prices...');

    // Create Startup Plan Product
    const startupProduct = await stripe.products.create({
      name: 'Startup Plan',
      description: 'Perfect for growing businesses',
    });

    // Create Startup Plan Prices
    const startupMonthlyPrice = await stripe.prices.create({
      product: startupProduct.id,
      unit_amount: 2900, // $29.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    const startupYearlyPrice = await stripe.prices.create({
      product: startupProduct.id,
      unit_amount: 29000, // $290.00 (save $58/year)
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
    });

    // Create Agency Plan Product
    const agencyProduct = await stripe.products.create({
      name: 'Agency Plan',
      description: 'For agencies and large teams',
    });

    // Create Agency Plan Prices
    const agencyMonthlyPrice = await stripe.prices.create({
      product: agencyProduct.id,
      unit_amount: 29900, // $299.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    const agencyYearlyPrice = await stripe.prices.create({
      product: agencyProduct.id,
      unit_amount: 299000, // $2990.00 (save $598/year)
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
    });

    console.log('\n✅ Products and prices created successfully!');
    console.log('\n📋 Price IDs to use in your application:');
    console.log(`Startup Monthly: ${startupMonthlyPrice.id}`);
    console.log(`Startup Yearly: ${startupYearlyPrice.id}`);
    console.log(`Agency Monthly: ${agencyMonthlyPrice.id}`);
    console.log(`Agency Yearly: ${agencyYearlyPrice.id}`);
    
    console.log('\n🔧 Update your pricing-plans.tsx with these price IDs:');
    console.log(`Startup Plan priceId: '${startupMonthlyPrice.id}' (monthly) or '${startupYearlyPrice.id}' (yearly)`);
    console.log(`Agency Plan priceId: '${agencyMonthlyPrice.id}' (monthly) or '${agencyYearlyPrice.id}' (yearly)`);

  } catch (error) {
    console.error('❌ Error creating Stripe products:', error.message);
    process.exit(1);
  }
}

createStripeProducts();