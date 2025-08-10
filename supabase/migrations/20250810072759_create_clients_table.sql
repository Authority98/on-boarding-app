-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read all clients
CREATE POLICY "Users can view all clients" ON public.clients
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to insert clients
CREATE POLICY "Users can insert clients" ON public.clients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update clients
CREATE POLICY "Users can update clients" ON public.clients
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete clients
CREATE POLICY "Users can delete clients" ON public.clients
    FOR DELETE USING (auth.role() = 'authenticated');