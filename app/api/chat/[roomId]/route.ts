import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/chat/[roomId] - Get specific chat room details
export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params

    const { data: room, error } = await supabaseAdmin!
      .from('chat_rooms')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          company,
          email,
          dashboard_slug
        )
      `)
      .eq('id', roomId)
      .single()

    if (error) {
      console.error('Error fetching chat room:', error)
      return NextResponse.json({ error: 'Chat room not found' }, { status: 404 })
    }

    return NextResponse.json({ data: room })
  } catch (error) {
    console.error('Error in chat room API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/chat/[roomId] - Update chat room
export async function PATCH(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params
    const body = await request.json()
    const { title, status } = body

    const updates: any = {}
    if (title !== undefined) updates.title = title
    if (status !== undefined) updates.status = status

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 })
    }

    const { data: updatedRoom, error } = await supabaseAdmin!
      .from('chat_rooms')
      .update(updates)
      .eq('id', roomId)
      .select()
      .single()

    if (error) {
      console.error('Error updating chat room:', error)
      return NextResponse.json({ error: 'Failed to update chat room' }, { status: 500 })
    }

    return NextResponse.json({ data: updatedRoom })
  } catch (error) {
    console.error('Error in update chat room API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}