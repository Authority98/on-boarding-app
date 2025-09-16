-- Add Facebook integration fields to clients table
ALTER TABLE public.clients ADD COLUMN facebook_access_token TEXT;
ALTER TABLE public.clients ADD COLUMN facebook_ad_account_id TEXT;
ALTER TABLE public.clients ADD COLUMN facebook_connected_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.clients ADD COLUMN facebook_token_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.clients ADD COLUMN facebook_page_id TEXT;
ALTER TABLE public.clients ADD COLUMN facebook_business_id TEXT;
ALTER TABLE public.clients ADD COLUMN facebook_connection_status TEXT DEFAULT 'disconnected' CHECK (facebook_connection_status IN ('connected', 'disconnected', 'expired', 'error'));

-- Create table for storing Facebook Ads data
CREATE TABLE public.facebook_ads_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    ad_account_id TEXT NOT NULL,
    campaign_id TEXT,
    campaign_name TEXT,
    adset_id TEXT,
    adset_name TEXT,
    ad_id TEXT,
    ad_name TEXT,
    date_start DATE NOT NULL,
    date_stop DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    spend DECIMAL(10,2) DEFAULT 0,
    reach INTEGER DEFAULT 0,
    frequency DECIMAL(5,2) DEFAULT 0,
    cpm DECIMAL(10,2) DEFAULT 0,
    cpc DECIMAL(10,2) DEFAULT 0,
    ctr DECIMAL(5,4) DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    cost_per_conversion DECIMAL(10,2) DEFAULT 0,
    roas DECIMAL(10,2) DEFAULT 0,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_facebook_ads_data_client_id ON public.facebook_ads_data(client_id);
CREATE INDEX idx_facebook_ads_data_date_range ON public.facebook_ads_data(date_start, date_stop);
CREATE INDEX idx_facebook_ads_data_campaign ON public.facebook_ads_data(campaign_id);
CREATE INDEX idx_clients_facebook_status ON public.clients(facebook_connection_status);

-- Set up RLS policies for facebook_ads_data
ALTER TABLE public.facebook_ads_data ENABLE ROW LEVEL SECURITY;

-- Users can view Facebook ads data for their clients
CREATE POLICY "Users can view Facebook ads data for their clients" ON public.facebook_ads_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = facebook_ads_data.client_id 
            AND clients.user_id = auth.uid()
        )
    );

-- Public can view Facebook ads data via client dashboard
CREATE POLICY "Public can view Facebook ads data via client" ON public.facebook_ads_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = facebook_ads_data.client_id
        )
    );

-- Users can insert Facebook ads data for their clients
CREATE POLICY "Users can insert Facebook ads data for their clients" ON public.facebook_ads_data
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = facebook_ads_data.client_id 
            AND clients.user_id = auth.uid()
        )
    );

-- Users can update Facebook ads data for their clients
CREATE POLICY "Users can update Facebook ads data for their clients" ON public.facebook_ads_data
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = facebook_ads_data.client_id 
            AND clients.user_id = auth.uid()
        )
    );

-- Users can delete Facebook ads data for their clients
CREATE POLICY "Users can delete Facebook ads data for their clients" ON public.facebook_ads_data
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = facebook_ads_data.client_id 
            AND clients.user_id = auth.uid()
        )
    );

-- Create trigger for updated_at
CREATE TRIGGER update_facebook_ads_data_updated_at BEFORE UPDATE ON public.facebook_ads_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create table for Facebook connection logs
CREATE TABLE public.facebook_connection_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('connect', 'disconnect', 'refresh', 'sync', 'error')),
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
    message TEXT,
    error_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS policies for facebook_connection_logs
ALTER TABLE public.facebook_connection_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view Facebook connection logs for their clients" ON public.facebook_connection_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = facebook_connection_logs.client_id 
            AND clients.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert Facebook connection logs for their clients" ON public.facebook_connection_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = facebook_connection_logs.client_id 
            AND clients.user_id = auth.uid()
        )
    );

-- Create index for connection logs
CREATE INDEX idx_facebook_connection_logs_client_id ON public.facebook_connection_logs(client_id);
CREATE INDEX idx_facebook_connection_logs_created_at ON public.facebook_connection_logs(created_at DESC);