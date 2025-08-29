-- Fix dashboard slug generation for existing clients
-- This script addresses potential issues with the trigger function

-- First, let's make sure existing clients have slugs
DO $$
DECLARE
    client_record RECORD;
    new_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Loop through clients that don't have dashboard_slug
    FOR client_record IN 
        SELECT id, name 
        FROM public.clients 
        WHERE dashboard_slug IS NULL OR dashboard_slug = ''
    LOOP
        -- Generate base slug
        new_slug := lower(trim(regexp_replace(client_record.name, '[^a-zA-Z0-9\s]', '', 'g')));
        new_slug := regexp_replace(new_slug, '\s+', '-', 'g');
        new_slug := trim(new_slug, '-');
        
        -- If empty, use 'client'
        IF new_slug = '' THEN
            new_slug := 'client';
        END IF;
        
        -- Find unique slug
        counter := 0;
        WHILE EXISTS (SELECT 1 FROM public.clients WHERE dashboard_slug = new_slug AND id != client_record.id) LOOP
            counter := counter + 1;
            new_slug := lower(trim(regexp_replace(client_record.name, '[^a-zA-Z0-9\s]', '', 'g')));
            new_slug := regexp_replace(new_slug, '\s+', '-', 'g');
            new_slug := trim(new_slug, '-');
            IF new_slug = '' THEN
                new_slug := 'client';
            END IF;
            new_slug := new_slug || '-' || counter;
        END LOOP;
        
        -- Update the client with the unique slug
        UPDATE public.clients 
        SET dashboard_slug = new_slug 
        WHERE id = client_record.id;
        
        RAISE NOTICE 'Updated client % with slug: %', client_record.name, new_slug;
    END LOOP;
END $$;

-- Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION set_dashboard_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
    existing_count INTEGER;
BEGIN
    -- Only generate slug if it's null or empty
    IF NEW.dashboard_slug IS NULL OR NEW.dashboard_slug = '' THEN
        -- Create base slug from client name
        base_slug := lower(trim(regexp_replace(NEW.name, '[^a-zA-Z0-9\s]', '', 'g')));
        base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
        base_slug := trim(base_slug, '-');
        
        -- If empty, use 'client'
        IF base_slug = '' THEN
            base_slug := 'client';
        END IF;
        
        final_slug := base_slug;
        
        -- Find unique slug
        LOOP
            SELECT COUNT(*) INTO existing_count 
            FROM public.clients 
            WHERE dashboard_slug = final_slug 
            AND (TG_OP = 'INSERT' OR id != NEW.id);
            
            IF existing_count = 0 THEN
                EXIT;
            END IF;
            
            counter := counter + 1;
            final_slug := base_slug || '-' || counter;
            
            -- Safety break
            IF counter > 1000 THEN
                final_slug := base_slug || '-' || extract(epoch from now())::text;
                EXIT;
            END IF;
        END LOOP;
        
        NEW.dashboard_slug := final_slug;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;