import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/facebook/disconnect - Disconnect Facebook account
export async function POST(request: NextRequest) {
  try {
    const { client_id, user_id } = await request.json()

    if (!client_id || !user_id) {
      return NextResponse.json(
        { error: 'Missing client_id or user_id' },
        { status: 400 }
      )
    }

    // Verify that the user owns this client
    const { data: client, error } = await supabase
      .from('clients')
      .select('id, user_id, facebook_access_token')
      .eq('id', client_id)
      .eq('user_id', user_id)
      .single()

    if (error || !client) {
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      )
    }

    // Clear Facebook connection data
    const { error: updateError } = await supabase
      .from('clients')
      .update({
        facebook_access_token: null,
        facebook_ad_account_id: null,
        facebook_connected_at: null,
        facebook_token_expires_at: null,
        facebook_page_id: null,
        facebook_business_id: null,
        facebook_connection_status: 'disconnected'
      })
      .eq('id', client_id)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to disconnect Facebook account' },
        { status: 500 }
      )
    }

    // Log the disconnection
    await supabase
      .from('facebook_connection_logs')
      .insert({
        client_id,
        action: 'disconnect',
        status: 'success',
        message: 'Facebook account disconnected successfully'
      })

    // Optionally, delete stored ads data (uncomment if you want to remove historical data)
    // await supabase
    //   .from('facebook_ads_data')
    //   .delete()
    //   .eq('client_id', client_id)

    return NextResponse.json({
      success: true,
      message: 'Facebook account disconnected successfully'
    })
  } catch (error) {
    console.error('Facebook disconnect error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}