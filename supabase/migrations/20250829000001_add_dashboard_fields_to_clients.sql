-- Add dashboard mode and slug fields to clients table
ALTER TABLE public.clients ADD COLUMN view_mode VARCHAR(20) DEFAULT 'dashboard' CHECK (view_mode IN ('dashboard', 'task', 'hybrid'));
ALTER TABLE public.clients ADD COLUMN dashboard_slug VARCHAR(100) UNIQUE;

-- Create index on dashboard_slug for better performance on client dashboard lookups
CREATE INDEX IF NOT EXISTS idx_clients_dashboard_slug ON public.clients(dashboard_slug);

-- Function to generate a unique dashboard slug
CREATE OR REPLACE FUNCTION generate_dashboard_slug(client_name TEXT, client_id UUID)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
    existing_count INTEGER;
BEGIN
    -- Create base slug from client name
    base_slug := lower(trim(regexp_replace(client_name, '[^a-zA-Z0-9\s]', '', 'g')));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := trim(base_slug, '-');
    
    -- If empty, use 'client'
    IF base_slug = '' THEN
        base_slug := 'client';
    END IF;
    
    -- Check if base slug exists
    SELECT COUNT(*) INTO existing_count 
    FROM public.clients 
    WHERE dashboard_slug = base_slug AND id != client_id;
    
    IF existing_count = 0 THEN
        RETURN base_slug;
    END IF;
    
    -- Find next available slug with counter
    LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
        
        SELECT COUNT(*) INTO existing_count 
        FROM public.clients 
        WHERE dashboard_slug = final_slug AND id != client_id;
        
        IF existing_count = 0 THEN
            RETURN final_slug;
        END IF;
        
        -- Safety break to prevent infinite loop
        IF counter > 1000 THEN
            RETURN base_slug || '-' || extract(epoch from now())::text;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate slugs for existing clients
UPDATE public.clients 
SET dashboard_slug = generate_dashboard_slug(name, id)
WHERE dashboard_slug IS NULL;

-- Make dashboard_slug NOT NULL for future inserts
ALTER TABLE public.clients ALTER COLUMN dashboard_slug SET NOT NULL;

-- Create trigger to auto-generate dashboard slug on insert
CREATE OR REPLACE FUNCTION set_dashboard_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.dashboard_slug IS NULL OR NEW.dashboard_slug = '' THEN
        NEW.dashboard_slug := generate_dashboard_slug(NEW.name, NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_set_dashboard_slug
    BEFORE INSERT OR UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION set_dashboard_slug();

-- Update RLS policies to include new fields
-- The existing policies already cover SELECT/INSERT/UPDATE/DELETE properly
-- No additional policies needed as the new fields are part of the same table