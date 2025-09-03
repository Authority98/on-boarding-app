"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { type Client } from '@/lib/supabase'
import { getWidgetVisibility } from '@/lib/widget-visibility'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  DollarSign,
  CheckCircle,
  Circle,
  Clock,
  BarChart3,
  FileText,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  MessageSquare
} from "lucide-react"
import { ChatWidget } from "@/components/chat-widget"

interface HybridModeProps {
  client: Client
}

interface KPIData {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: React.ReactNode
}

interface Task {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate?: string
  category: string
}

interface ChartDataPoint {
  name: string
  value: number
}

export function HybridMode({ client }: HybridModeProps) {
  const [kpiData, setKpiData] = useState<KPIData[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [completedCount, setCompletedCount] = useState(0)
  const [tasksPanelCollapsed, setTasksPanelCollapsed] = useState(false)

  // Get dashboard configuration with fallbacks
  const dashboardConfig = client.dashboard_config || {
    theme: {
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
      backgroundColor: "#ffffff"
    },
    branding: {
      showLogo: false,
      showCompanyName: true,
      customWelcomeMessage: "",
      companyDescription: ""
    },
    layout: {
      enableKPIs: true,
      enableCharts: true,
      widgetVisibility: {
        kpiCards: [true, true, true, true], // Array for individual KPI visibility
        taskList: true,
        chartSections: {
          performanceTrends: true
        }
      }
    },
    kpis: [
      { id: '1', title: 'Project Progress', value: '78%', type: 'percentage' as const },
      { id: '2', title: 'Tasks Completed', value: '42', type: 'number' as const },
      { id: '3', title: 'Revenue Generated', value: '$24,500', type: 'currency' as const },
      { id: '4', title: 'Team Engagement', value: '94%', type: 'percentage' as const }
    ]
  }

  useEffect(() => {
    // Simulate loading data for both dashboard and tasks
    const loadData = () => {
      // Mock KPI data
      const mockKPIs: KPIData[] = [
        {
          title: "Project Progress",
          value: "78%",
          change: "+12%",
          isPositive: true,
          icon: <Target className="w-4 h-4" />
        },
        {
          title: "Tasks Completed",
          value: "42",
          change: "+8",
          isPositive: true,
          icon: <CheckCircle className="w-4 h-4" />
        },
        {
          title: "Revenue Generated",
          value: "$24,500",
          change: "+15%",
          isPositive: true,
          icon: <DollarSign className="w-4 h-4" />
        },
        {
          title: "Team Engagement",
          value: "94%",
          change: "-2%",
          isPositive: false,
          icon: <Users className="w-4 h-4" />
        }
      ]

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

      // Mock tasks data
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Complete onboarding questionnaire",
          description: "Fill out the client information form",
          priority: "high",
          status: "pending",
          dueDate: "2025-09-01",
          category: "Onboarding"
        },
        {
          id: "2",
          title: "Review service agreement",
          description: "Sign the service agreement document",
          priority: "high",
          status: "pending",
          dueDate: "2025-09-03",
          category: "Legal"
        },
        {
          id: "3",
          title: "Upload brand assets",
          description: "Provide logo and brand materials",
          priority: "medium",
          status: "in-progress",
          category: "Design"
        },
        {
          id: "4",
          title: "Schedule kickoff meeting",
          description: "Book project kickoff meeting",
          priority: "medium",
          status: "completed",
          category: "Planning"
        }
      ]

      setKpiData(mockKPIs)
      setChartData(mockChartData)
      setTasks(mockTasks)
      setCompletedCount(mockTasks.filter(task => task.status === 'completed').length)
      setIsLoading(false)
    }

    // Simulate API call delay
    setTimeout(loadData, 1000)
  }, [client])

  const handleTaskToggle = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === 'completed' ? 'pending' : 'completed'
          
          if (newStatus === 'completed' && task.status !== 'completed') {
            setCompletedCount(prev => prev + 1)
          } else if (newStatus !== 'completed' && task.status === 'completed') {
            setCompletedCount(prev => prev - 1)
          }
          
          return { ...task, status: newStatus }
        }
        return task
      })
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
      case 'low':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0
  const pendingTasks = tasks.filter(task => task.status !== 'completed')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex">
          {/* Main Content Skeleton */}
          <div className="flex-1 p-6">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow animate-pulse">
                  <div className="h-24" />
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow animate-pulse">
              <div className="h-64" />
            </div>
          </div>
          
          {/* Sidebar Skeleton */}
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 animate-pulse">
                  <div className="h-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Main Dashboard Content */}
        <div className={`flex-1 transition-all duration-300 ${tasksPanelCollapsed ? 'mr-0' : 'mr-80'}`}>
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-xl">{getInitials(client.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Welcome, {client.name.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      {client.company && `${client.company} • `}Dashboard with task management
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setTasksPanelCollapsed(!tasksPanelCollapsed)}
                  className="md:hidden"
                >
                  {tasksPanelCollapsed ? 'Show Tasks' : 'Hide Tasks'}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active Project
                </Badge>
                <Badge variant="outline">
                  Hybrid Mode
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {completedCount}/{tasks.length} Tasks Complete
                </Badge>
              </div>
            </div>

            {/* KPI Cards */}
            {dashboardConfig.layout?.enableKPIs && getWidgetVisibility(dashboardConfig, 'kpiCards') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardConfig.kpis?.slice(0, 4).map((kpi, index) => {
                  const isVisible = getWidgetVisibility(dashboardConfig, 'kpiCards', index)
                  if (!isVisible) return null
                  
                  return (
                    <Card key={kpi.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                            <Target className="w-4 h-4" />
                          </div>
                          {kpi.type === 'percentage' && (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <TrendingUp className="w-4 h-4" />
                              +5%
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {kpi.value}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {kpi.title}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Main Chart */}
            {dashboardConfig.layout?.enableCharts && getWidgetVisibility(dashboardConfig, 'chartSections.performanceTrends') && (
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
                          className="w-full bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600"
                          style={{ 
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

            {/* Quick Actions for Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:hidden mb-8">
              {[
                { title: "Contact Support", subtitle: "Get help", icon: <MessageSquare className="w-5 h-5" />, key: "contactSupport" },
                { title: "View Tasks", subtitle: `${pendingTasks.length} pending`, icon: <FileText className="w-5 h-5" />, key: "viewTasks" },
                { title: "Schedule Meeting", subtitle: "Book time", icon: <Calendar className="w-5 h-5" />, key: "scheduleMeeting" }
              ].map((action) => {
                const isVisible = getWidgetVisibility(dashboardConfig, `quickActions.${action.key}`)
                if (!isVisible) return null
                
                return (
                  <Button 
                    key={action.key}
                    variant="outline" 
                    className="h-auto p-4 justify-start"
                  >
                    {action.icon}
                    <div className="text-left ml-3">
                      <div className="font-medium">
                        {action.title}
                      </div>
                      <div className="text-sm text-gray-500">{action.subtitle}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tasks Sidebar */}
        <div className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ${
          tasksPanelCollapsed ? 'translate-x-full' : 'translate-x-0'
        } md:relative md:translate-x-0 z-10`}>
          <div className="p-6 h-full overflow-y-auto">
            {/* Tasks Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Tasks
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {completedCount} of {tasks.length} completed
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTasksPanelCollapsed(!tasksPanelCollapsed)}
                className="md:hidden"
              >
                {tasksPanelCollapsed ? <ChevronDown /> : <ChevronUp />}
              </Button>
            </div>

            {/* Progress Bar */}
            {getWidgetVisibility(dashboardConfig, 'progressOverview') && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Task List */}
            {getWidgetVisibility(dashboardConfig, 'taskList') && (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <Card 
                    key={task.id} 
                    className={`transition-all duration-200 hover:shadow-sm ${
                      task.status === 'completed' ? 'opacity-75' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleTaskToggle(task.id)}
                          className="mt-0.5"
                        >
                          {getStatusIcon(task.status)}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-medium mb-1 ${
                            task.status === 'completed' 
                              ? 'line-through text-gray-500 dark:text-gray-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.title}
                            {task.priority === 'high' && (
                              <Star className="w-3 h-3 text-yellow-500 inline ml-1" />
                            )}
                          </h3>
                          
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {task.description}
                          </p>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                            
                            {task.dueDate && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Quick Task Actions */}
            <div className="mt-6 space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Get Help with Tasks
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Review
              </Button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {!tasksPanelCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
            onClick={() => setTasksPanelCollapsed(true)}
          />
        )}
      </div>

      {/* Footer */}
      <div className={`text-center py-4 ${tasksPanelCollapsed ? 'mr-0' : 'mr-80'} transition-all duration-300`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()} • Hybrid Mode
        </p>
      </div>

      {/* Floating Chat Widget */}
      <ChatWidget 
        clientId={client.id || ''}
        clientName={client.name}
        position="bottom-right"
        userType="client"
        isGuestMode={true}
      />
    </div>
  )
}