import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET
const FACEBOOK_REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + '/api/facebook/callback'

if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
  throw new Error('Missing Facebook app credentials')
}

// GET /api/facebook/auth - Initiate Facebook OAuth flow
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')
    const userId = searchParams.get('user_id')

    if (!clientId || !userId) {
      return NextResponse.json(
        { error: 'Missing client_id or user_id parameter' },
        { status: 400 }
      )
    }

    // Verify that the user owns this client
    const { data: client, error } = await supabase
      .from('clients')
      .select('id, user_id')
      .eq('id', clientId)
      .eq('user_id', userId)
      .single()

    if (error || !client) {
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      )
    }

    // Generate Facebook OAuth URL
    const scope = 'ads_read,ads_management,business_management,pages_read_engagement'
    const state = `${clientId}:${userId}:${Date.now()}`
    
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${FACEBOOK_APP_ID}&` +
      `redirect_uri=${encodeURIComponent(FACEBOOK_REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${encodeURIComponent(state)}&` +
      `response_type=code`

    return NextResponse.json({
      auth_url: facebookAuthUrl,
      state
    })
  } catch (error) {
    console.error('Facebook auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/facebook/auth - Exchange code for access token
export async function POST(request: NextRequest) {
  try {
    const { code, state, client_id } = await request.json()

    if (!code || !state || !client_id) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Verify state parameter
    const [stateClientId, stateUserId] = state.split(':')
    if (stateClientId !== client_id) {
      return NextResponse.json(
        { error: 'Invalid state parameter' },
        { status: 400 }
      )
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${FACEBOOK_APP_ID}&` +
      `client_secret=${FACEBOOK_APP_SECRET}&` +
      `redirect_uri=${encodeURIComponent(FACEBOOK_REDIRECT_URI)}&` +
      `code=${code}`,
      { method: 'GET' }
    )

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || tokenData.error) {
      console.error('Facebook token exchange error:', tokenData)
      return NextResponse.json(
        { error: 'Failed to exchange code for token' },
        { status: 400 }
      )
    }

    const { access_token, expires_in } = tokenData

    // Get user's ad accounts
    const adAccountsResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/adaccounts?access_token=${access_token}&fields=id,name,account_status,business`
    )

    const adAccountsData = await adAccountsResponse.json()

    if (!adAccountsResponse.ok || adAccountsData.error) {
      console.error('Facebook ad accounts error:', adAccountsData)
      return NextResponse.json(
        { error: 'Failed to fetch ad accounts' },
        { status: 400 }
      )
    }

    // Calculate token expiration time
    const expiresAt = new Date(Date.now() + (expires_in * 1000)).toISOString()

    // Update client with Facebook connection info
    const { error: updateError } = await supabase
      .from('clients')
      .update({
        facebook_access_token: access_token,
        facebook_connected_at: new Date().toISOString(),
        facebook_token_expires_at: expiresAt,
        facebook_connection_status: 'connected',
        facebook_ad_account_id: adAccountsData.data?.[0]?.id || null,
        facebook_business_id: adAccountsData.data?.[0]?.business?.id || null
      })
      .eq('id', client_id)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to save connection' },
        { status: 500 }
      )
    }

    // Log the connection
    await supabase
      .from('facebook_connection_logs')
      .insert({
        client_id,
        action: 'connect',
        status: 'success',
        message: 'Facebook account connected successfully'
      })

    return NextResponse.json({
      success: true,
      ad_accounts: adAccountsData.data,
      expires_at: expiresAt
    })
  } catch (error) {
    console.error('Facebook auth POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}