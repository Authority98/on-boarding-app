"use client"

import { useState, useCallback } from 'react'
import { Client, DashboardConfig } from '@/lib/supabase'

export type { DashboardConfig } from '@/lib/supabase'

export interface DashboardConfigManagerProps {
  client: Client
  onClientUpdate: (client: Client) => void
}

export const useDashboardConfig = (client: Client, onClientUpdate: (client: Client) => void) => {
  // Initialize dashboard config with defaults
  const getDefaultConfig = (): DashboardConfig => ({
    branding: {
      showLogo: false,
      logoUrl: '',
      showCompanyName: true,
      customWelcomeMessage: '',
      companyDescription: ''
    },
    theme: {
      primaryColor: '#3b82f6',
      backgroundColor: '#f9fafb',
      textColor: '#1f2937'
    },
    layout: {
      enableKPIs: true,
      enableCharts: true,
      enableActivity: true,
      enableQuickActions: true,
      enableTaskStats: true,
      enableProgressOverview: true,
      widgetVisibility: {
        kpiCards: [true, true, true, true], // Default 4 KPI cards visible
        chartSections: {
          performanceChart: true,
          performanceTrends: true
        },
        quickActions: {
          viewMessages: true,
          downloadReports: true,
          scheduleMeeting: true,
          addKPI: true,
          contactSupport: true,
          downloadResources: true,
          viewTasks: true
        },
        activityFeed: true,
        taskList: true,
        taskStats: {
          totalTasks: true,
          completedTasks: true,
          inProgressTasks: true
        },
        progressOverview: true,
        announcements: true,
        helpSection: true
      }
    },
    kpis: [
      {
        id: '1',
        title: 'Total Revenue',
        value: '$24,500',
        type: 'currency' as const,
        description: 'Monthly recurring revenue'
      },
      {
        id: '2',
        title: 'Active Projects',
        value: '12',
        type: 'number' as const,
        description: 'Currently active projects'
      },
      {
        id: '3',
        title: 'Completion Rate',
        value: '94%',
        type: 'percentage' as const,
        description: 'Overall project completion'
      },
      {
        id: '4',
        title: 'Client Satisfaction',
        value: '4.8/5',
        type: 'text' as const,
        description: 'Average satisfaction score'
      }
    ],
    announcements: []
  })

  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(() => {
    const config = client.dashboard_config as DashboardConfig
    const defaultConfig = getDefaultConfig()
    
    if (config) {
      // Merge existing config with default to ensure all new properties exist
      return {
        ...defaultConfig,
        ...config,
        layout: {
          ...defaultConfig.layout,
          ...config.layout,
          widgetVisibility: {
            ...defaultConfig.layout?.widgetVisibility,
            ...config.layout?.widgetVisibility
          }
        }
      }
    }
    
    return defaultConfig
  })

  // Update functions
  const updateBranding = useCallback((key: keyof NonNullable<DashboardConfig['branding']>, value: string | boolean) => {
    setDashboardConfig(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        [key]: value
      }
    }))
  }, [])

  const updateTheme = useCallback((key: keyof NonNullable<DashboardConfig['theme']>, value: string) => {
    setDashboardConfig(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [key]: value
      }
    }))
  }, [])

  const updateLayout = useCallback((key: keyof NonNullable<DashboardConfig['layout']>, value: boolean) => {
    setDashboardConfig(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [key]: value
      }
    }))
  }, [])

  const updateWidgetVisibility = useCallback((widgetPath: string, value: boolean, index?: number) => {
    setDashboardConfig(prev => {
      const newConfig = { ...prev }
      const pathParts = widgetPath.split('.')
      
      if (!newConfig.layout) newConfig.layout = {}
      if (!newConfig.layout.widgetVisibility) newConfig.layout.widgetVisibility = {}
      
      let current = newConfig.layout.widgetVisibility as any
      
      // Navigate to the correct nested object
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) current[pathParts[i]] = {}
        current = current[pathParts[i]]
      }
      
      const finalKey = pathParts[pathParts.length - 1]
      
      // Handle array updates (like kpiCards)
      if (index !== undefined && Array.isArray(current[finalKey])) {
        current[finalKey] = [...current[finalKey]]
        current[finalKey][index] = value
      } else {
        current[finalKey] = value
      }
      
      return newConfig
    })
  }, [])

  const updateKPI = useCallback((index: number, updates: Partial<NonNullable<DashboardConfig['kpis']>[0]>) => {
    setDashboardConfig(prev => ({
      ...prev,
      kpis: prev.kpis?.map((kpi, i) => 
        i === index ? { ...kpi, ...updates } : kpi
      )
    }))
  }, [])

  const addKPI = useCallback(() => {
    const newKPI = {
      id: Date.now().toString(),
      title: 'New KPI',
      value: '0',
      type: 'number' as const,
      description: 'Description for new KPI'
    }
    setDashboardConfig(prev => {
      const newConfig = { ...prev }
      newConfig.kpis = [...(prev.kpis || []), newKPI]
      
      // Add to widget visibility array for KPI cards
      if (newConfig.layout?.widgetVisibility?.kpiCards && Array.isArray(newConfig.layout.widgetVisibility.kpiCards)) {
        newConfig.layout.widgetVisibility.kpiCards = [...newConfig.layout.widgetVisibility.kpiCards, true]
      }
      
      return newConfig
    })
  }, [])

  const removeKPI = useCallback((index: number) => {
    setDashboardConfig(prev => {
      const newConfig = { ...prev }
      // Remove the KPI
      newConfig.kpis = prev.kpis?.filter((_, i) => i !== index)
      
      // Update widget visibility array for KPI cards
      if (newConfig.layout?.widgetVisibility?.kpiCards && Array.isArray(newConfig.layout.widgetVisibility.kpiCards)) {
        newConfig.layout.widgetVisibility.kpiCards = newConfig.layout.widgetVisibility.kpiCards.filter((_, i) => i !== index)
      }
      
      return newConfig
    })
  }, [])

  const addAnnouncement = useCallback(() => {
    const newAnnouncement = {
      id: Date.now().toString(),
      title: 'New Announcement',
      content: 'Announcement content...',
      type: 'info' as const,
      isActive: true,
      createdAt: new Date().toISOString()
    }
    setDashboardConfig(prev => ({
      ...prev,
      announcements: [...(prev.announcements || []), newAnnouncement]
    }))
  }, [])

  const updateAnnouncement = useCallback((index: number, updates: Partial<NonNullable<DashboardConfig['announcements']>[0]>) => {
    setDashboardConfig(prev => ({
      ...prev,
      announcements: prev.announcements?.map((announcement, i) => 
        i === index ? { ...announcement, ...updates } : announcement
      )
    }))
  }, [])

  const removeAnnouncement = useCallback((index: number) => {
    setDashboardConfig(prev => ({
      ...prev,
      announcements: prev.announcements?.filter((_, i) => i !== index)
    }))
  }, [])

  const getDashboardUrl = useCallback(() => {
    return `${window.location.origin}/client-dashboard/${client.dashboard_slug}`
  }, [client.dashboard_slug])

  const updateClientWithConfig = useCallback((config: DashboardConfig) => {
    const updatedClient = {
      ...client,
      dashboard_config: config
    }
    onClientUpdate(updatedClient)
  }, [client, onClientUpdate])

  return {
    dashboardConfig,
    setDashboardConfig,
    updateBranding,
    updateTheme,
    updateLayout,
    updateWidgetVisibility,
    updateKPI,
    addKPI,
    removeKPI,
    addAnnouncement,
    updateAnnouncement,
    removeAnnouncement,
    getDashboardUrl,
    updateClientWithConfig
  }
}