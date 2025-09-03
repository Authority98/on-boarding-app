"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { type Client } from '@/lib/supabase'
import { getWidgetVisibility } from '@/lib/widget-visibility'
import { 
  CheckCircle, 
  Circle,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Calendar,
  MessageSquare,
  ChevronRight,
  Star
} from "lucide-react"
import { ChatWidget } from "@/components/chat-widget"

interface TaskModeProps {
  client: Client
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

export function TaskMode({ client }: TaskModeProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [completedCount, setCompletedCount] = useState(0)

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
      enableProgressOverview: true,
      enableTaskStats: true,
      widgetVisibility: {
        progressOverview: true,
        taskList: true,
        taskStats: {
          totalTasks: true,
          completedTasks: true,
          inProgressTasks: true
        }
      }
    }
  }

  useEffect(() => {
    // Simulate loading task data
    const loadTasks = () => {
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Complete onboarding questionnaire",
          description: "Fill out the initial client information form to help us understand your needs better.",
          priority: "high",
          status: "pending",
          dueDate: "2025-09-01",
          category: "Onboarding"
        },
        {
          id: "2",
          title: "Review and sign service agreement",
          description: "Please review the service agreement document and provide your digital signature.",
          priority: "high",
          status: "pending",
          dueDate: "2025-09-03",
          category: "Legal"
        },
        {
          id: "3",
          title: "Upload brand assets",
          description: "Provide your logo, brand colors, and any existing marketing materials.",
          priority: "medium",
          status: "in-progress",
          category: "Design"
        },
        {
          id: "4",
          title: "Schedule kickoff meeting",
          description: "Book a time for our project kickoff meeting with the team.",
          priority: "medium",
          status: "completed",
          category: "Planning"
        },
        {
          id: "5",
          title: "Set up project communication channels",
          description: "Join our Slack workspace and familiarize yourself with communication protocols.",
          priority: "low",
          status: "completed",
          category: "Communication"
        },
        {
          id: "6",
          title: "Provide website content",
          description: "Submit all text content, images, and multimedia for your website.",
          priority: "medium",
          status: "pending",
          dueDate: "2025-09-10",
          category: "Content"
        }
      ]

      setTasks(mockTasks)
      setCompletedCount(mockTasks.filter(task => task.status === 'completed').length)
      setIsLoading(false)
    }

    // Simulate API call delay
    setTimeout(loadTasks, 800)
  }, [client])

  const handleTaskToggle = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === 'completed' ? 'pending' : 'completed'
          
          // Update completed count
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
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48" />
              </div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
          </div>

          {/* Tasks Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <div className="flex items-start gap-4">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl">{getInitials(client.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardConfig.branding?.customWelcomeMessage || 
                  `Hello, ${client.name.split(' ')[0]}!`}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {dashboardConfig.branding?.showCompanyName && client.company ? 
                  `${client.company} • ` : ''}Let's get your tasks completed
              </p>
              {dashboardConfig.branding?.companyDescription && (
                <p className="text-sm text-gray-500 mt-1">
                  {dashboardConfig.branding.companyDescription}
                </p>
              )}
            </div>
          </div>
          
          {/* Progress Section */}
          {getWidgetVisibility(dashboardConfig, 'progressOverview') && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Your Progress
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {completedCount} of {tasks.length} tasks completed
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {progressPercentage}%
                    </div>
                    <Badge variant="outline">Task Mode</Badge>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { title: "Contact Support", subtitle: "Get help with tasks", icon: <MessageSquare className="w-5 h-5" />, key: "contactSupport" },
            { title: "Download Resources", subtitle: "Access project files", icon: <Download className="w-5 h-5" />, key: "downloadResources" },
            { title: "Schedule Meeting", subtitle: "Book time with team", icon: <Calendar className="w-5 h-5" />, key: "scheduleMeeting" }
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

        {/* Task List */}
        {getWidgetVisibility(dashboardConfig, 'taskList') && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Your Tasks
            </h2>
            
            {tasks.map((task) => (
              <Card 
                key={task.id} 
                className={`transition-all duration-200 hover:shadow-md ${
                  task.status === 'completed' ? 'opacity-75' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleTaskToggle(task.id)}
                      className="mt-1"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${
                          task.status === 'completed' 
                            ? 'line-through text-gray-500 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                          {task.priority === 'high' && (
                            <Star className="w-4 h-4 text-yellow-500 inline ml-2" />
                          )}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {task.description}
                      </p>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </Badge>
                        
                        <Badge variant="outline">
                          {task.category}
                        </Badge>
                        
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                        
                        {task.status === 'in-progress' && (
                          <div className="flex items-center gap-1 text-sm text-yellow-600">
                            <Clock className="w-4 h-4" />
                            In Progress
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

        {/* Help Section */}
        {getWidgetVisibility(dashboardConfig, 'helpSection') && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Need Help?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    If you have questions about any of these tasks or need assistance, 
                    don't hesitate to reach out to our team. We're here to help you succeed!
                  </p>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleString()} • Task Mode
          </p>
        </div>
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