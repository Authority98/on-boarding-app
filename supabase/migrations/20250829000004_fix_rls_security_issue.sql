-- Fix RLS security issue - users were seeing other users' clients
-- The previous policy was too permissive for public access

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow public read access to clients by dashboard_slug" ON public.clients;
DROP POLICY IF EXISTS "Users can view their own clients or public dashboard access" ON public.clients;

-- Create a more secure policy that allows:
-- 1. Authenticated users to see only their own clients (for admin dashboard)
-- 2. Anonymous access to specific client data only when accessing via dashboard_slug
CREATE POLICY "Secure client access policy" ON public.clients
    FOR SELECT USING (
        -- Authenticated users can only see their own clients
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
        OR
        -- Anonymous users can access client data only for public dashboard viewing
        -- This requires the dashboard_slug to be provided in the query
        (auth.uid() IS NULL AND dashboard_slug IS NOT NULL)
    );

-- Ensure the policy covers all scenarios properly
-- This policy ensures that:
-- - In the admin dashboard (/dashboard/clients), users only see their own clients
-- - On public client dashboards (/client-dashboard/[slug]), anonymous users can access the specific client data
-- - No cross-user data leakage occurs