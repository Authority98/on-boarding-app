"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// Using card for alert-like display since alert component doesn't exist
import { LoadingButton } from '@/components/ui/loading-button'
import { 
  Facebook, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Unlink,
  Calendar,
  TrendingUp,
  DollarSign,
  Eye
} from 'lucide-react'
import { type Client } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface FacebookConnectionProps {
  client: Client
  onConnectionUpdate?: (client: Client) => void
}

interface FacebookAdsStats {
  totalSpend: number
  totalImpressions: number
  totalClicks: number
  averageCTR: number
  lastSyncDate: string
}

export function FacebookConnection({ client, onConnectionUpdate }: FacebookConnectionProps) {
  const { user } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [adsStats, setAdsStats] = useState<FacebookAdsStats | null>(null)
  const [showStats, setShowStats] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  const isConnected = client.facebook_connection_status === 'connected'
  const isExpired = client.facebook_connection_status === 'expired'
  const hasError = client.facebook_connection_status === 'error'

  // Load Facebook Ads stats if connected
  useEffect(() => {
    if (isConnected && client.id && user?.id) {
      loadAdsStats()
    }
  }, [isConnected, client.id, user?.id])

  // Handle URL parameters for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const facebookCode = urlParams.get('facebook_code')
    const facebookState = urlParams.get('facebook_state')
    const facebookClientId = urlParams.get('facebook_client_id')
    const facebookSuccess = urlParams.get('facebook_success')
    const facebookError = urlParams.get('facebook_error')

    if (facebookError) {
      setError(`Facebook connection failed: ${facebookError}`)
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    } else if (facebookSuccess && facebookCode && facebookState && facebookClientId === client.id) {
      handleOAuthCallback(facebookCode, facebookState)
    }
  }, [])

  const loadAdsStats = async () => {
    try {
      const response = await fetch(
        `/api/facebook/ads-data?client_id=${client.id}&user_id=${user?.id}&date_range=30`
      )
      const data = await response.json()

      if (data.success && data.data.length > 0) {
        const stats = data.data.reduce((acc: any, item: any) => {
          acc.totalSpend += item.spend || 0
          acc.totalImpressions += item.impressions || 0
          acc.totalClicks += item.clicks || 0
          return acc
        }, { totalSpend: 0, totalImpressions: 0, totalClicks: 0 })

        stats.averageCTR = stats.totalImpressions > 0 
          ? (stats.totalClicks / stats.totalImpressions) * 100 
          : 0
        stats.lastSyncDate = data.data[0].created_at

        setAdsStats(stats)
      }
    } catch (error) {
      console.error('Failed to load ads stats:', error)
    }
  }

  const handleOAuthCallback = async (code: string, state: string) => {
    setIsConnecting(true)
    setError(null)

    try {
      const response = await fetch('/api/facebook/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          state,
          client_id: client.id
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Facebook account connected successfully!')
        // Update client data
        const updatedClient = {
          ...client,
          facebook_connection_status: 'connected' as const,
          facebook_connected_at: new Date().toISOString()
        }
        onConnectionUpdate?.(updatedClient)
        
        // Load initial stats
        setTimeout(() => loadAdsStats(), 1000)
      } else {
        setError(data.error || 'Failed to connect Facebook account')
      }
    } catch (error) {
      setError('Network error occurred while connecting')
    } finally {
      setIsConnecting(false)
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }

  const handleConnect = async () => {
    if (!client.id || !user?.id) return

    setIsConnecting(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/facebook/auth?client_id=${client.id}&user_id=${user.id}`
      )
      const data = await response.json()

      if (data.auth_url) {
        // Redirect to Facebook OAuth
        window.location.href = data.auth_url
      } else {
        setError(data.error || 'Failed to initiate Facebook connection')
        setIsConnecting(false)
      }
    } catch (error) {
      setError('Network error occurred')
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!client.id || !user?.id) return

    setIsDisconnecting(true)
    setError(null)

    try {
      const response = await fetch('/api/facebook/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          user_id: user.id
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Facebook account disconnected successfully')
        const updatedClient = {
          ...client,
          facebook_connection_status: 'disconnected' as const,
          facebook_connected_at: undefined
        }
        onConnectionUpdate?.(updatedClient)
        setAdsStats(null)
        setShowStats(false)
      } else {
        setError(data.error || 'Failed to disconnect Facebook account')
      }
    } catch (error) {
      setError('Network error occurred while disconnecting')
    } finally {
      setIsDisconnecting(false)
    }
  }

  const handleSyncData = async () => {
    if (!client.id || !user?.id) return

    setIsSyncing(true)
    setError(null)

    try {
      const response = await fetch('/api/facebook/ads-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          user_id: user.id,
          date_range: 30
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Successfully synced ${data.count} ad insights`)
        setLastSyncTime(new Date().toISOString())
        loadAdsStats()
      } else {
        setError(data.error || 'Failed to sync Facebook Ads data')
      }
    } catch (error) {
      setError('Network error occurred while syncing data')
    } finally {
      setIsSyncing(false)
    }
  }

  const getStatusBadge = () => {
    if (isConnected) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Connected
        </Badge>
      )
    } else if (isExpired) {
      return (
        <Badge variant="destructive" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Token Expired
        </Badge>
      )
    } else if (hasError) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          Error
        </Badge>
      )
    } else {
      return (
        <Badge variant="secondary">
          Not Connected
        </Badge>
      )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Facebook className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Facebook Ads Integration</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Connect your Facebook Ads account to display real campaign data
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-800">{success}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {!isConnected ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">Benefits of connecting your Facebook Ads account:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Real-time campaign performance data</li>
                <li>Automated KPI updates</li>
                <li>Detailed analytics and insights</li>
                <li>Historical performance tracking</li>
              </ul>
            </div>
            
            <LoadingButton
              onClick={handleConnect}
              loading={isConnecting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Facebook className="w-4 h-4 mr-2" />
              {isConnecting ? 'Connecting...' : 'Connect Facebook Ads'}
            </LoadingButton>
          </div>
        ) : (
          <div className="space-y-4">
            {client.facebook_connected_at && (
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Connected on {new Date(client.facebook_connected_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {adsStats && (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStats(!showStats)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showStats ? 'Hide' : 'Show'} Recent Performance (30 days)
                </Button>

                {showStats && (
                  <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                      </div>
                      <div className="text-lg font-semibold">${adsStats.totalSpend.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">Total Spend</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="w-4 h-4 text-blue-600 mr-1" />
                      </div>
                      <div className="text-lg font-semibold">{adsStats.totalImpressions.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Impressions</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="w-4 h-4 text-purple-600 mr-1" />
                      </div>
                      <div className="text-lg font-semibold">{adsStats.totalClicks.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{adsStats.averageCTR.toFixed(2)}%</div>
                      <div className="text-xs text-gray-600">Avg CTR</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex space-x-2">
                <LoadingButton
                  onClick={handleSyncData}
                  loading={isSyncing}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {isSyncing ? 'Syncing...' : 'Sync Data'}
                </LoadingButton>
                
                <LoadingButton
                  onClick={handleDisconnect}
                  loading={isDisconnecting}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                </LoadingButton>
              </div>
              
              {lastSyncTime && (
                <p className="text-xs text-gray-500 text-center">
                  Last synced: {new Date(lastSyncTime).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}