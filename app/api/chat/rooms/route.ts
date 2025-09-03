import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET /api/chat/rooms - Get chat rooms for authenticated user or by client ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const userId = searchParams.get('userId')

    if (!clientId && !userId) {
      return NextResponse.json({ error: 'Either clientId or userId is required' }, { status: 400 })
    }

    let query = supabaseAdmin!
      .from('chat_rooms')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          company,
          email
        )
      `)

    if (clientId) {
      query = query.eq('client_id', clientId)
    } else if (userId) {
      query = query.eq('agency_user_id', userId)
    }

    const { data: rooms, error } = await query
      .eq('status', 'active')
      .order('last_message_at', { ascending: false })

    if (error) {
      console.error('Error fetching chat rooms:', error)
      return NextResponse.json({ error: 'Failed to fetch chat rooms' }, { status: 500 })
    }

    return NextResponse.json({ data: rooms || [] })
  } catch (error) {
    console.error('Error in chat rooms API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/chat/rooms - Create a new chat room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, agencyUserId, title } = body

    if (!clientId || !agencyUserId) {
      return NextResponse.json({ error: 'Client ID and agency user ID are required' }, { status: 400 })
    }

    // Check if room already exists
    const { data: existingRoom } = await supabaseAdmin!
      .from('chat_rooms')
      .select('*')
      .eq('client_id', clientId)
      .eq('agency_user_id', agencyUserId)
      .single()

    if (existingRoom) {
      return NextResponse.json({ data: existingRoom })
    }

    // Create new room
    const { data: newRoom, error } = await supabaseAdmin!
      .from('chat_rooms')
      .insert([{
        client_id: clientId,
        agency_user_id: agencyUserId,
        title: title || 'Support Chat',
        status: 'active'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating chat room:', error)
      return NextResponse.json({ error: 'Failed to create chat room' }, { status: 500 })
    }

    return NextResponse.json({ data: newRoom })
  } catch (error) {
    console.error('Error in create chat room API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}