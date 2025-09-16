import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/facebook/ads-data - Fetch Facebook Ads data for a client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')
    const userId = searchParams.get('user_id')
    const dateRange = searchParams.get('date_range') || '30' // days
    const refresh = searchParams.get('refresh') === 'true'

    if (!clientId || !userId) {
      return NextResponse.json(
        { error: 'Missing client_id or user_id parameter' },
        { status: 400 }
      )
    }

    // Get client with Facebook connection info
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .eq('user_id', userId)
      .single()

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      )
    }

    if (client.facebook_connection_status !== 'connected' || !client.facebook_access_token) {
      return NextResponse.json(
        { error: 'Facebook account not connected' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (client.facebook_token_expires_at && new Date(client.facebook_token_expires_at) < new Date()) {
      await supabase
        .from('clients')
        .update({ facebook_connection_status: 'expired' })
        .eq('id', clientId)

      return NextResponse.json(
        { error: 'Facebook token expired. Please reconnect.' },
        { status: 401 }
      )
    }

    // If not refreshing, try to get cached data first
    if (!refresh) {
      const { data: cachedData } = await supabase
        .from('facebook_ads_data')
        .select('*')
        .eq('client_id', clientId)
        .gte('date_start', new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date_start', { ascending: false })

      if (cachedData && cachedData.length > 0) {
        return NextResponse.json({
          success: true,
          data: cachedData,
          cached: true
        })
      }
    }

    // Fetch fresh data from Facebook
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const fields = [
      'campaign_id',
      'campaign_name',
      'adset_id', 
      'adset_name',
      'ad_id',
      'ad_name',
      'impressions',
      'clicks',
      'spend',
      'reach',
      'frequency',
      'cpm',
      'cpc',
      'ctr',
      'conversions',
      'conversion_rate',
      'cost_per_conversion'
    ].join(',')

    const insightsUrl = `https://graph.facebook.com/v18.0/${client.facebook_ad_account_id}/insights?` +
      `access_token=${client.facebook_access_token}&` +
      `fields=${fields}&` +
      `time_range={'since':'${startDate}','until':'${endDate}'}&` +
      `time_increment=1&` +
      `level=ad`

    const response = await fetch(insightsUrl)
    const data = await response.json()

    if (!response.ok || data.error) {
      console.error('Facebook API error:', data)
      
      // Log the error
      await supabase
        .from('facebook_connection_logs')
        .insert({
          client_id: clientId,
          action: 'sync',
          status: 'failed',
          message: 'Failed to fetch ads data',
          error_details: data.error
        })

      return NextResponse.json(
        { error: 'Failed to fetch Facebook Ads data', details: data.error },
        { status: 400 }
      )
    }

    // Process and store the data
    const processedData = data.data.map((insight: any) => ({
      client_id: clientId,
      ad_account_id: client.facebook_ad_account_id,
      campaign_id: insight.campaign_id,
      campaign_name: insight.campaign_name,
      adset_id: insight.adset_id,
      adset_name: insight.adset_name,
      ad_id: insight.ad_id,
      ad_name: insight.ad_name,
      date_start: insight.date_start,
      date_stop: insight.date_stop,
      impressions: parseInt(insight.impressions) || 0,
      clicks: parseInt(insight.clicks) || 0,
      spend: parseFloat(insight.spend) || 0,
      reach: parseInt(insight.reach) || 0,
      frequency: parseFloat(insight.frequency) || 0,
      cpm: parseFloat(insight.cpm) || 0,
      cpc: parseFloat(insight.cpc) || 0,
      ctr: parseFloat(insight.ctr) || 0,
      conversions: parseInt(insight.conversions) || 0,
      conversion_rate: parseFloat(insight.conversion_rate) || 0,
      cost_per_conversion: parseFloat(insight.cost_per_conversion) || 0,
      roas: insight.spend > 0 ? (parseFloat(insight.conversions) * 100) / parseFloat(insight.spend) : 0,
      raw_data: insight
    }))

    // Clear old data for this date range and insert new data
    await supabase
      .from('facebook_ads_data')
      .delete()
      .eq('client_id', clientId)
      .gte('date_start', startDate)
      .lte('date_stop', endDate)

    if (processedData.length > 0) {
      const { error: insertError } = await supabase
        .from('facebook_ads_data')
        .insert(processedData)

      if (insertError) {
        console.error('Database insert error:', insertError)
        return NextResponse.json(
          { error: 'Failed to save ads data' },
          { status: 500 }
        )
      }
    }

    // Log successful sync
    await supabase
      .from('facebook_connection_logs')
      .insert({
        client_id: clientId,
        action: 'sync',
        status: 'success',
        message: `Synced ${processedData.length} ad insights`
      })

    return NextResponse.json({
      success: true,
      data: processedData,
      cached: false,
      count: processedData.length
    })
  } catch (error) {
    console.error('Facebook ads data error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/facebook/ads-data - Manually trigger data sync
export async function POST(request: NextRequest) {
  try {
    const { client_id, user_id, date_range = '30' } = await request.json()

    if (!client_id || !user_id) {
      return NextResponse.json(
        { error: 'Missing client_id or user_id' },
        { status: 400 }
      )
    }

    // Redirect to GET with refresh=true
    const url = new URL('/api/facebook/ads-data', request.url)
    url.searchParams.set('client_id', client_id)
    url.searchParams.set('user_id', user_id)
    url.searchParams.set('date_range', date_range.toString())
    url.searchParams.set('refresh', 'true')

    const response = await fetch(url.toString())
    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Facebook ads data POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}