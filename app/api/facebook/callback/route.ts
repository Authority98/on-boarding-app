import { NextRequest, NextResponse } from 'next/server'

// GET /api/facebook/callback - Handle Facebook OAuth callback
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Handle OAuth errors
    if (error) {
      console.error('Facebook OAuth error:', error, errorDescription)
      return NextResponse.redirect(
        new URL(`/dashboard/clients?facebook_error=${encodeURIComponent(errorDescription || error)}`, request.url)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard/clients?facebook_error=Missing authorization code', request.url)
      )
    }

    // Parse state to get client info
    const [clientId, userId] = state.split(':')
    
    if (!clientId || !userId) {
      return NextResponse.redirect(
        new URL('/dashboard/clients?facebook_error=Invalid state parameter', request.url)
      )
    }

    // Redirect to client dashboard with success parameters
    const redirectUrl = new URL('/dashboard/clients', request.url)
    redirectUrl.searchParams.set('facebook_code', code)
    redirectUrl.searchParams.set('facebook_state', state)
    redirectUrl.searchParams.set('facebook_client_id', clientId)
    redirectUrl.searchParams.set('facebook_success', 'true')

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('Facebook callback error:', error)
    return NextResponse.redirect(
      new URL('/dashboard/clients?facebook_error=Callback processing failed', request.url)
    )
  }
}