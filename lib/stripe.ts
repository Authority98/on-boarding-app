import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Initialize Stripe.js with the publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Initialize Stripe for server-side operations
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export { stripe, stripePromise };

// Stripe configuration constants
export const STRIPE_CONFIG = {
  currency: 'usd',
  payment_method_types: ['card'],
  mode: 'subscription' as const,
};

// Price IDs for different plans (these would be set up in Stripe Dashboard)
export const PRICE_IDS = {
  starter: 'price_starter', // Replace with actual price ID from Stripe
  professional: 'price_professional', // Replace with actual price ID from Stripe
  enterprise: 'price_enterprise', // Replace with actual price ID from Stripe
};