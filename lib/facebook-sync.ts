import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface SyncResult {
  success: boolean
  message: string
  clientsUpdated: number
  errors: string[]
}

/**
 * Sync Facebook Ads data for all connected clients
 */
export async function syncAllFacebookData(): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    message: '',
    clientsUpdated: 0,
    errors: []
  }

  try {
    // Get all clients with Facebook connections
    const { data: clients, error } = await supabase
      .from('clients')
      .select('id, facebook_access_token, facebook_ad_account_id')
      .not('facebook_connected_at', 'is', null)
      .not('facebook_access_token', 'is', null)

    if (error) {
      result.success = false
      result.message = 'Failed to fetch connected clients'
      result.errors.push(error.message)
      return result
    }

    if (!clients || clients.length === 0) {
      result.message = 'No clients with Facebook connections found'
      return result
    }

    // Sync data for each client
    for (const client of clients) {
      try {
        const syncResult = await syncClientFacebookData(client.id)
        if (syncResult.success) {
          result.clientsUpdated++
        } else {
          result.errors.push(`Client ${client.id}: ${syncResult.message}`)
        }
      } catch (error) {
        result.errors.push(`Client ${client.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    if (result.errors.length > 0) {
      result.success = false
      result.message = `Sync completed with ${result.errors.length} errors`
    } else {
      result.message = `Successfully synced data for ${result.clientsUpdated} clients`
    }

  } catch (error) {
    result.success = false
    result.message = 'Sync process failed'
    result.errors.push(error instanceof Error ? error.message : 'Unknown error')
  }

  return result
}

/**
 * Sync Facebook Ads data for a specific client
 */
export async function syncClientFacebookData(clientId: string): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    message: '',
    clientsUpdated: 0,
    errors: []
  }

  try {
    // Get client Facebook connection details
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('facebook_access_token, facebook_ad_account_id')
      .eq('id', clientId)
      .single()

    if (clientError || !client) {
      result.success = false
      result.message = 'Client not found or no Facebook connection'
      result.errors.push(clientError?.message || 'Client not found')
      return result
    }

    if (!client.facebook_access_token || !client.facebook_ad_account_id) {
      result.success = false
      result.message = 'Missing Facebook credentials'
      return result
    }

    // Fetch fresh data from Facebook API
    const facebookData = await fetchFacebookAdsData(
      client.facebook_access_token,
      client.facebook_ad_account_id
    )

    if (!facebookData.success) {
      result.success = false
      result.message = facebookData.error || 'Failed to fetch Facebook data'
      return result
    }

    // Store the data in database
    const { error: insertError } = await supabase
      .from('facebook_ads_data')
      .upsert({
        client_id: clientId,
        ad_account_id: client.facebook_ad_account_id,
        ...facebookData.data,
        synced_at: new Date().toISOString()
      })

    if (insertError) {
      result.success = false
      result.message = 'Failed to store Facebook data'
      result.errors.push(insertError.message)
      return result
    }

    // Log the sync action
    await supabase
      .from('facebook_connection_logs')
      .insert({
        client_id: clientId,
        action: 'data_sync',
        status: 'success',
        details: { synced_metrics: Object.keys(facebookData.data) }
      })

    result.clientsUpdated = 1
    result.message = 'Data synced successfully'

  } catch (error) {
    result.success = false
    result.message = 'Sync failed'
    result.errors.push(error instanceof Error ? error.message : 'Unknown error')

    // Log the error
    await supabase
      .from('facebook_connection_logs')
      .insert({
        client_id: clientId,
        action: 'data_sync',
        status: 'error',
        details: { error: result.message }
      })
  }

  return result
}

/**
 * Fetch Facebook Ads data from the API
 */
async function fetchFacebookAdsData(accessToken: string, adAccountId: string) {
  try {
    const fields = [
      'spend',
      'impressions', 
      'clicks',
      'ctr',
      'cpc',
      'conversions',
      'cost_per_conversion',
      'reach'
    ].join(',')

    const url = `https://graph.facebook.com/v18.0/act_${adAccountId}/insights?fields=${fields}&access_token=${accessToken}&date_preset=last_30d`
    
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Facebook API error'
      }
    }

    if (!data.data || data.data.length === 0) {
      return {
        success: false,
        error: 'No ads data available'
      }
    }

    // Aggregate data from all campaigns
    const aggregated = data.data.reduce((acc: any, item: any) => {
      acc.spend = (parseFloat(acc.spend || 0) + parseFloat(item.spend || 0)).toString()
      acc.impressions = (parseInt(acc.impressions || 0) + parseInt(item.impressions || 0)).toString()
      acc.clicks = (parseInt(acc.clicks || 0) + parseInt(item.clicks || 0)).toString()
      acc.conversions = (parseInt(acc.conversions || 0) + parseInt(item.conversions || 0)).toString()
      acc.reach = (parseInt(acc.reach || 0) + parseInt(item.reach || 0)).toString()
      return acc
    }, {})

    // Calculate derived metrics
    const spend = parseFloat(aggregated.spend || 0)
    const clicks = parseInt(aggregated.clicks || 0)
    const conversions = parseInt(aggregated.conversions || 0)
    const impressions = parseInt(aggregated.impressions || 0)

    return {
      success: true,
      data: {
        ...aggregated,
        ctr: impressions > 0 ? (clicks / impressions).toString() : '0',
        cpc: clicks > 0 ? (spend / clicks).toString() : '0',
        roas: spend > 0 && conversions > 0 ? (conversions * 50 / spend).toString() : '0', // Assuming $50 avg conversion value
        date_start: new Date().toISOString().split('T')[0],
        date_stop: new Date().toISOString().split('T')[0]
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Schedule automatic data sync (to be called by cron job or similar)
 */
export async function scheduleDataSync() {
  console.log('Starting scheduled Facebook data sync...')
  const result = await syncAllFacebookData()
  
  console.log('Sync completed:', {
    success: result.success,
    message: result.message,
    clientsUpdated: result.clientsUpdated,
    errors: result.errors
  })
  
  return result
}