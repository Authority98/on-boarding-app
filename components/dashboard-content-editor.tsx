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
  Save, Eye, Upload, Download, Star, Target, Clock
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
      <div className="p-4">
        <div className="rounded-lg border bg-white min-h-[400px] overflow-hidden">
          {/* View Mode Specific Preview */}
          {currentClient.view_mode === 'dashboard' && (
            <div
              className="p-4 min-h-[400px]"
              style={{ 
                backgroundColor: dashboardConfig.theme?.backgroundColor || "#ffffff",
                color: dashboardConfig.theme?.textColor || "#000000"
              }}
            >
              {/* Dashboard Mode Preview with Inline Editing */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  {dashboardConfig.branding?.showLogo && dashboardConfig.branding?.logoUrl && (
                    <img 
                      src={dashboardConfig.branding.logoUrl} 
                      alt="Logo" 
                      className="w-8 h-8 object-contain rounded"
                    />
                  )}
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                    {currentClient.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <InlineEditor
                      value={dashboardConfig.branding?.customWelcomeMessage || ''}
                      onChange={(value) => updateBranding('customWelcomeMessage', value)}
                      elementId="welcome-message"
                      className="text-lg font-bold leading-tight"
                      placeholder={`Welcome back, ${currentClient.name.split(' ')[0]}!`}
                    />
                    <p className="text-xs text-gray-600">
                      {dashboardConfig.branding?.showCompanyName && currentClient.company ? 
                        `${currentClient.company} • ` : ''}Dashboard overview
                    </p>
                  </div>
                  {/* Theme Colors Inline Editor */}
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">Theme:</div>
                    <InlineColorPicker
                      value={dashboardConfig.theme?.primaryColor || "#3b82f6"}
                      onChange={(color) => updateThemeColor('primaryColor', color)}
                      elementId="primary-color"
                    />
                    <InlineColorPicker
                      value={dashboardConfig.theme?.secondaryColor || "#64748b"}
                      onChange={(color) => updateThemeColor('secondaryColor', color)}
                      elementId="secondary-color"
                    />
                  </div>
                </div>
                {/* Company Description Inline Editor */}
                <InlineEditor
                  value={dashboardConfig.branding?.companyDescription || ''}
                  onChange={(value) => updateBranding('companyDescription', value)}
                  elementId="company-description"
                  className="text-xs text-gray-500 mb-3 block"
                  multiline={true}
                  placeholder="Add company description..."
                />
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    Active Project
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Dashboard Mode
                  </Badge>
                  {/* View Mode Selector */}
                  <select
                    value={currentClient.view_mode}
                    onChange={(e) => setCurrentClient(prev => ({ ...prev, view_mode: e.target.value as 'dashboard' | 'task' | 'hybrid' }))}
                    className="text-xs border rounded px-2 py-1 bg-white cursor-pointer hover:bg-gray-50"
                  >
                    <option value="dashboard">Dashboard Mode</option>
                    <option value="task">Task Mode</option>
                    <option value="hybrid">Hybrid Mode</option>
                  </select>
                </div>
              </div>

              {/* KPIs Preview with Inline Editing */}
              {dashboardConfig.layout?.enableKPIs && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">Key Performance Indicators</h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={addKPI}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                        title="Add KPI"
                      >
                        + Add KPI
                      </button>
                      <button
                        onClick={() => updateLayout('enableKPIs', false)}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                        title="Hide KPIs"
                      >
                        Hide
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(dashboardConfig.kpis || []).map((kpi, index) => (
                      <div 
                        key={kpi.id}
                        className="border rounded p-2 relative group hover:border-blue-300 transition-colors"
                        style={{ borderColor: `${dashboardConfig.theme?.primaryColor || "#3b82f6"}40` }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Target className="w-3 h-3" style={{ color: dashboardConfig.theme?.primaryColor || "#3b82f6" }} />
                          <div className="flex items-center gap-1">
                            <select
                              value={kpi.type}
                              onChange={(e) => updateKPI(index, { type: e.target.value as any })}
                              className="text-xs border rounded px-1 bg-white"
                            >
                              <option value="percentage">%</option>
                              <option value="number">#</option>
                              <option value="currency">$</option>
                              <option value="text">Text</option>
                            </select>
                            <button
                              onClick={() => removeKPI(index)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition-opacity"
                              title="Remove KPI"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <InlineEditor
                          value={kpi.value}
                          onChange={(value) => updateKPI(index, { value })}
                          elementId={`kpi-value-${index}`}
                          className="text-sm font-bold block mb-1"
                          placeholder="0"
                        />
                        <InlineEditor
                          value={kpi.title}
                          onChange={(value) => updateKPI(index, { title: value })}
                          elementId={`kpi-title-${index}`}
                          className="text-xs text-gray-600 leading-tight block"
                          placeholder="KPI Title"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Charts and Activity sections with toggles */}
              {dashboardConfig.layout?.enableCharts && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">Analytics</h3>
                    <button
                      onClick={() => updateLayout('enableCharts', false)}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="border rounded p-3 bg-gray-50 flex items-center justify-center h-20">
                    <BarChart3 className="w-6 h-6 text-gray-400 mr-2" />
                    <p className="text-xs text-gray-500">Performance Chart</p>
                  </div>
                </div>
              )}

              {dashboardConfig.layout?.enableActivity && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">Recent Activity</h3>
                    <button
                      onClick={() => updateLayout('enableActivity', false)}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Project milestone completed</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>New message from team</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Section Buttons for disabled sections */}
              <div className="flex flex-wrap gap-2 mt-4">
                {!dashboardConfig.layout?.enableKPIs && (
                  <button
                    onClick={() => updateLayout('enableKPIs', true)}
                    className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    + Add KPIs
                  </button>
                )}
                {!dashboardConfig.layout?.enableCharts && (
                  <button
                    onClick={() => updateLayout('enableCharts', true)}
                    className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    + Add Charts
                  </button>
                )}
                {!dashboardConfig.layout?.enableActivity && (
                  <button
                    onClick={() => updateLayout('enableActivity', true)}
                    className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    + Add Activity
                  </button>
                )}
              </div>
            </div>
          )}

          {currentClient.view_mode === 'task' && (
            <div
              className="p-4 min-h-[400px]"
              style={{ 
                backgroundColor: dashboardConfig.theme?.backgroundColor || "#ffffff",
                color: dashboardConfig.theme?.textColor || "#000000"
              }}
            >
              {/* Task Mode Preview with Comprehensive Inline Editing */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  {dashboardConfig.branding?.showLogo && dashboardConfig.branding?.logoUrl && (
                    <img 
                      src={dashboardConfig.branding.logoUrl} 
                      alt="Logo" 
                      className="w-8 h-8 object-contain rounded"
                    />
                  )}
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                    {currentClient.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <InlineEditor
                      value={dashboardConfig.branding?.customWelcomeMessage || ''}
                      onChange={(value) => updateBranding('customWelcomeMessage', value)}
                      elementId="task-welcome-message"
                      className="text-lg font-bold leading-tight"
                      placeholder={`Welcome back, ${currentClient.name.split(' ')[0]}!`}
                    />
                    <p className="text-xs text-gray-600">
                      {dashboardConfig.branding?.showCompanyName && currentClient.company ? 
                        `${currentClient.company} • ` : ''}Task Management
                    </p>
                  </div>
                  {/* Theme Colors Inline Editor */}
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">Theme:</div>
                    <InlineColorPicker
                      value={dashboardConfig.theme?.primaryColor || "#3b82f6"}
                      onChange={(color) => updateThemeColor('primaryColor', color)}
                      elementId="task-primary-color"
                    />
                    <InlineColorPicker
                      value={dashboardConfig.theme?.secondaryColor || "#64748b"}
                      onChange={(color) => updateThemeColor('secondaryColor', color)}
                      elementId="task-secondary-color"
                    />
                  </div>
                </div>
                
                {/* Company Description Inline Editor */}
                <InlineEditor
                  value={dashboardConfig.branding?.companyDescription || ''}
                  onChange={(value) => updateBranding('companyDescription', value)}
                  elementId="task-company-description"
                  className="text-xs text-gray-500 mb-3 block"
                  multiline={true}
                  placeholder="Add company description..."
                />
                
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    Active Project
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Task Mode
                  </Badge>
                  {/* View Mode Selector */}
                  <select
                    value={currentClient.view_mode}
                    onChange={(e) => setCurrentClient(prev => ({ ...prev, view_mode: e.target.value as 'dashboard' | 'task' | 'hybrid' }))}
                    className="text-xs border rounded px-2 py-1 bg-white cursor-pointer hover:bg-gray-50"
                  >
                    <option value="dashboard">Dashboard Mode</option>
                    <option value="task">Task Mode</option>
                    <option value="hybrid">Hybrid Mode</option>
                  </select>
                </div>
              </div>

              {/* Progress Bar with Inline Editing */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold">Overall Progress</h3>
                  <InlineEditor
                    value="67%"
                    onChange={() => {}} // Placeholder for demo
                    elementId="task-progress-value"
                    className="text-sm font-medium"
                    placeholder="0%"
                  />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      backgroundColor: dashboardConfig.theme?.primaryColor || "#3b82f6",
                      width: '67%' 
                    }}
                  />
                </div>
              </div>

              {/* Task Management with Comprehensive Inline Editing */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Your Tasks</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={addKPI}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      + Add Task
                    </button>
                    <button
                      onClick={() => updateLayout('enableTasks', !dashboardConfig.layout?.enableTasks)}
                      className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors"
                    >
                      {dashboardConfig.layout?.enableTasks ? 'Hide' : 'Show'} Tasks
                    </button>
                  </div>
                </div>
                
                {/* Editable Task List */}
                {dashboardConfig.layout?.enableTasks !== false && (
                  <>
                    <div className="flex items-center gap-3 p-3 border rounded group hover:border-blue-300 transition-colors">
                      <CheckSquare className="w-4 h-4 text-green-500" />
                      <div className="flex-1">
                        <InlineEditor
                          value="Complete onboarding form"
                          onChange={() => {}} // Placeholder for demo
                          elementId="task-title-1"
                          className="text-sm font-medium block"
                          placeholder="Task title"
                        />
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <InlineEditor
                            value="Onboarding"
                            onChange={() => {}} // Placeholder for demo
                            elementId="task-category-1"
                            className="text-xs"
                            placeholder="Category"
                          />
                          <span>•</span>
                          <select className="text-xs border rounded px-1 bg-white">
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                          </select>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 text-xs">High</Badge>
                      <button className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition-opacity">
                        ×
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded group hover:border-blue-300 transition-colors">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <div className="flex-1">
                        <InlineEditor
                          value="Upload brand assets"
                          onChange={() => {}} // Placeholder for demo
                          elementId="task-title-2"
                          className="text-sm font-medium block"
                          placeholder="Task title"
                        />
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <InlineEditor
                            value="Design"
                            onChange={() => {}} // Placeholder for demo
                            elementId="task-category-2"
                            className="text-xs"
                            placeholder="Category"
                          />
                          <span>•</span>
                          <select className="text-xs border rounded px-1 bg-white">
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                            <option value="low">Low Priority</option>
                          </select>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Medium</Badge>
                      <button className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition-opacity">
                        ×
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded group hover:border-blue-300 transition-colors">
                      <Target className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <InlineEditor
                          value="Review service agreement"
                          onChange={() => {}} // Placeholder for demo
                          elementId="task-title-3"
                          className="text-sm font-medium block"
                          placeholder="Task title"
                        />
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <InlineEditor
                            value="Legal"
                            onChange={() => {}} // Placeholder for demo
                            elementId="task-category-3"
                            className="text-xs"
                            placeholder="Category"
                          />
                          <span>•</span>
                          <select className="text-xs border rounded px-1 bg-white">
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                          </select>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 text-xs">High</Badge>
                      <button className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition-opacity">
                        ×
                      </button>
                    </div>
                  </>
                )}
                
                {/* Add New Task Button */}
                <div className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                    <Plus className="w-4 h-4" />
                    Add New Task
                  </button>
                </div>
              </div>

              {/* Task Statistics with Inline Editing */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="border rounded p-2 text-center">
                  <InlineEditor
                    value="4"
                    onChange={() => {}} // Placeholder for demo
                    elementId="task-stat-total"
                    className="text-lg font-bold block"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-600">Total Tasks</p>
                </div>
                <div className="border rounded p-2 text-center">
                  <InlineEditor
                    value="1"
                    onChange={() => {}} // Placeholder for demo
                    elementId="task-stat-completed"
                    className="text-lg font-bold block"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <div className="border rounded p-2 text-center">
                  <InlineEditor
                    value="3"
                    onChange={() => {}} // Placeholder for demo
                    elementId="task-stat-pending"
                    className="text-lg font-bold block"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
              </div>
            </div>
          )}

          {currentClient.view_mode === 'hybrid' && (
            <div
              className="p-4 min-h-[400px]"
              style={{ 
                backgroundColor: dashboardConfig.theme?.backgroundColor || "#ffffff",
                color: dashboardConfig.theme?.textColor || "#000000"
              }}
            >
              {/* Hybrid Mode Preview with Comprehensive Inline Editing */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  {dashboardConfig.branding?.showLogo && dashboardConfig.branding?.logoUrl && (
                    <img 
                      src={dashboardConfig.branding.logoUrl} 
                      alt="Logo" 
                      className="w-8 h-8 object-contain rounded"
                    />
                  )}
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                    {currentClient.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <InlineEditor
                      value={dashboardConfig.branding?.customWelcomeMessage || ''}
                      onChange={(value) => updateBranding('customWelcomeMessage', value)}
                      elementId="hybrid-welcome-message"
                      className="text-lg font-bold leading-tight"
                      placeholder={`Welcome back, ${currentClient.name.split(' ')[0]}!`}
                    />
                    <p className="text-xs text-gray-600">
                      {dashboardConfig.branding?.showCompanyName && currentClient.company ? 
                        `${currentClient.company} • ` : ''}Dashboard & Tasks
                    </p>
                  </div>
                  {/* Theme Colors Inline Editor */}
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">Theme:</div>
                    <InlineColorPicker
                      value={dashboardConfig.theme?.primaryColor || "#3b82f6"}
                      onChange={(color) => updateThemeColor('primaryColor', color)}
                      elementId="hybrid-primary-color"
                    />
                    <InlineColorPicker
                      value={dashboardConfig.theme?.secondaryColor || "#64748b"}
                      onChange={(color) => updateThemeColor('secondaryColor', color)}
                      elementId="hybrid-secondary-color"
                    />
                  </div>
                </div>
                
                {/* Company Description Inline Editor */}
                <InlineEditor
                  value={dashboardConfig.branding?.companyDescription || ''}
                  onChange={(value) => updateBranding('companyDescription', value)}
                  elementId="hybrid-company-description"
                  className="text-xs text-gray-500 mb-3 block"
                  multiline={true}
                  placeholder="Add company description..."
                />
                
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    Active Project
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Hybrid Mode
                  </Badge>
                  {/* View Mode Selector */}
                  <select
                    value={currentClient.view_mode}
                    onChange={(e) => setCurrentClient(prev => ({ ...prev, view_mode: e.target.value as 'dashboard' | 'task' | 'hybrid' }))}
                    className="text-xs border rounded px-2 py-1 bg-white cursor-pointer hover:bg-gray-50"
                  >
                    <option value="dashboard">Dashboard Mode</option>
                    <option value="task">Task Mode</option>
                    <option value="hybrid">Hybrid Mode</option>
                  </select>
                </div>
              </div>

              {/* Mini KPIs with Comprehensive Inline Editing */}
              {dashboardConfig.layout?.enableKPIs && dashboardConfig.kpis && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">Quick Stats</h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={addKPI}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                        title="Add KPI"
                      >
                        + Add KPI
                      </button>
                      <button
                        onClick={() => updateLayout('enableKPIs', false)}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                        title="Hide KPIs"
                      >
                        Hide
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {dashboardConfig.kpis.slice(0, 4).map((kpi, index) => (
                      <div 
                        key={kpi.id} 
                        className="border rounded p-2 relative group hover:border-blue-300 transition-colors"
                        style={{ borderColor: `${dashboardConfig.theme?.primaryColor || "#3b82f6"}40` }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Target className="w-3 h-3" style={{ color: dashboardConfig.theme?.primaryColor || "#3b82f6" }} />
                          <div className="flex items-center gap-1">
                            <select
                              value={kpi.type}
                              onChange={(e) => updateKPI(index, { type: e.target.value as any })}
                              className="text-xs border rounded px-1 bg-white"
                            >
                              <option value="percentage">%</option>
                              <option value="number">#</option>
                              <option value="currency">$</option>
                              <option value="text">Text</option>
                            </select>
                            <button
                              onClick={() => removeKPI(index)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition-opacity"
                              title="Remove KPI"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <InlineEditor
                          value={kpi.value}
                          onChange={(value) => updateKPI(index, { value })}
                          elementId={`hybrid-kpi-value-${index}`}
                          className="text-sm font-bold block mb-1"
                          placeholder="0"
                        />
                        <InlineEditor
                          value={kpi.title}
                          onChange={(value) => updateKPI(index, { title: value })}
                          elementId={`hybrid-kpi-title-${index}`}
                          className="text-xs text-gray-600 leading-tight block"
                          placeholder="KPI Title"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Tasks with Comprehensive Inline Editing */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Priority Tasks</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={addKPI}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      + Add Task
                    </button>
                    <button
                      onClick={() => updateLayout('enableTasks', !dashboardConfig.layout?.enableTasks)}
                      className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors"
                    >
                      {dashboardConfig.layout?.enableTasks ? 'Hide' : 'Show'} Tasks
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 border rounded group hover:border-blue-300 transition-colors">
                    <CheckSquare className="w-3 h-3 text-green-500" />
                    <div className="flex-1">
                      <InlineEditor
                        value="Complete onboarding"
                        onChange={() => {}} // Placeholder for demo
                        elementId="hybrid-task-1"
                        className="text-xs font-medium block"
                        placeholder="Task title"
                      />
                      <div className="flex items-center gap-1 mt-1">
                        <InlineEditor
                          value="Onboarding"
                          onChange={() => {}} // Placeholder for demo
                          elementId="hybrid-task-category-1"
                          className="text-xs text-gray-500"
                          placeholder="Category"
                        />
                        <span className="text-xs text-gray-400">•</span>
                        <select className="text-xs border rounded px-1 bg-white">
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800 text-xs">High</Badge>
                    <button className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition-opacity">
                      ×
                    </button>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded group hover:border-blue-300 transition-colors">
                    <Clock className="w-3 h-3 text-yellow-500" />
                    <div className="flex-1">
                      <InlineEditor
                        value="Upload assets"
                        onChange={() => {}} // Placeholder for demo
                        elementId="hybrid-task-2"
                        className="text-xs font-medium block"
                        placeholder="Task title"
                      />
                      <div className="flex items-center gap-1 mt-1">
                        <InlineEditor
                          value="Design"
                          onChange={() => {}} // Placeholder for demo
                          elementId="hybrid-task-category-2"
                          className="text-xs text-gray-500"
                          placeholder="Category"
                        />
                        <span className="text-xs text-gray-400">•</span>
                        <select className="text-xs border rounded px-1 bg-white">
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">Med</Badge>
                    <button className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition-opacity">
                      ×
                    </button>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded group hover:border-blue-300 transition-colors">
                    <Target className="w-3 h-3 text-gray-400" />
                    <div className="flex-1">
                      <InlineEditor
                        value="Review agreement"
                        onChange={() => {}} // Placeholder for demo
                        elementId="hybrid-task-3"
                        className="text-xs font-medium block"
                        placeholder="Task title"
                      />
                      <div className="flex items-center gap-1 mt-1">
                        <InlineEditor
                          value="Legal"
                          onChange={() => {}} // Placeholder for demo
                          elementId="hybrid-task-category-3"
                          className="text-xs text-gray-500"
                          placeholder="Category"
                        />
                        <span className="text-xs text-gray-400">•</span>
                        <select className="text-xs border rounded px-1 bg-white">
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800 text-xs">High</Badge>
                    <button className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition-opacity">
                      ×
                    </button>
                  </div>
                </div>
                
                {/* Add New Task Button */}
                <div className="flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer mt-2">
                  <button className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600">
                    <Plus className="w-3 h-3" />
                    Add Task
                  </button>
                </div>
              </div>

              {/* Mini Chart with Toggle and Progress Overview */}
              <div className="grid grid-cols-2 gap-3">
                {dashboardConfig.layout?.enableCharts && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold">Progress Overview</h3>
                      <button
                        onClick={() => updateLayout('enableCharts', false)}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                      >
                        Hide
                      </button>
                    </div>
                    <div className="border rounded p-2 bg-gray-50 flex items-center justify-center h-16">
                      <BarChart3 className="w-4 h-4 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">Mini Chart</p>
                    </div>
                  </div>
                )}
                
                {/* Progress Stats */}
                <div>
                  <h3 className="text-xs font-semibold mb-2">Overview</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress:</span>
                      <InlineEditor
                        value="67%"
                        onChange={() => {}} // Placeholder for demo
                        elementId="hybrid-progress"
                        className="text-xs font-medium"
                        placeholder="0%"
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="h-1 rounded-full transition-all duration-300" 
                        style={{ 
                          backgroundColor: dashboardConfig.theme?.primaryColor || "#3b82f6",
                          width: '67%' 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Tasks: <InlineEditor
                        value="3/4"
                        onChange={() => {}} // Placeholder for demo
                        elementId="hybrid-tasks-count"
                        className="text-xs inline"
                        placeholder="0/0"
                      /></span>
                      <span>KPIs: <InlineEditor
                        value="4"
                        onChange={() => {}} // Placeholder for demo
                        elementId="hybrid-kpis-count"
                        className="text-xs inline"
                        placeholder="0"
                      /></span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Add Section Buttons for disabled sections */}
              <div className="flex flex-wrap gap-2 mt-4">
                {!dashboardConfig.layout?.enableKPIs && (
                  <button
                    onClick={() => updateLayout('enableKPIs', true)}
                    className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    + Add Quick Stats
                  </button>
                )}
                {!dashboardConfig.layout?.enableCharts && (
                  <button
                    onClick={() => updateLayout('enableCharts', true)}
                    className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    + Add Chart
                  </button>
                )}
                {!dashboardConfig.layout?.enableTasks && (
                  <button
                    onClick={() => updateLayout('enableTasks', true)}
                    className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    + Add Tasks
                  </button>
                )}
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
            📝 Click any text to edit • 🎨 Click colors to change • ⚙️ Use buttons to toggle sections
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