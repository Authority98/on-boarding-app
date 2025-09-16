import { useState, useEffect } from 'react'
import { type Client } from '@/lib/supabase'

export interface FacebookAdsMetrics {
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  conversions: number
  roas: number
  reach: number
}

export interface FacebookAdsData {
  metrics: FacebookAdsMetrics
  lastUpdated: string
  isLoading: boolean
  error: string | null
}

export function useFacebookData(client: Client): FacebookAdsData {
  const [data, setData] = useState<FacebookAdsData>({
    metrics: {
      spend: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpc: 0,
      conversions: 0,
      roas: 0,
      reach: 0
    },
    lastUpdated: '',
    isLoading: false,
    error: null
  })

  useEffect(() => {
    if (!client.facebook_connected_at || !client.facebook_access_token) {
      return
    }

    const fetchFacebookData = async () => {
      setData(prev => ({ ...prev, isLoading: true, error: null }))
      
      try {
        const response = await fetch(`/api/facebook/ads-data?clientId=${client.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch Facebook Ads data')
        }

        const result = await response.json()
        
        if (result.success && result.data) {
          const adsData = result.data
          setData({
            metrics: {
              spend: parseFloat(adsData.spend) || 0,
              impressions: parseInt(adsData.impressions) || 0,
              clicks: parseInt(adsData.clicks) || 0,
              ctr: parseFloat(adsData.ctr) || 0,
              cpc: parseFloat(adsData.cpc) || 0,
              conversions: parseInt(adsData.conversions) || 0,
              roas: parseFloat(adsData.roas) || 0,
              reach: parseInt(adsData.reach) || 0
            },
            lastUpdated: adsData.date_start || new Date().toISOString(),
            isLoading: false,
            error: null
          })
        } else {
          throw new Error(result.error || 'No data available')
        }
      } catch (error) {
        console.error('Error fetching Facebook data:', error)
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }))
      }
    }

    fetchFacebookData()
  }, [client.id, client.facebook_connected_at, client.facebook_access_token])

  return data
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}