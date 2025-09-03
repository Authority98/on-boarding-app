import { supabase } from '@/lib/supabase'

// Types for chat system
export interface ChatRoom {
  id: string
  client_id: string
  agency_user_id: string
  title: string
  status: 'active' | 'archived' | 'closed'
  last_message_at: string
  created_at: string
  updated_at: string
  clients?: {
    id: string
    name: string
    company?: string
    email: string
    dashboard_slug: string
  }
}

export interface ChatMessage {
  id: string
  chat_room_id: string
  sender_type: 'agency' | 'client'
  sender_id: string
  sender_name: string
  message_text: string
  message_type: 'text' | 'file' | 'image'
  file_url?: string
  file_name?: string
  is_read: boolean
  reply_to_message_id?: string
  created_at: string
  updated_at: string
}

export interface ChatParticipant {
  id: string
  chat_room_id: string
  participant_type: 'agency' | 'client'
  participant_id: string
  participant_name: string
  last_read_at: string
  notifications_enabled: boolean
  created_at: string
  updated_at: string
}

// Chat operations for client and agency use
export const chatOperations = {
  // Get or create chat room for a client
  async getOrCreateChatRoom(clientId: string, agencyUserId?: string): Promise<ChatRoom | null> {
    try {
      // First try to find existing room
      let { data: room, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'active')
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching chat room:', error)
        return null
      }

      // If room exists, return it
      if (room) {
        return room as ChatRoom
      }

      // If no room exists and we have agency user ID, create one
      if (agencyUserId) {
        const response = await fetch('/api/chat/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId,
            agencyUserId,
            title: 'Support Chat'
          })
        })

        if (response.ok) {
          const result = await response.json()
          return result.data as ChatRoom
        }
      }

      return null
    } catch (error) {
      console.error('Error in getOrCreateChatRoom:', error)
      return null
    }
  },

  // Get chat rooms for agency user
  async getChatRoomsForAgency(userId: string): Promise<ChatRoom[]> {
    try {
      const response = await fetch(`/api/chat/rooms?userId=${userId}`)
      if (response.ok) {
        const result = await response.json()
        return result.data || []
      }
      return []
    } catch (error) {
      console.error('Error fetching agency chat rooms:', error)
      return []
    }
  },

  // Get chat room for client
  async getChatRoomForClient(clientId: string): Promise<ChatRoom | null> {
    try {
      const response = await fetch(`/api/chat/rooms?clientId=${clientId}`)
      if (response.ok) {
        const result = await response.json()
        const rooms = result.data || []
        return rooms.length > 0 ? rooms[0] : null
      }
      return null
    } catch (error) {
      console.error('Error fetching client chat room:', error)
      return null
    }
  },

  // Get messages for a chat room
  async getMessages(roomId: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`/api/chat/messages?roomId=${roomId}&limit=${limit}&offset=${offset}`)
      if (response.ok) {
        const result = await response.json()
        return result.data || []
      }
      return []
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  },

  // Send a message
  async sendMessage(
    roomId: string,
    senderType: 'agency' | 'client',
    senderId: string,
    senderName: string,
    messageText: string,
    messageType: 'text' | 'file' | 'image' = 'text'
  ): Promise<ChatMessage | null> {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          senderType,
          senderId,
          senderName,
          messageText,
          messageType
        })
      })

      if (response.ok) {
        const result = await response.json()
        return result.data as ChatMessage
      }
      return null
    } catch (error) {
      console.error('Error sending message:', error)
      return null
    }
  },

  // Mark messages as read
  async markMessagesAsRead(messageIds: string[]): Promise<boolean> {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageIds,
          isRead: true
        })
      })

      return response.ok
    } catch (error) {
      console.error('Error marking messages as read:', error)
      return false
    }
  },

  // Subscribe to real-time messages for a chat room
  subscribeToMessages(
    roomId: string,
    onMessage: (message: ChatMessage) => void,
    onError?: (error: any) => void
  ) {
    const channel = supabase
      .channel(`chat_room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_room_id=eq.${roomId}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage
          onMessage(newMessage)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_room_id=eq.${roomId}`
        },
        (payload) => {
          const updatedMessage = payload.new as ChatMessage
          onMessage(updatedMessage)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to chat room ${roomId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to chat room ${roomId}`)
          onError?.(status)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  },

  // Subscribe to chat room updates (for agency dashboard)
  subscribeToChatRooms(
    agencyUserId: string,
    onRoomUpdate: (room: ChatRoom) => void,
    onError?: (error: any) => void
  ) {
    const channel = supabase
      .channel(`agency_chat_rooms_${agencyUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_rooms',
          filter: `agency_user_id=eq.${agencyUserId}`
        },
        (payload) => {
          const room = payload.new as ChatRoom
          onRoomUpdate(room)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to agency chat rooms for ${agencyUserId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to agency chat rooms for ${agencyUserId}`)
          onError?.(status)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  },

  // Get unread message count for a chat room
  async getUnreadCount(roomId: string, participantType: 'agency' | 'client'): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id')
        .eq('chat_room_id', roomId)
        .eq('is_read', false)
        .neq('sender_type', participantType) // Don't count own messages

      if (error) {
        console.error('Error getting unread count:', error)
        return 0
      }

      return data?.length || 0
    } catch (error) {
      console.error('Error getting unread count:', error)
      return 0
    }
  },

  // Get total unread count for agency user across all chat rooms
  async getTotalUnreadCountForAgency(agencyUserId: string): Promise<number> {
    try {
      const { data: rooms } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('agency_user_id', agencyUserId)
        .eq('status', 'active')

      if (!rooms || rooms.length === 0) return 0

      const roomIds = rooms.map(room => room.id)
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id')
        .in('chat_room_id', roomIds)
        .eq('sender_type', 'client')
        .eq('is_read', false)

      if (error) {
        console.error('Error getting total unread count:', error)
        return 0
      }

      return data?.length || 0
    } catch (error) {
      console.error('Error getting total unread count:', error)
      return 0
    }
  }
}