-- Add user_id column to clients table
ALTER TABLE public.clients ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);

-- Delete existing clients that don't have a user_id (demo data cleanup)
DELETE FROM public.clients WHERE user_id IS NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view all clients" ON public.clients;
DROP POLICY IF EXISTS "Users can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete clients" ON public.clients;

-- Create new RLS policies that filter by user_id
CREATE POLICY "Users can view their own clients" ON public.clients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" ON public.clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" ON public.clients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" ON public.clients
    FOR DELETE USING (auth.uid() = user_id);

-- Make user_id NOT NULL for future inserts
ALTER TABLE public.clients ALTER COLUMN user_id SET NOT NULL;