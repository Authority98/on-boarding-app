import { NextRequest, NextResponse } from 'next/server'
import { syncAllFacebookData, syncClientFacebookData } from '@/lib/facebook-sync'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * POST /api/facebook/sync
 * Manually trigger Facebook Ads data synchronization
 */
export async function POST(request: NextRequest) {
  try {
    const { clientId, syncAll } = await request.json()

    // Verify user authentication (you may want to add proper auth here)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    let result

    if (syncAll) {
      // Sync all clients
      result = await syncAllFacebookData()
    } else if (clientId) {
      // Sync specific client
      result = await syncClientFacebookData(clientId)
    } else {
      return NextResponse.json(
        { success: false, error: 'Either clientId or syncAll must be specified' },
        { status: 400 }
      )
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Sync API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/facebook/sync/status
 * Get sync status and last sync times for clients
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')

    let query = supabase
      .from('facebook_connection_logs')
      .select('client_id, action, status, created_at, details')
      .eq('action', 'data_sync')
      .order('created_at', { ascending: false })

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data: logs, error } = await query.limit(50)

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch sync status' },
        { status: 500 }
      )
    }

    // Group by client and get latest status
    const statusByClient = logs?.reduce((acc: any, log: any) => {
      if (!acc[log.client_id]) {
        acc[log.client_id] = {
          clientId: log.client_id,
          lastSync: log.created_at,
          status: log.status,
          details: log.details
        }
      }
      return acc
    }, {}) || {}

    return NextResponse.json({
      success: true,
      data: Object.values(statusByClient)
    })

  } catch (error) {
    console.error('Sync status API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}