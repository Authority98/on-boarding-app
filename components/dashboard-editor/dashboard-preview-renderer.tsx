"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  BarChart3, 
  Clock, 
  MessageSquare, 
  FileText, 
  Calendar, 
  CheckCircle 
} from 'lucide-react'
import { Client, DashboardConfig } from '@/lib/supabase'
import { InlineEditor, InlineColorPicker } from './inline-editors'
import { getWidgetVisibility } from '@/lib/widget-visibility'

export interface DashboardPreviewRendererProps {
  client: Client
  dashboardConfig: DashboardConfig
  updateBranding: (key: keyof NonNullable<DashboardConfig['branding']>, value: string | boolean) => void
  updateKPI: (index: number, updates: Partial<NonNullable<DashboardConfig['kpis']>[0]>) => void
  updateLayout: (key: keyof NonNullable<DashboardConfig['layout']>, value: boolean) => void
  updateWidgetVisibility: (widgetPath: string, value: boolean, index?: number) => void
  addKPI: () => void
  removeKPI: (index: number) => void
  setCurrentClient: (updater: (prev: Client) => Client) => void
  isEditing: (id: string) => boolean
  startEditing: (id: string) => void
  stopEditing: () => void
}

/**
 * Widget wrapper component for consistent enable/disable functionality
 */
interface WidgetWrapperProps {
  children: React.ReactNode
  isVisible: boolean
  onToggle: () => void
  widgetName: string
  className?: string
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ 
  children, 
  isVisible, 
  onToggle, 
  widgetName,
  className = '' 
}) => {
  return (
    <div className={`group relative ${!isVisible ? 'opacity-30' : ''} ${className}`}>
      {/* Enable/Disable Button */}
      <div
        onClick={onToggle}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded cursor-pointer transition-all"
        title={`${isVisible ? 'Disable' : 'Enable'} ${widgetName}`}
      >
        {isVisible ? 'Disable' : 'Enable'}
      </div>
      
      {/* Widget Content */}
      {children}
      
      {/* Disabled Overlay */}
      {!isVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg pointer-events-none">
          <span className="text-sm text-gray-500 font-medium">Disabled</span>
        </div>
      )}
    </div>
  )
}

export const DashboardPreviewRenderer: React.FC<DashboardPreviewRendererProps> = ({
  client,
  dashboardConfig,
  updateBranding,
  updateKPI,
  updateLayout,
  updateWidgetVisibility,
  addKPI,
  removeKPI,
  setCurrentClient,
  isEditing,
  startEditing,
  stopEditing
}) => {

  if (client.view_mode === 'dashboard') {
    return (
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
                    {client.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <InlineEditor
                      value={dashboardConfig.branding?.customWelcomeMessage || ''}
                      onChange={(value) => updateBranding('customWelcomeMessage', value)}
                      elementId="preview-welcome"
                      className="text-3xl font-bold mb-0"
                      placeholder={`Welcome back, ${client.name.split(' ')[0]}!`}
                      isEditing={isEditing}
                      startEditing={startEditing}
                      stopEditing={stopEditing}
                    />
                    <p className="text-gray-600">
                      {dashboardConfig.branding?.showCompanyName && client.company ? 
                        `${client.company} • ` : ''}Here's your dashboard overview
                    </p>
                    {dashboardConfig.branding?.companyDescription && (
                      <InlineEditor
                        value={dashboardConfig.branding?.companyDescription || ''}
                        onChange={(value) => updateBranding('companyDescription', value)}
                        elementId="preview-description"
                        className="text-sm text-gray-500 mt-1 block"
                        multiline={true}
                        placeholder="Company description..."
                        isEditing={isEditing}
                        startEditing={startEditing}
                        stopEditing={stopEditing}
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
                  <select
                    value={client.view_mode}
                    onChange={(e) => setCurrentClient(prev => ({ ...prev, view_mode: e.target.value as 'dashboard' | 'task' | 'hybrid' }))}
                    className="text-sm border rounded px-3 py-2 bg-white cursor-pointer hover:bg-gray-50 ml-4"
                  >
                    <option value="dashboard">Dashboard Mode</option>
                    <option value="task">Task Mode</option>
                    <option value="hybrid">Hybrid Mode</option>
                  </select>
                </div>
              </div>

              {/* KPI Cards with Widget Wrappers */}
              {dashboardConfig.layout?.enableKPIs && dashboardConfig.kpis && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {dashboardConfig.kpis.map((kpi, index) => {
                    const isVisible = getWidgetVisibility(dashboardConfig, 'kpiCards', index)
                    
                    return (
                      <WidgetWrapper
                        key={kpi.id}
                        isVisible={isVisible}
                        onToggle={() => updateWidgetVisibility('kpiCards', !isVisible, index)}
                        widgetName={`KPI: ${kpi.title}`}
                        className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow"
                      >
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
                        </div>
                        <div>
                          <InlineEditor
                            value={kpi.value}
                            onChange={(value) => updateKPI(index, { value })}
                            elementId={`preview-kpi-value-${index}`}
                            className="text-2xl font-bold mb-1 block"
                            placeholder="0"
                            isEditing={isEditing}
                            startEditing={startEditing}
                            stopEditing={stopEditing}
                          />
                          <InlineEditor
                            value={kpi.title}
                            onChange={(value) => updateKPI(index, { title: value })}
                            elementId={`preview-kpi-title-${index}`}
                            className="text-sm text-gray-600 block"
                            placeholder="KPI Title"
                            isEditing={isEditing}
                            startEditing={startEditing}
                            stopEditing={stopEditing}
                          />
                          {kpi.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {kpi.description}
                            </p>
                          )}
                        </div>
                      </WidgetWrapper>
                    )
                  })}
                </div>
              )}

              {/* Performance Chart with Widget Wrapper */}
              {dashboardConfig.layout?.enableCharts && (
                <WidgetWrapper
                  isVisible={getWidgetVisibility(dashboardConfig, 'chartSections.performanceChart')}
                  onToggle={() => updateWidgetVisibility('chartSections.performanceChart', !getWidgetVisibility(dashboardConfig, 'chartSections.performanceChart'))}
                  widgetName="Performance Chart"
                  className="bg-white rounded-lg p-6 shadow mb-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Performance Overview
                    </h3>
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
                </WidgetWrapper>
              )}

              {/* Show real content grid like DashboardMode */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity with Widget Wrapper */}
                {dashboardConfig.layout?.enableActivity && (
                  <WidgetWrapper
                    isVisible={getWidgetVisibility(dashboardConfig, 'activityFeed')}
                    onToggle={() => updateWidgetVisibility('activityFeed', !getWidgetVisibility(dashboardConfig, 'activityFeed'))}
                    widgetName="Activity Feed"
                    className="bg-white rounded-lg p-6 shadow"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Recent Activity
                      </h3>
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
                  </WidgetWrapper>
                )}

                {/* Quick Actions with Widget Wrapper */}
                <WidgetWrapper
                  isVisible={getWidgetVisibility(dashboardConfig, 'quickActions')}
                  onToggle={() => updateWidgetVisibility('quickActions', !getWidgetVisibility(dashboardConfig, 'quickActions'))}
                  widgetName="Quick Actions"
                  className="bg-white rounded-lg p-6 shadow"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Quick Actions
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: "View Messages", icon: <MessageSquare className="w-5 h-5" />, color: "blue", key: "viewMessages" },
                      { title: "Download Reports", icon: <FileText className="w-5 h-5" />, color: "green", key: "downloadReports" },
                      { title: "Schedule Meeting", icon: <Calendar className="w-5 h-5" />, color: "purple", key: "scheduleMeeting" },
                      { title: "Add KPI", icon: <Target className="w-5 h-5" />, color: "orange", key: "addKPI" }
                    ].map((action) => {
                      const isActionVisible = getWidgetVisibility(dashboardConfig, `quickActions.${action.key}`)
                      return (
                        <div
                          key={action.key}
                          className={`relative group/action`}
                        >
                          {/* Individual Action Enable/Disable Button */}
                          <div
                            onClick={() => updateWidgetVisibility(`quickActions.${action.key}`, !isActionVisible)}
                            className="absolute top-1 right-1 z-10 opacity-0 group-hover/action:opacity-100 bg-gray-700 hover:bg-gray-800 text-white text-xs px-1 py-0.5 rounded cursor-pointer transition-all"
                            title={`${isActionVisible ? 'Disable' : 'Enable'} ${action.title}`}
                          >
                            {isActionVisible ? 'Off' : 'On'}
                          </div>
                          
                          <div
                            className={`p-4 rounded-lg border-2 border-dashed transition-all hover:border-solid hover:shadow-md cursor-pointer ${
                              action.color === 'blue' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' :
                              action.color === 'green' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' :
                              action.color === 'purple' ? 'border-purple-300 hover:border-purple-500 hover:bg-purple-50' :
                              'border-orange-300 hover:border-orange-500 hover:bg-orange-50'
                            } ${
                              !isActionVisible ? 'opacity-30' : ''
                            }`}
                            onClick={() => {
                              if (action.title === "Add KPI" && isActionVisible) addKPI()
                            }}
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
                                {!isActionVisible && <span className="text-xs text-gray-400 block">(Disabled)</span>}
                              </span>
                            </div>
                            
                            {/* Individual Action Disabled Overlay */}
                            {!isActionVisible && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-lg">
                                <span className="text-xs text-gray-500 font-medium">Off</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </WidgetWrapper>
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
    )
  }

  if (client.view_mode === 'task') {
    return (
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
                    {client.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <InlineEditor
                      value={dashboardConfig.branding?.customWelcomeMessage || ''}
                      onChange={(value) => updateBranding('customWelcomeMessage', value)}
                      elementId="task-preview-welcome"
                      className="text-3xl font-bold mb-2"
                      placeholder={`Welcome, ${client.name.split(' ')[0]}!`}
                      isEditing={isEditing}
                      startEditing={startEditing}
                      stopEditing={stopEditing}
                    />
                    <p className="text-gray-600 mb-4">
                      {dashboardConfig.branding?.showCompanyName && client.company ? 
                        `${client.company} • ` : ''}Task Management Dashboard
                    </p>
                    {dashboardConfig.branding?.companyDescription && (
                      <InlineEditor
                        value={dashboardConfig.branding?.companyDescription || ''}
                        onChange={(value) => updateBranding('companyDescription', value)}
                        elementId="task-preview-description"
                        className="text-sm text-gray-500 block"
                        multiline={true}
                        placeholder="Company description..."
                        isEditing={isEditing}
                        startEditing={startEditing}
                        stopEditing={stopEditing}
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
                    value={client.view_mode}
                    onChange={(e) => setCurrentClient(prev => ({ ...prev, view_mode: e.target.value as 'dashboard' | 'task' | 'hybrid' }))}
                    className="text-sm border rounded px-3 py-2 bg-white cursor-pointer hover:bg-gray-50 ml-4"
                  >
                    <option value="dashboard">Dashboard Mode</option>
                    <option value="task">Task Mode</option>
                    <option value="hybrid">Hybrid Mode</option>
                  </select>
                </div>

                {/* Progress Overview */}
                <WidgetWrapper
                  isVisible={getWidgetVisibility(dashboardConfig, 'progressOverview')}
                  onToggle={() => updateWidgetVisibility('progressOverview', !getWidgetVisibility(dashboardConfig, 'progressOverview'))}
                  widgetName="Progress Overview"
                  className="bg-white rounded-lg p-6 shadow mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Overall Progress</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">67%</span>
                    </div>
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
                </WidgetWrapper>
              </div>

              {/* Task List */}
              <WidgetWrapper
                isVisible={getWidgetVisibility(dashboardConfig, 'taskList')}
                onToggle={() => updateWidgetVisibility('taskList', !getWidgetVisibility(dashboardConfig, 'taskList'))}
                widgetName="Task List"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Task List</h2>
                </div>
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
                                  isEditing={isEditing}
                                  startEditing={startEditing}
                                  stopEditing={stopEditing}
                                />
                                <InlineEditor
                                  value={task.description}
                                  onChange={() => {}} // Demo mode
                                  elementId={`task-preview-desc-${index}`}
                                  className="text-gray-600 mt-1 block"
                                  multiline={true}
                                  placeholder="Task description"
                                  isEditing={isEditing}
                                  startEditing={startEditing}
                                  stopEditing={stopEditing}
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
              </WidgetWrapper>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { title: "Contact Support", subtitle: "Get help with tasks", icon: <MessageSquare className="w-5 h-5" />, key: "contactSupport" },
                  { title: "Download Resources", subtitle: "Access project files", icon: <FileText className="w-5 h-5" />, key: "downloadResources" },
                  { title: "Schedule Meeting", subtitle: "Book time with team", icon: <Calendar className="w-5 h-5" />, key: "scheduleMeeting" }
                ].map((action) => {
                  const isVisible = getWidgetVisibility(dashboardConfig, `quickActions.${action.key}`)
                  return (
                    <WidgetWrapper
                      key={action.key}
                      isVisible={isVisible}
                      onToggle={() => updateWidgetVisibility(`quickActions.${action.key}`, !isVisible)}
                      widgetName={`Action: ${action.title}`}
                      className="h-auto p-4 bg-white border rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        {action.icon}
                        <div className="text-left">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-sm text-gray-500">{action.subtitle}</div>
                        </div>
                      </div>
                    </WidgetWrapper>
                  )
                })}
              </div>



              {/* Task Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { key: 'totalTasks', label: 'Total Tasks', value: '6', color: 'blue' },
                  { key: 'completedTasks', label: 'Completed', value: '4', color: 'green' },
                  { key: 'inProgressTasks', label: 'In Progress', value: '2', color: 'yellow' }
                ].map((stat) => {
                  const isVisible = getWidgetVisibility(dashboardConfig, `taskStats.${stat.key}`)
                  return (
                    <WidgetWrapper
                      key={stat.key}
                      isVisible={isVisible}
                      onToggle={() => updateWidgetVisibility(`taskStats.${stat.key}`, !isVisible)}
                      widgetName={`Task Stat: ${stat.label}`}
                      className="bg-white rounded-lg p-6 shadow text-center"
                    >
                      <div className={`text-3xl font-bold mb-2 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        'text-yellow-600'
                      }`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </WidgetWrapper>
                  )
                })}
              </div>

              {/* Help Section */}
              <WidgetWrapper
                isVisible={getWidgetVisibility(dashboardConfig, 'helpSection')}
                onToggle={() => updateWidgetVisibility('helpSection', !getWidgetVisibility(dashboardConfig, 'helpSection'))}
                widgetName="Help Section"
                className="bg-white rounded-lg p-6 shadow mt-8"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                    <p className="text-gray-600 mb-4">
                      If you have any questions about your tasks or need assistance, don't hesitate to reach out to our support team.
                    </p>
                    <div className="flex gap-2">
                      <div className="px-4 py-2 bg-blue-500 text-white text-sm rounded cursor-pointer hover:bg-blue-600 transition-colors">
                        Contact Support
                      </div>
                      <div className="px-4 py-2 border border-blue-500 text-blue-500 text-sm rounded cursor-pointer hover:bg-blue-50 transition-colors">
                        View FAQ
                      </div>
                    </div>
                  </div>
                </div>
              </WidgetWrapper>

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
    )
  }

  if (client.view_mode === 'hybrid') {
    return (
      <div className="hybrid-preview-wrapper">
        {/* Scale down to fit layout */}
        <div style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: '133.33%' }}>
          <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              {/* Header matching HybridMode */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium">
                    {client.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <InlineEditor
                      value={dashboardConfig.branding?.customWelcomeMessage || ''}
                      onChange={(value) => updateBranding('customWelcomeMessage', value)}
                      elementId="hybrid-preview-welcome"
                      className="text-3xl font-bold mb-2"
                      placeholder={`Welcome, ${client.name.split(' ')[0]}!`}
                      isEditing={isEditing}
                      startEditing={startEditing}
                      stopEditing={stopEditing}
                    />
                    <p className="text-gray-600">Dashboard & Task Management</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">Hybrid Mode</Badge>
                  <Badge variant="outline">Combined View</Badge>
                  <select
                    value={client.view_mode}
                    onChange={(e) => setCurrentClient(prev => ({ ...prev, view_mode: e.target.value as 'dashboard' | 'task' | 'hybrid' }))}
                    className="text-sm border rounded px-3 py-2 bg-white cursor-pointer hover:bg-gray-50 ml-4"
                  >
                    <option value="dashboard">Dashboard Mode</option>
                    <option value="task">Task Mode</option>
                    <option value="hybrid">Hybrid Mode</option>
                  </select>
                </div>
              </div>

              {/* Split Layout like real HybridMode */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* KPIs Section */}
                {dashboardConfig.layout?.enableKPIs && dashboardConfig.kpis && (
                  <WidgetWrapper
                    isVisible={getWidgetVisibility(dashboardConfig, 'kpiCards')}
                    onToggle={() => updateWidgetVisibility('kpiCards', !getWidgetVisibility(dashboardConfig, 'kpiCards'))}
                    widgetName="Quick Metrics"
                    className="bg-white rounded-lg p-6 shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Quick Metrics</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {dashboardConfig.kpis.slice(0, 4).map((kpi, index) => {
                        const isVisible = getWidgetVisibility(dashboardConfig, 'kpiCards', index)
                        return (
                          <WidgetWrapper
                            key={kpi.id}
                            isVisible={isVisible}
                            onToggle={() => updateWidgetVisibility('kpiCards', !isVisible, index)}
                            widgetName={`KPI: ${kpi.title}`}
                            className="border rounded-lg p-3"
                          >
                            <InlineEditor
                              value={kpi.value}
                              onChange={(value) => updateKPI(index, { value })}
                              elementId={`hybrid-preview-kpi-${index}`}
                              className="text-lg font-bold block mb-1"
                              placeholder="0"
                              isEditing={isEditing}
                              startEditing={startEditing}
                              stopEditing={stopEditing}
                            />
                            <InlineEditor
                              value={kpi.title}
                              onChange={(value) => updateKPI(index, { title: value })}
                              elementId={`hybrid-preview-title-${index}`}
                              className="text-xs text-gray-600 block"
                              placeholder="KPI Title"
                              isEditing={isEditing}
                              startEditing={startEditing}
                              stopEditing={stopEditing}
                            />
                          </WidgetWrapper>
                        )
                      })}
                    </div>
                  </WidgetWrapper>
                )}

                {/* Tasks Section */}
                <WidgetWrapper
                  isVisible={getWidgetVisibility(dashboardConfig, 'taskList')}
                  onToggle={() => updateWidgetVisibility('taskList', !getWidgetVisibility(dashboardConfig, 'taskList'))}
                  widgetName="Priority Tasks"
                  className="bg-white rounded-lg p-6 shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Priority Tasks</h3>
                  </div>
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
                              isEditing={isEditing}
                              startEditing={startEditing}
                              stopEditing={stopEditing}
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
                </WidgetWrapper>
              </div>

              {/* Chart Section */}
              {dashboardConfig.layout?.enableCharts && (
                <WidgetWrapper
                  isVisible={getWidgetVisibility(dashboardConfig, 'chartSections.performanceTrends')}
                  onToggle={() => updateWidgetVisibility('chartSections.performanceTrends', !getWidgetVisibility(dashboardConfig, 'chartSections.performanceTrends'))}
                  widgetName="Performance Trends"
                  className="bg-white rounded-lg p-6 shadow mb-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Performance Trends
                    </h3>
                  </div>
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
                </WidgetWrapper>
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
    )
  }

  // Announcements for all modes
  return (
    <div>
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
  )
}