import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET /api/chat/messages - Get messages for a chat room
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
    }

    const { data: messages, error } = await supabaseAdmin!
      .from('chat_messages')
      .select('*')
      .eq('chat_room_id', roomId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    return NextResponse.json({ data: messages || [] })
  } catch (error) {
    console.error('Error in messages API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/chat/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      roomId, 
      senderType, 
      senderId, 
      senderName, 
      messageText, 
      messageType = 'text' 
    } = body

    if (!roomId || !senderType || !senderName || !messageText) {
      return NextResponse.json({ 
        error: 'Room ID, sender type, sender name, and message text are required' 
      }, { status: 400 })
    }

    // Validate sender type
    if (!['agency', 'client'].includes(senderType)) {
      return NextResponse.json({ error: 'Invalid sender type' }, { status: 400 })
    }

    // For agency messages, verify authentication
    if (senderType === 'agency') {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: 'Authentication required for agency messages' }, { status: 401 })
      }
      
      // Verify the user has access to this chat room
      const { data: room } = await supabaseAdmin!
        .from('chat_rooms')
        .select('*')
        .eq('id', roomId)
        .eq('agency_user_id', user.id)
        .single()

      if (!room) {
        return NextResponse.json({ error: 'Access denied to this chat room' }, { status: 403 })
      }
    }

    const messageData = {
      chat_room_id: roomId,
      sender_type: senderType,
      sender_id: senderId,
      sender_name: senderName,
      message_text: messageText,
      message_type: messageType,
      is_read: false
    }

    const { data: newMessage, error } = await supabaseAdmin!
      .from('chat_messages')
      .insert([messageData])
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ data: newMessage })
  } catch (error) {
    console.error('Error in send message API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/chat/messages - Mark messages as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageIds, isRead = true } = body

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json({ error: 'Message IDs array is required' }, { status: 400 })
    }

    const { data: updatedMessages, error } = await supabaseAdmin!
      .from('chat_messages')
      .update({ is_read: isRead })
      .in('id', messageIds)
      .select()

    if (error) {
      console.error('Error updating message read status:', error)
      return NextResponse.json({ error: 'Failed to update messages' }, { status: 500 })
    }

    return NextResponse.json({ data: updatedMessages })
  } catch (error) {
    console.error('Error in update messages API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}