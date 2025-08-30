"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { type Client, type DashboardConfig } from '@/lib/supabase'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  DollarSign, 
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  FileText,
  Video
} from "lucide-react"

interface DashboardModeProps {
  client: Client
}

interface KPIData {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: React.ReactNode
}

interface ChartDataPoint {
  name: string
  value: number
}

export function DashboardMode({ client }: DashboardModeProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Get dashboard configuration with fallbacks
  const dashboardConfig: DashboardConfig = client.dashboard_config || {
    theme: {
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
      backgroundColor: "#ffffff"
    },
    branding: {
      showLogo: false,
      showCompanyName: true,
      customWelcomeMessage: ""
    },
    layout: {
      enableKPIs: true,
      enableCharts: true,
      enableTasks: true,
      enableActivity: true
    },
    kpis: [
      { id: "progress", title: "Project Progress", value: "78%", type: "percentage" },
      { id: "tasks", title: "Tasks Completed", value: "42", type: "number" },
      { id: "revenue", title: "Revenue Generated", value: "$24,500", type: "currency" },
      { id: "engagement", title: "Team Engagement", value: "94%", type: "percentage" }
    ]
  }

  useEffect(() => {
    // Simulate loading real-time data
    const loadDashboardData = () => {
      // Mock chart data
      const mockChartData: ChartDataPoint[] = [
        { name: "Jan", value: 4000 },
        { name: "Feb", value: 3000 },
        { name: "Mar", value: 2000 },
        { name: "Apr", value: 2780 },
        { name: "May", value: 1890 },
        { name: "Jun", value: 2390 },
        { name: "Jul", value: 3490 },
      ]

      setChartData(mockChartData)
      setIsLoading(false)
    }

    // Simulate API call delay
    setTimeout(loadDashboardData, 1000)
  }, [client])

  const getKPIIcon = (kpiId: string) => {
    switch (kpiId) {
      case 'progress':
        return <Target className="w-4 h-4" />
      case 'tasks':
        return <CheckCircle className="w-4 h-4" />
      case 'revenue':
        return <DollarSign className="w-4 h-4" />
      case 'engagement':
        return <Users className="w-4 h-4" />
      default:
        return <BarChart3 className="w-4 h-4" />
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48" />
              </div>
            </div>
          </div>

          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
                </div>
              </div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-8">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-6" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen" 
      style={{ backgroundColor: dashboardConfig.theme?.backgroundColor || "#f9fafb" }}
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {dashboardConfig.branding?.showLogo && dashboardConfig.branding?.logoUrl && (
              <img 
                src={dashboardConfig.branding.logoUrl} 
                alt="Logo" 
                className="w-16 h-16 object-contain rounded-lg"
              />
            )}
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl">{getInitials(client.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 
                className="text-3xl font-bold"
                style={{ color: dashboardConfig.theme?.primaryColor || "#1f2937" }}
              >
                {dashboardConfig.branding?.customWelcomeMessage || 
                  `Welcome back, ${client.name.split(' ')[0]}!`}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {dashboardConfig.branding?.showCompanyName && client.company ? 
                  `${client.company} • ` : ''}Here's your dashboard overview
              </p>
              {dashboardConfig.branding?.companyDescription && (
                <p className="text-sm text-gray-500 mt-1">
                  {dashboardConfig.branding.companyDescription}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active Project
            </Badge>
            <Badge variant="outline">
              Dashboard Mode
            </Badge>
          </div>
        </div>

        {/* KPI Cards */}
        {dashboardConfig.layout?.enableKPIs && dashboardConfig.kpis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardConfig.kpis.map((kpi, index) => (
              <Card key={kpi.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="p-2 rounded-full"
                      style={{ 
                        backgroundColor: `${dashboardConfig.theme?.primaryColor || "#3b82f6"}20`,
                        color: dashboardConfig.theme?.primaryColor || "#3b82f6"
                      }}
                    >
                      {getKPIIcon(kpi.id)}
                    </div>
                    {kpi.type === 'percentage' && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        +5%
                      </div>
                    )}
                  </div>
                  <div>
                    <p 
                      className="text-2xl font-bold mb-1"
                      style={{ color: dashboardConfig.theme?.primaryColor || "#1f2937" }}
                    >
                      {kpi.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {kpi.title}
                    </p>
                    {kpi.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {kpi.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main Chart */}
        {dashboardConfig.layout?.enableCharts && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-4">
                {chartData.map((point, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                      style={{ 
                        backgroundColor: dashboardConfig.theme?.primaryColor || "#3b82f6",
                        height: `${(point.value / Math.max(...chartData.map(d => d.value))) * 200}px`,
                        minHeight: '20px'
                      }}
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {point.name}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Project milestone completed", time: "2 hours ago", type: "success" },
                  { title: "New message from team", time: "4 hours ago", type: "info" },
                  { title: "Weekly report generated", time: "1 day ago", type: "neutral" },
                  { title: "Budget review scheduled", time: "2 days ago", type: "warning" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'info' ? 'bg-blue-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "View Messages", icon: <MessageSquare className="w-5 h-5" />, color: "blue" },
                  { title: "Download Reports", icon: <FileText className="w-5 h-5" />, color: "green" },
                  { title: "Schedule Meeting", icon: <Calendar className="w-5 h-5" />, color: "purple" },
                  { title: "Watch Tutorial", icon: <Video className="w-5 h-5" />, color: "orange" },
                ].map((action, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-lg border-2 border-dashed transition-all hover:border-solid hover:shadow-md ${
                      action.color === 'blue' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' :
                      action.color === 'green' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' :
                      action.color === 'purple' ? 'border-purple-300 hover:border-purple-500 hover:bg-purple-50' :
                      'border-orange-300 hover:border-orange-500 hover:bg-orange-50'
                    } dark:hover:bg-gray-800`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`p-2 rounded-full ${
                        action.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        action.color === 'green' ? 'bg-green-100 text-green-600' :
                        action.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {action.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleString()} • Dashboard Mode
          </p>
        </div>
      </div>
    </div>
  )
}