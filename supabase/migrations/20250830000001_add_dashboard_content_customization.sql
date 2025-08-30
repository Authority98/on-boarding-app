-- Add comprehensive dashboard content customization to clients table
ALTER TABLE public.clients ADD COLUMN dashboard_config JSONB DEFAULT '{}';

-- Create dashboard_templates table for reusable templates
CREATE TABLE public.dashboard_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    config JSONB NOT NULL DEFAULT '{}',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dashboard_content table for client-specific content
CREATE TABLE public.dashboard_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'welcome_message', 'kpi', 'task', 'announcement', 'media'
    content_key VARCHAR(100) NOT NULL, -- unique identifier for the content piece
    content_data JSONB NOT NULL DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, content_key)
);

-- Create dashboard_assets table for file uploads
CREATE TABLE public.dashboard_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    asset_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'document', 'logo'
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    alt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dashboard_templates_user_id ON public.dashboard_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_content_client_id ON public.dashboard_content(client_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_content_type ON public.dashboard_content(content_type);
CREATE INDEX IF NOT EXISTS idx_dashboard_assets_client_id ON public.dashboard_assets(client_id);

-- Set up RLS policies for dashboard_templates
ALTER TABLE public.dashboard_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own dashboard templates" ON public.dashboard_templates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dashboard templates" ON public.dashboard_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard templates" ON public.dashboard_templates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dashboard templates" ON public.dashboard_templates
    FOR DELETE USING (auth.uid() = user_id);

-- Set up RLS policies for dashboard_content
ALTER TABLE public.dashboard_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view dashboard content for their clients" ON public.dashboard_content
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = dashboard_content.client_id 
            AND clients.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can view dashboard content via client slug" ON public.dashboard_content
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = dashboard_content.client_id
        )
    );

CREATE POLICY "Users can insert dashboard content for their clients" ON public.dashboard_content
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = dashboard_content.client_id 
            AND clients.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update dashboard content for their clients" ON public.dashboard_content
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = dashboard_content.client_id 
            AND clients.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete dashboard content for their clients" ON public.dashboard_content
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = dashboard_content.client_id 
            AND clients.user_id = auth.uid()
        )
    );

-- Set up RLS policies for dashboard_assets
ALTER TABLE public.dashboard_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view dashboard assets for their clients" ON public.dashboard_assets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = dashboard_assets.client_id 
            AND clients.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can view dashboard assets via client" ON public.dashboard_assets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = dashboard_assets.client_id
        )
    );

CREATE POLICY "Users can insert dashboard assets for their clients" ON public.dashboard_assets
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = dashboard_assets.client_id 
            AND clients.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update dashboard assets for their clients" ON public.dashboard_assets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = dashboard_assets.client_id 
            AND clients.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete dashboard assets for their clients" ON public.dashboard_assets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE clients.id = dashboard_assets.client_id 
            AND clients.user_id = auth.uid()
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_dashboard_templates_updated_at BEFORE UPDATE ON public.dashboard_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_content_updated_at BEFORE UPDATE ON public.dashboard_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_assets_updated_at BEFORE UPDATE ON public.dashboard_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update clients table to have a default dashboard config
UPDATE public.clients 
SET dashboard_config = '{
    "theme": {
        "primaryColor": "#3b82f6",
        "secondaryColor": "#64748b",
        "backgroundColor": "#ffffff"
    },
    "branding": {
        "showLogo": false,
        "showCompanyName": true,
        "customWelcomeMessage": ""
    },
    "layout": {
        "enableKPIs": true,
        "enableCharts": true,
        "enableTasks": true,
        "enableActivity": true
    },
    "kpis": [
        {"id": "progress", "title": "Project Progress", "value": "78%", "type": "percentage"},
        {"id": "tasks", "title": "Tasks Completed", "value": "42", "type": "number"},
        {"id": "revenue", "title": "Revenue Generated", "value": "$24,500", "type": "currency"},
        {"id": "engagement", "title": "Team Engagement", "value": "94%", "type": "percentage"}
    ]
}'::jsonb
WHERE dashboard_config = '{}' OR dashboard_config IS NULL;