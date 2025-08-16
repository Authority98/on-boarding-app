-- Add billing_period column to user_subscriptions table
ALTER TABLE user_subscriptions 
ADD COLUMN billing_period VARCHAR(10) DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'annual'));

-- Update existing records to have monthly billing period (default assumption)
UPDATE user_subscriptions 
SET billing_period = 'monthly' 
WHERE billing_period IS NULL;

-- Make billing_period NOT NULL after setting defaults
ALTER TABLE user_subscriptions 
ALTER COLUMN billing_period SET NOT NULL;