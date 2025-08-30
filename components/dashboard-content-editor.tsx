"use client"

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Client } from '@/lib/supabase'
import { ArrowLeft, Copy, ExternalLink, Save } from 'lucide-react'
import { toast } from "sonner"
import { clientOperations } from '@/lib/supabase'

// Import the new modular components
import { useDashboardConfig, DashboardConfig } from './dashboard-editor/config-manager'
import { PreviewWrapper } from './dashboard-editor/preview-wrapper'
import { DashboardPreviewRenderer } from './dashboard-editor/dashboard-preview-renderer'

interface DashboardContentEditorProps {
  client: Client
  onBack: () => void
  onClientUpdated?: (client: Client) => void
}

export default function DashboardContentEditor({ client, onBack, onClientUpdated }: DashboardContentEditorProps) {
  const [currentClient, setCurrentClient] = useState<Client>(client)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Use the dashboard config hook for state management
  const {
    dashboardConfig,
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
  } = useDashboardConfig(currentClient, setCurrentClient)

  // Inline editing state management
  const isEditing = useCallback((id: string) => editingId === id, [editingId])
  const startEditing = useCallback((id: string) => setEditingId(id), [])
  const stopEditing = useCallback(() => setEditingId(null), [])

  // Handle saving changes
  const handleSaveChanges = async () => {
    try {
      setIsLoading(true)
      const updatedClient = {
        ...currentClient,
        dashboard_config: dashboardConfig
      }
      await clientOperations.update(currentClient.id!, {
        dashboard_config: dashboardConfig
      })
      updateClientWithConfig(dashboardConfig)
      // Update the client in the parent component
      if (onClientUpdated) {
        onClientUpdated(updatedClient)
      }
      toast.success("Dashboard configuration has been updated successfully.")
    } catch (error) {
      console.error('Error saving changes:', error)
      toast.error("Failed to save changes. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle copying dashboard URL
  const handleCopyUrl = () => {
    const url = getDashboardUrl()
    navigator.clipboard.writeText(url)
    toast.success("Dashboard URL has been copied to clipboard.")
  }

  // Handle opening dashboard in new tab
  const handleOpenDashboard = () => {
    const url = getDashboardUrl()
    window.open(url, '_blank')
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
        <PreviewWrapper
          client={currentClient}
          dashboardUrl={getDashboardUrl()}
          showPreview={showPreview}
          onTogglePreview={setShowPreview}
          onOpenDashboard={handleOpenDashboard}
        >
          <DashboardPreviewRenderer
            client={currentClient}
            dashboardConfig={dashboardConfig}
            updateBranding={updateBranding}
            updateKPI={updateKPI}
            updateLayout={updateLayout}
            addKPI={addKPI}
            removeKPI={removeKPI}
            setCurrentClient={setCurrentClient}
            isEditing={isEditing}
            startEditing={startEditing}
            stopEditing={stopEditing}
          />
        </PreviewWrapper>
      </div>
    </div>
  )
}