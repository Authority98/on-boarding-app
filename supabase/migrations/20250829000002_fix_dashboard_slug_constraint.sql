-- Fix dashboard slug constraint issues
-- Make dashboard_slug temporarily nullable to fix existing data

-- First, make the column nullable temporarily
ALTER TABLE public.clients ALTER COLUMN dashboard_slug DROP NOT NULL;

-- Update any clients that might have null slugs
UPDATE public.clients 
SET dashboard_slug = CASE 
    WHEN dashboard_slug IS NULL OR dashboard_slug = '' THEN
        lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g')) || '-' || id::text
    ELSE dashboard_slug 
END
WHERE dashboard_slug IS NULL OR dashboard_slug = '';

-- Now make it NOT NULL again
ALTER TABLE public.clients ALTER COLUMN dashboard_slug SET NOT NULL;

-- Update the trigger function to be more robust
CREATE OR REPLACE FUNCTION set_dashboard_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
    existing_count INTEGER;
BEGIN
    -- Always generate slug if it's null, empty, or this is an INSERT
    IF NEW.dashboard_slug IS NULL OR NEW.dashboard_slug = '' OR TG_OP = 'INSERT' THEN
        -- Create base slug from client name
        base_slug := lower(trim(regexp_replace(NEW.name, '[^a-zA-Z0-9\s]', '', 'g')));
        base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
        base_slug := trim(both '-' from base_slug);
        
        -- If empty, use 'client'
        IF base_slug = '' OR base_slug IS NULL THEN
            base_slug := 'client';
        END IF;
        
        final_slug := base_slug;
        
        -- Find unique slug - only check if we're doing an INSERT or if it's different from current
        IF TG_OP = 'INSERT' OR final_slug != COALESCE(OLD.dashboard_slug, '') THEN
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
                IF counter > 100 THEN
                    final_slug := base_slug || '-' || extract(epoch from now())::text;
                    EXIT;
                END IF;
            END LOOP;
        END IF;
        
        NEW.dashboard_slug := final_slug;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;