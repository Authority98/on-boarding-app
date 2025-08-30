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
      enableActivity: true
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
    return config ? { ...getDefaultConfig(), ...config } : getDefaultConfig()
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
    setDashboardConfig(prev => ({
      ...prev,
      kpis: [...(prev.kpis || []), newKPI]
    }))
  }, [])

  const removeKPI = useCallback((index: number) => {
    setDashboardConfig(prev => ({
      ...prev,
      kpis: prev.kpis?.filter((_, i) => i !== index)
    }))
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