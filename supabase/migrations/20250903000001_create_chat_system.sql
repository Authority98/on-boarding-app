-- Create chat system for client dashboards
-- This migration creates tables for real-time chat functionality between agencies and clients

-- Create chat_rooms table to hold chat conversations
CREATE TABLE public.chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    agency_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) DEFAULT 'Client Support Chat',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, agency_user_id)
);

-- Create chat_messages table to hold individual messages
CREATE TABLE public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('agency', 'client')),
    sender_id UUID, -- Either agency user_id or client_id based on sender_type
    sender_name VARCHAR(255) NOT NULL,
    message_text TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image')),
    file_url VARCHAR(500), -- For file/image messages
    file_name VARCHAR(255), -- Original filename for file messages
    is_read BOOLEAN DEFAULT false,
    reply_to_message_id UUID REFERENCES public.chat_messages(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_participants table to track who can access each chat room
CREATE TABLE public.chat_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
    participant_type VARCHAR(20) NOT NULL CHECK (participant_type IN ('agency', 'client')),
    participant_id UUID NOT NULL, -- Either agency user_id or client_id
    participant_name VARCHAR(255) NOT NULL,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(chat_room_id, participant_type, participant_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_client_id ON public.chat_rooms(client_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_agency_user_id ON public.chat_rooms(agency_user_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_last_message_at ON public.chat_rooms(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_room_id ON public.chat_messages(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_read ON public.chat_messages(is_read);

CREATE INDEX IF NOT EXISTS idx_chat_participants_chat_room_id ON public.chat_participants(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_participant ON public.chat_participants(participant_type, participant_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_rooms
-- Agency users can view their own client chat rooms
CREATE POLICY "Agency users can view their client chat rooms" ON public.chat_rooms
    FOR SELECT USING (
        auth.uid() = agency_user_id
    );

-- Agency users can create chat rooms for their clients
CREATE POLICY "Agency users can create chat rooms for their clients" ON public.chat_rooms
    FOR INSERT WITH CHECK (
        auth.uid() = agency_user_id AND
        EXISTS (
            SELECT 1 FROM public.clients 
            WHERE id = client_id AND user_id = auth.uid()
        )
    );

-- Agency users can update their chat rooms
CREATE POLICY "Agency users can update their chat rooms" ON public.chat_rooms
    FOR UPDATE USING (auth.uid() = agency_user_id);

-- Public access for clients via client_id (no auth required for client dashboard access)
CREATE POLICY "Public access for client chat rooms" ON public.chat_rooms
    FOR SELECT USING (true);

-- RLS Policies for chat_messages
-- Agency users can view messages in their chat rooms
CREATE POLICY "Agency users can view messages in their chat rooms" ON public.chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_rooms 
            WHERE id = chat_room_id AND agency_user_id = auth.uid()
        )
    );

-- Agency users can send messages in their chat rooms
CREATE POLICY "Agency users can send messages in their chat rooms" ON public.chat_messages
    FOR INSERT WITH CHECK (
        sender_type = 'agency' AND
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.chat_rooms 
            WHERE id = chat_room_id AND agency_user_id = auth.uid()
        )
    );

-- Public access for clients to view and send messages
CREATE POLICY "Public access for client messages" ON public.chat_messages
    FOR SELECT USING (true);

CREATE POLICY "Public insert for client messages" ON public.chat_messages
    FOR INSERT WITH CHECK (sender_type = 'client');

-- Agency users can update messages (mark as read, etc.)
CREATE POLICY "Agency users can update messages in their chat rooms" ON public.chat_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.chat_rooms 
            WHERE id = chat_room_id AND agency_user_id = auth.uid()
        )
    );

-- RLS Policies for chat_participants
-- Agency users can view participants in their chat rooms
CREATE POLICY "Agency users can view participants in their chat rooms" ON public.chat_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_rooms 
            WHERE id = chat_room_id AND agency_user_id = auth.uid()
        )
    );

-- Agency users can manage participants in their chat rooms
CREATE POLICY "Agency users can manage participants in their chat rooms" ON public.chat_participants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.chat_rooms 
            WHERE id = chat_room_id AND agency_user_id = auth.uid()
        )
    );

-- Public access for clients to view participants
CREATE POLICY "Public access for client participants" ON public.chat_participants
    FOR SELECT USING (true);

-- Function to update last_message_at when new message is added
CREATE OR REPLACE FUNCTION update_chat_room_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_rooms 
    SET last_message_at = NEW.created_at, updated_at = NOW()
    WHERE id = NEW.chat_room_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update chat room when message is added
CREATE TRIGGER trigger_update_chat_room_last_message
    AFTER INSERT ON public.chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_room_last_message();

-- Function to create default chat room for new clients
CREATE OR REPLACE FUNCTION create_default_chat_room()
RETURNS TRIGGER AS $$
BEGIN
    -- Create a chat room for the new client
    INSERT INTO public.chat_rooms (client_id, agency_user_id, title)
    VALUES (NEW.id, NEW.user_id, 'Support Chat - ' || NEW.name);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create chat room when client is created
CREATE TRIGGER trigger_create_default_chat_room
    AFTER INSERT ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION create_default_chat_room();