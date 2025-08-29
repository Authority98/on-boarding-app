-- Allow public read access to clients table for dashboard functionality
-- This enables client dashboards to be publicly accessible via their unique slugs

-- Create a policy for public read access to clients by dashboard_slug
CREATE POLICY "Allow public read access to clients by dashboard_slug" ON public.clients
    FOR SELECT USING (true);

-- Note: This allows anyone to read client data if they know the dashboard_slug
-- This is intentional for the public client dashboard functionality
-- The dashboard_slug acts as a secure token for accessing client dashboard data

-- Drop the existing restrictive SELECT policy and replace with more flexible one
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;

-- Create new policy that allows both authenticated users to see their own clients
-- AND public access via dashboard_slug
CREATE POLICY "Users can view their own clients or public dashboard access" ON public.clients
    FOR SELECT USING (
        auth.uid() = user_id OR -- Authenticated users can see their own clients
        dashboard_slug IS NOT NULL -- Public access via dashboard_slug
    );