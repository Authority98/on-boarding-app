"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Client } from '@/lib/supabase'
import { useFacebookData, formatCurrency, formatNumber } from "@/hooks/use-facebook-data"
import { BarChart3, TrendingUp, Eye, MousePointer, Target, DollarSign } from "lucide-react"

interface FacebookAnalyticsChartProps {
  client: Client
}

export function FacebookAnalyticsChart({ client }: FacebookAnalyticsChartProps) {
  const facebookData = useFacebookData(client)

  if (!client.facebook_connected_at) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Facebook Ads Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <BarChart3 className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Connect your Facebook account to view detailed analytics
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (facebookData.isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Facebook Ads Analytics
            <Badge variant="outline" className="ml-auto">
              Live Data
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Loading Facebook Ads data...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (facebookData.error) {
    return (
      <Card className="mb-8 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <BarChart3 className="w-5 h-5" />
            Facebook Ads Analytics
            <Badge variant="destructive" className="ml-auto">
              Error
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">Failed to load Facebook Ads data</p>
            <p className="text-sm text-gray-500">{facebookData.error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { metrics } = facebookData
  const maxValue = Math.max(metrics.impressions, metrics.clicks, metrics.conversions, metrics.reach)

  const chartData = [
    {
      label: 'Impressions',
      value: metrics.impressions,
      icon: <Eye className="w-4 h-4" />,
      color: '#3b82f6',
      formatted: formatNumber(metrics.impressions)
    },
    {
      label: 'Clicks',
      value: metrics.clicks,
      icon: <MousePointer className="w-4 h-4" />,
      color: '#10b981',
      formatted: formatNumber(metrics.clicks)
    },
    {
      label: 'Conversions',
      value: metrics.conversions,
      icon: <Target className="w-4 h-4" />,
      color: '#f59e0b',
      formatted: formatNumber(metrics.conversions)
    },
    {
      label: 'Reach',
      value: metrics.reach,
      icon: <TrendingUp className="w-4 h-4" />,
      color: '#8b5cf6',
      formatted: formatNumber(metrics.reach)
    }
  ]

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Facebook Ads Analytics
          <Badge variant="outline" className="ml-auto">
            Live Data
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Last updated: {new Date(facebookData.lastUpdated).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent>
        {/* Performance Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics.spend)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Spend</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {(metrics.ctr * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">CTR</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(metrics.cpc)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">CPC</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {metrics.roas.toFixed(2)}x
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">ROAS</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Performance Metrics
          </h4>
          {chartData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.formatted}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: item.color,
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Additional Insights */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Key Insights
          </h5>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Click-through rate: {(metrics.ctr * 100).toFixed(2)}%</li>
            <li>• Cost per click: {formatCurrency(metrics.cpc)}</li>
            <li>• Return on ad spend: {metrics.roas.toFixed(2)}x</li>
            <li>• Total people reached: {formatNumber(metrics.reach)}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}