"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Copy, ExternalLink, Settings, BarChart3, CheckSquare, Layers, ArrowLeft,
  Palette, Type, Image, Video, FileText, Plus, Trash2, GripVertical,
  Save, Eye, Upload, Download, Star, Target, Clock, MessageSquare, Calendar, CheckCircle
} from "lucide-react"
import { 
  clientOperations, 
  dashboardContentOperations,
  dashboardAssetOperations,
  type Client, 
  type DashboardConfig,
  type DashboardContent 
} from "@/lib/supabase"
import { DashboardAdvancedEditor } from "@/components/dashboard-advanced-editor"
import { toast } from "sonner"

interface DashboardContentEditorProps {
  client: Client
  onClientUpdated: (updatedClient: Client) => void
  onBack: () => void
}

export function DashboardContentEditor({ client, onClientUpdated, onBack }: DashboardContentEditorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [currentClient, setCurrentClient] = useState<Client>(client)
  const [editingElement, setEditingElement] = useState<string | null>(null)
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(
    client.dashboard_config || {
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
  )

  const [dashboardContent, setDashboardContent] = useState<DashboardContent[]>([])

  useEffect(() => {
    loadDashboardContent()
  }, [currentClient.id])

  const loadDashboardContent = async () => {
    if (!currentClient.id) return
    
    try {
      const content = await dashboardContentOperations.getByClientId(currentClient.id)
      setDashboardContent(content)
    } catch (error) {
      console.error('Error loading dashboard content:', error)
    }
  }

  const getDashboardUrl = () => {
    return `${window.location.origin}/client-dashboard/${currentClient.dashboard_slug}`
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getDashboardUrl())
      toast.success("Dashboard URL copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy URL")
    }
  }

  const handleOpenDashboard = () => {
    window.open(getDashboardUrl(), '_blank')
  }

  const handleSaveChanges = async () => {
    if (!currentClient.id) return
    
    setIsLoading(true)
    try {
      // Update both dashboard config and view mode
      const updatedClient = await clientOperations.update(currentClient.id, {
        dashboard_config: dashboardConfig,
        view_mode: currentClient.view_mode
      })
      
      setCurrentClient(updatedClient)
      onClientUpdated(updatedClient)
      toast.success("Dashboard configuration saved successfully!")
    } catch (error) {
      toast.error("Failed to save dashboard configuration")
      console.error('Update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateThemeColor = (colorType: 'primaryColor' | 'secondaryColor' | 'backgroundColor', color: string) => {
    setDashboardConfig(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [colorType]: color
      }
    }))
  }

  const updateBranding = (key: keyof NonNullable<DashboardConfig['branding']>, value: any) => {
    setDashboardConfig(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        [key]: value
      }
    }))
  }

  const updateLayout = (key: keyof NonNullable<DashboardConfig['layout']>, value: any) => {
    setDashboardConfig(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [key]: value
      }
    }))
  }

  const updateKPI = (index: number, updates: Partial<NonNullable<DashboardConfig['kpis']>[number]>) => {
    setDashboardConfig(prev => ({
      ...prev,
      kpis: prev.kpis?.map((kpi, i) => i === index ? { ...kpi, ...updates } : kpi) || []
    }))
  }

  const addKPI = () => {
    const newKPI = {
      id: `kpi_${Date.now()}`,
      title: "New KPI",
      value: "0",
      type: "number" as const
    }
    
    setDashboardConfig(prev => ({
      ...prev,
      kpis: [...(prev.kpis || []), newKPI]
    }))
  }

  const removeKPI = (index: number) => {
    setDashboardConfig(prev => ({
      ...prev,
      kpis: prev.kpis?.filter((_, i) => i !== index) || []
    }))
  }

  // Inline editing helper functions
  const startEditing = (elementId: string) => {
    setEditingElement(elementId)
  }

  const stopEditing = () => {
    setEditingElement(null)
  }

  const isEditing = (elementId: string) => {
    return editingElement === elementId
  }

  // Inline editor component
  const InlineEditor = ({ 
    value, 
    onChange, 
    elementId, 
    className = "",
    multiline = false,
    placeholder = "Click to edit..."
  }: {
    value: string
    onChange: (value: string) => void
    elementId: string
    className?: string
    multiline?: boolean
    placeholder?: string
  }) => {
    if (isEditing(elementId)) {
      return multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={stopEditing}
          onKeyDown={(e) => {
            if (e.key === 'Escape') stopEditing()
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              stopEditing()
            }
          }}
          className={`bg-white border-2 border-blue-500 rounded px-2 py-1 outline-none resize-none ${className}`}
          placeholder={placeholder}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={stopEditing}
          onKeyDown={(e) => {
            if (e.key === 'Escape') stopEditing()
            if (e.key === 'Enter') stopEditing()
          }}
          className={`bg-white border-2 border-blue-500 rounded px-2 py-1 outline-none ${className}`}
          placeholder={placeholder}
          autoFocus
        />
      )
    }

    return (
      <div
        onClick={() => startEditing(elementId)}
        className={`cursor-pointer hover:bg-blue-50 hover:border hover:border-blue-200 rounded px-1 transition-all duration-200 ${className} ${value ? '' : 'text-gray-400'}`}
        title="Click to edit"
      >
        {value || placeholder}
      </div>
    )
  }

  // Color picker inline editor
  const InlineColorPicker = ({ 
    value, 
    onChange, 
    elementId, 
    className = ""
  }: {
    value: string
    onChange: (value: string) => void
    elementId: string
    className?: string
  }) => {
    if (isEditing(elementId)) {
      return (
        <div className="flex items-center gap-2 bg-white border-2 border-blue-500 rounded p-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={stopEditing}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter') stopEditing()
            }}
            className="px-2 py-1 border rounded text-sm font-mono"
            autoFocus
          />
        </div>
      )
    }

    return (
      <div
        onClick={() => startEditing(elementId)}
        className={`cursor-pointer hover:ring-2 hover:ring-blue-200 rounded p-1 transition-all duration-200 ${className}`}
        title="Click to edit color"
      >
        <div 
          className="w-6 h-6 rounded border-2 border-white shadow-sm"
          style={{ backgroundColor: value }}
        />
      </div>
    )
  }









  const renderPreview = () => {
    // Create a client object with updated configuration for preview
    const previewClient: Client = {
      ...currentClient,
      dashboard_config: dashboardConfig
    }

    return (
      <div className="overflow-hidden">
        <div className="bg-white min-h-[400px] overflow-hidden">
          {/* Import the actual dashboard components to ensure exact match */}
          {currentClient.view_mode === 'dashboard' && (
            <div className="dashboard-preview-wrapper">
              {/* Scale down to fit but maintain exact layout */}
              <div 
                style={{ 
                  transform: 'scale(0.75)',
                  transformOrigin: 'top left',
                  width: '133.33%'
                }}
              >
                <div 
                  className="min-h-[400px]"
                  style={{ backgroundColor: dashboardConfig.theme?.backgroundColor || "#f9fafb" }}
                >
                  <div className="container mx-auto px-6 py-8">
                    {/* Exact same header as DashboardMode */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-4">
                        {dashboardConfig.branding?.showLogo && dashboardConfig.branding?.logoUrl && (
                          <img 
                            src={dashboardConfig.branding.logoUrl} 
                            alt="Logo" 
                            className="w-16 h-16 object-contain rounded-lg"
                          />
                        )}
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium">
                          {currentClient.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <InlineEditor
                            value={dashboardConfig.branding?.customWelcomeMessage || ''}
                            onChange={(value) => updateBranding('customWelcomeMessage', value)}
                            elementId="preview-welcome"
                            className="text-3xl font-bold mb-0"
                            placeholder={`Welcome back, ${currentClient.name.split(' ')[0]}!`}
                          />
                          <p className="text-gray-600">
                            {dashboardConfig.branding?.showCompanyName && currentClient.company ? 
                              `${currentClient.company} • ` : ''}Here's your dashboard overview
                          </p>
                          {dashboardConfig.branding?.companyDescription && (
                            <InlineEditor
                              value={dashboardConfig.branding?.companyDescription || ''}
                              onChange={(value) => updateBranding('companyDescription', value)}
                              elementId="preview-description"
                              className="text-sm text-gray-500 mt-1 block"
                              multiline={true}
                              placeholder="Company description..."
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Active Project
                        </Badge>
                        <Badge variant="outline">
                          Dashboard Mode
                        </Badge>
                      </div>
                    </div>

                    {/* Exact same KPI grid as DashboardMode */}
                    {dashboardConfig.layout?.enableKPIs && dashboardConfig.kpis && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {dashboardConfig.kpis.map((kpi, index) => (
                          <div key={kpi.id} className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow group">
                            <div className="flex items-center justify-between mb-4">
                              <div 
                                className="p-2 rounded-full"
                                style={{ 
                                  backgroundColor: `${dashboardConfig.theme?.primaryColor || "#3b82f6"}20`,
                                  color: dashboardConfig.theme?.primaryColor || "#3b82f6"
                                }}
                              >
                                <Target className="w-4 h-4" />
                              </div>
                              <button
                                onClick={() => removeKPI(index)}
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm transition-opacity"
                                title="Remove KPI"
                              >
                                ×
                              </button>
                            </div>
                            <div>
                              <InlineEditor
                                value={kpi.value}
                                onChange={(value) => updateKPI(index, { value })}
                                elementId={`preview-kpi-value-${index}`}
                                className="text-2xl font-bold mb-1 block"
                                placeholder="0"
                              />
                              <InlineEditor
                                value={kpi.title}
                                onChange={(value) => updateKPI(index, { title: value })}
                                elementId={`preview-kpi-title-${index}`}
                                className="text-sm text-gray-600 block"
                                placeholder="KPI Title"
                              />
                              {kpi.description && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {kpi.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Exact same chart as DashboardMode */}
                    {dashboardConfig.layout?.enableCharts && (
                      <div className="bg-white rounded-lg p-6 shadow mb-8">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Performance Overview
                          </h3>
                          <button
                            onClick={() => updateLayout('enableCharts', false)}
                            className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                          >
                            Hide
                          </button>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-4">
                          {[40, 30, 20, 28, 19, 24, 35].map((height, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div 
                                className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                                style={{ 
                                  backgroundColor: dashboardConfig.theme?.primaryColor || "#3b82f6",
                                  height: `${(height / 40) * 200}px`,
                                  minHeight: '20px'
                                }}
                              />
                              <p className="text-sm text-gray-600 mt-2">
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show real content grid like DashboardMode */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Recent Activity - exact same as DashboardMode */}
                      {dashboardConfig.layout?.enableActivity && (
                        <div className="bg-white rounded-lg p-6 shadow">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              Recent Activity
                            </h3>
                            <button
                              onClick={() => updateLayout('enableActivity', false)}
                              className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                            >
                              Hide
                            </button>
                          </div>
                          <div className="space-y-4">
                            {[
                              { title: "Project milestone completed", time: "2 hours ago", type: "success" },
                              { title: "New message from team", time: "4 hours ago", type: "info" },
                              { title: "Weekly report generated", time: "1 day ago", type: "neutral" },
                              { title: "Budget review scheduled", time: "2 days ago", type: "warning" }
                            ].map((activity, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                <div className={`w-2 h-2 rounded-full ${
                                  activity.type === 'success' ? 'bg-green-500' :
                                  activity.type === 'info' ? 'bg-blue-500' :
                                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                                }`} />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {activity.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {activity.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Actions - exact same as DashboardMode */}
                      <div className="bg-white rounded-lg p-6 shadow">
                        <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
                          <Target className="w-5 h-5" />
                          Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { title: "View Messages", icon: <MessageSquare className="w-5 h-5" />, color: "blue" },
                            { title: "Download Reports", icon: <FileText className="w-5 h-5" />, color: "green" },
                            { title: "Schedule Meeting", icon: <Calendar className="w-5 h-5" />, color: "purple" },
                            { title: "Add KPI", icon: <Target className="w-5 h-5" />, color: "orange" }
                          ].map((action, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                if (action.title === "Add KPI") addKPI()
                              }}
                              className={`p-4 rounded-lg border-2 border-dashed transition-all hover:border-solid hover:shadow-md ${
                                action.color === 'blue' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' :
                                action.color === 'green' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' :
                                action.color === 'purple' ? 'border-purple-300 hover:border-purple-500 hover:bg-purple-50' :
                                'border-orange-300 hover:border-orange-500 hover:bg-orange-50'
                              }`}
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
                                <span className="text-sm font-medium text-gray-900">
                                  {action.title}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer - exact same as DashboardMode */}
                    <div className="mt-12 text-center">
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleString()} • Dashboard Mode
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentClient.view_mode === 'task' && (
            <div className="task-preview-wrapper">
              {/* Scale down to fit but maintain exact layout */}
              <div 
                style={{ 
                  transform: 'scale(0.75)',
                  transformOrigin: 'top left',
                  width: '133.33%'
                }}
              >
                <div className="min-h-screen bg-gray-50">
                  <div className="container mx-auto px-6 py-8 max-w-4xl">
                    {/* Exact same header as TaskMode */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium">
                          {currentClient.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <InlineEditor
                            value={dashboardConfig.branding?.customWelcomeMessage || ''}
                            onChange={(value) => updateBranding('customWelcomeMessage', value)}
                            elementId="task-preview-welcome"
                            className="text-3xl font-bold mb-2"
                            placeholder={`Welcome, ${currentClient.name.split(' ')[0]}!`}
                          />
                          <p className="text-gray-600 mb-4">
                            {dashboardConfig.branding?.showCompanyName && currentClient.company ? 
                              `${currentClient.company} • ` : ''}Task Management Dashboard
                          </p>
                          {dashboardConfig.branding?.companyDescription && (
                            <InlineEditor
                              value={dashboardConfig.branding?.companyDescription || ''}
                              onChange={(value) => updateBranding('companyDescription', value)}
                              elementId="task-preview-description"
                              className="text-sm text-gray-500 block"
                              multiline={true}
                              placeholder="Company description..."
                            />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Task Mode
                          </Badge>
                          <Badge variant="outline">
                            6 Tasks Active
                          </Badge>
                        </div>
                        <select
                          value={currentClient.view_mode}
                          onChange={(e) => setCurrentClient(prev => ({ ...prev, view_mode: e.target.value as 'dashboard' | 'task' | 'hybrid' }))}
                          className="text-sm border rounded px-3 py-2 bg-white cursor-pointer hover:bg-gray-50"
                        >
                          <option value="dashboard">Dashboard Mode</option>
                          <option value="task">Task Mode</option>
                          <option value="hybrid">Hybrid Mode</option>
                        </select>
                      </div>

                      {/* Progress Overview - exact same as TaskMode */}
                      <div className="bg-white rounded-lg p-6 shadow mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold">Overall Progress</h2>
                          <span className="text-2xl font-bold text-blue-600">67%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="h-3 rounded-full transition-all duration-300" 
                            style={{ 
                              backgroundColor: dashboardConfig.theme?.primaryColor || "#3b82f6",
                              width: '67%' 
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>4 of 6 tasks completed</span>
                          <span>2 remaining</span>
                        </div>
                      </div>
                    </div>

                    {/* Task List - exact same structure as TaskMode */}
                    <div className="space-y-4">
                      {[
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
                        }
                      ].map((task, index) => (
                        <div key={task.id} className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow group">
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              {task.status === 'completed' ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : task.status === 'in-progress' ? (
                                <Clock className="w-5 h-5 text-yellow-500" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <InlineEditor
                                    value={task.title}
                                    onChange={() => {}} // Demo mode
                                    elementId={`task-preview-title-${index}`}
                                    className="text-lg font-semibold text-gray-900 block"
                                    placeholder="Task title"
                                  />
                                  <InlineEditor
                                    value={task.description}
                                    onChange={() => {}} // Demo mode
                                    elementId={`task-preview-desc-${index}`}
                                    className="text-gray-600 mt-1 block"
                                    multiline={true}
                                    placeholder="Task description"
                                  />
                                </div>
                                
                                <div className="flex items-center gap-2 ml-4">
                                  <Badge className={`${
                                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                  </Badge>
                                  
                                  <Badge variant="outline" className="text-xs">
                                    {task.category}
                                  </Badge>
                                </div>
                              </div>
                              
                              {task.dueDate && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Calendar className="w-4 h-4" />
                                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Task Statistics - exact same as TaskMode */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      <div className="bg-white rounded-lg p-6 shadow text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
                        <div className="text-sm text-gray-600">Total Tasks</div>
                      </div>
                      <div className="bg-white rounded-lg p-6 shadow text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">4</div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="bg-white rounded-lg p-6 shadow text-center">
                        <div className="text-3xl font-bold text-yellow-600 mb-2">2</div>
                        <div className="text-sm text-gray-600">In Progress</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 text-center">
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleString()} • Task Mode
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentClient.view_mode === 'hybrid' && (
            <div className="hybrid-preview-wrapper">
              {/* Scale down to fit layout */}
              <div style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: '133.33%' }}>
                <div className="min-h-screen bg-gray-50">
                  <div className="container mx-auto px-6 py-8">
                    {/* Header matching HybridMode */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium">
                          {currentClient.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <InlineEditor
                            value={dashboardConfig.branding?.customWelcomeMessage || ''}
                            onChange={(value) => updateBranding('customWelcomeMessage', value)}
                            elementId="hybrid-preview-welcome"
                            className="text-3xl font-bold mb-2"
                            placeholder={`Welcome, ${currentClient.name.split(' ')[0]}!`}
                          />
                          <p className="text-gray-600">Dashboard & Task Management</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">Hybrid Mode</Badge>
                        <Badge variant="outline">Combined View</Badge>
                      </div>
                    </div>

                    {/* Split Layout like real HybridMode */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      {/* KPIs Section */}
                      {dashboardConfig.layout?.enableKPIs && dashboardConfig.kpis && (
                        <div className="bg-white rounded-lg p-6 shadow">
                          <h3 className="text-lg font-semibold mb-4">Quick Metrics</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {dashboardConfig.kpis.slice(0, 4).map((kpi, index) => (
                              <div key={kpi.id} className="border rounded-lg p-3">
                                <InlineEditor
                                  value={kpi.value}
                                  onChange={(value) => updateKPI(index, { value })}
                                  elementId={`hybrid-preview-kpi-${index}`}
                                  className="text-lg font-bold block mb-1"
                                  placeholder="0"
                                />
                                <InlineEditor
                                  value={kpi.title}
                                  onChange={(value) => updateKPI(index, { title: value })}
                                  elementId={`hybrid-preview-title-${index}`}
                                  className="text-xs text-gray-600 block"
                                  placeholder="KPI Title"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tasks Section */}
                      <div className="bg-white rounded-lg p-6 shadow">
                        <h3 className="text-lg font-semibold mb-4">Priority Tasks</h3>
                        <div className="space-y-3">
                          {[
                            { title: "Complete onboarding", status: "pending", priority: "high" },
                            { title: "Upload assets", status: "in-progress", priority: "medium" },
                            { title: "Review contract", status: "pending", priority: "high" }
                          ].map((task, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                              <div className="w-4 h-4">
                                {task.status === 'completed' ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : task.status === 'in-progress' ? (
                                  <Clock className="w-4 h-4 text-yellow-500" />
                                ) : (
                                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                                )}
                              </div>
                              <div className="flex-1">
                                <InlineEditor
                                  value={task.title}
                                  onChange={() => {}} // Demo mode
                                  elementId={`hybrid-preview-task-${index}`}
                                  className="text-sm font-medium block"
                                  placeholder="Task title"
                                />
                                <Badge className={`text-xs mt-1 ${
                                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Chart Section */}
                    {dashboardConfig.layout?.enableCharts && (
                      <div className="bg-white rounded-lg p-6 shadow mb-8">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Performance Trends
                        </h3>
                        <div className="h-32 flex items-end justify-between gap-2">
                          {[30, 25, 35, 28, 40].map((height, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div 
                                className="w-full rounded-t-md"
                                style={{ 
                                  backgroundColor: dashboardConfig.theme?.primaryColor || "#3b82f6",
                                  height: `${(height / 40) * 100}px`,
                                  minHeight: '10px'
                                }}
                              />
                              <p className="text-xs text-gray-600 mt-1">
                                {['M', 'T', 'W', 'T', 'F'][index]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleString()} • Hybrid Mode
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Announcements for all modes */}
          {dashboardConfig.announcements && dashboardConfig.announcements.filter(a => a.isActive).length > 0 && (
            <div className="px-4 pb-4">
              <h3 className="text-xs font-semibold mb-2">Announcements</h3>
              <div className="space-y-1">
                {dashboardConfig.announcements.filter(a => a.isActive).slice(0, 1).map((announcement, index) => (
                  <div key={announcement.id} className={`p-2 rounded text-xs ${
                    announcement.type === 'success' ? 'bg-green-100 text-green-800' :
                    announcement.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    announcement.type === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    <div className="font-medium">{announcement.title}</div>
                    <div className="text-xs opacity-80">{announcement.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            📝 Click any text to edit • 🎨 Click colors to change • ⚙️ Use buttons to toggle sections<br/>
            ✨ Preview matches exactly what your clients will see
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Clients
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Dashboard Content Editor - {currentClient.name}</h2>
            <p className="text-muted-foreground">
              Customize every aspect of your client's dashboard experience
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCopyUrl}>
            <Copy className="w-4 h-4 mr-2" />
            Copy URL
          </Button>
          <Button variant="outline" onClick={handleOpenDashboard}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Main Content Area - Full Width Preview */}
      <div className="w-full transition-all duration-300">
        {showPreview && (
          <div className="flex-1 transition-all duration-300">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Live Preview with Inline Editing</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {currentClient.view_mode?.charAt(0).toUpperCase() + currentClient.view_mode?.slice(1)} Mode • 
                  Previewing as <span className="font-medium">{currentClient.name}</span> •
                  Click any text to edit directly
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  🔄 Updates in real-time
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleOpenDashboard}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Full View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowPreview(false)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Hide Preview
                </Button>
              </div>
            </div>
            <div className="border rounded-lg bg-white shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 border-b">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="ml-2 font-mono text-xs text-gray-500">
                    {getDashboardUrl()}
                  </span>
                </div>
              </div>
              <div className="max-h-[580px] overflow-y-auto">
                {renderPreview()}
              </div>
            </div>
          </div>
        )}

        {/* Collapsed State (only when preview is hidden) */}
        {!showPreview && (
          <div className="w-full max-w-4xl mx-auto transition-all duration-300 border bg-gradient-to-b from-gray-50 to-gray-100/50 rounded-lg">
            <div className="p-6 h-full overflow-y-auto">
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Preview Hidden</h3>
                <p className="text-sm text-gray-600 mt-1">Click "Show Preview" to resume inline editing</p>
              </div>
              
              <div className="text-center py-12">
                <div className="mb-4">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Inline Editing Available</h4>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Show the preview to start editing text, colors, and sections directly within the dashboard view.
                  </p>
                </div>
                <Button onClick={() => setShowPreview(true)} className="gap-2">
                  <Eye className="w-4 h-4" />
                  Show Preview to Start Editing
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}