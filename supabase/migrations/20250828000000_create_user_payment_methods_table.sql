-- Migration: Add payment methods tracking table
-- This table stores metadata about payment methods for analytics and user management
-- The actual payment method data is stored securely in Stripe

CREATE TABLE IF NOT EXISTS user_payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL,
    stripe_payment_method_id TEXT NOT NULL,
    payment_method_type TEXT NOT NULL DEFAULT 'card',
    card_brand TEXT,
    card_last4 TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own payment methods
CREATE POLICY "Users can view their own payment methods" ON user_payment_methods
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own payment methods
CREATE POLICY "Users can insert their own payment methods" ON user_payment_methods
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own payment methods
CREATE POLICY "Users can update their own payment methods" ON user_payment_methods
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own payment methods
CREATE POLICY "Users can delete their own payment methods" ON user_payment_methods
    FOR DELETE USING (auth.uid() = user_id);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_user_id ON user_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_stripe_customer ON user_payment_methods(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_stripe_pm ON user_payment_methods(stripe_payment_method_id);

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_payment_methods_updated_at
    BEFORE UPDATE ON user_payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();