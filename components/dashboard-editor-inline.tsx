"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, ExternalLink, Settings, BarChart3, CheckSquare, Layers, ArrowLeft } from "lucide-react"
import { clientOperations, type Client } from "@/lib/supabase"
import { toast } from "sonner"

interface DashboardEditorInlineProps {
  client: Client
  onClientUpdated: (updatedClient: Client) => void
  onBack: () => void
}

export function DashboardEditorInline({ client, onClientUpdated, onBack }: DashboardEditorInlineProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState(client.view_mode || 'dashboard')

  const getDashboardUrl = () => {
    return `${window.location.origin}/client-dashboard/${client.dashboard_slug}`
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
    if (!client.id) return
    
    setIsLoading(true)
    try {
      const updatedClient = await clientOperations.update(client.id, {
        view_mode: viewMode as 'dashboard' | 'task' | 'hybrid'
      })
      
      onClientUpdated(updatedClient)
      toast.success("Dashboard settings updated successfully!")
    } catch (error) {
      toast.error("Failed to update dashboard settings")
      console.error('Update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getViewModeIcon = (mode: string) => {
    switch (mode) {
      case 'dashboard':
        return <BarChart3 className="w-4 h-4" />
      case 'task':
        return <CheckSquare className="w-4 h-4" />
      case 'hybrid':
        return <Layers className="w-4 h-4" />
      default:
        return <BarChart3 className="w-4 h-4" />
    }
  }

  const getViewModeDescription = (mode: string) => {
    switch (mode) {
      case 'dashboard':
        return 'Full dashboard with analytics, KPIs, and data visualization'
      case 'task':
        return 'Simple task list for client completion tracking'
      case 'hybrid':
        return 'Full dashboard with an additional task sidebar'
      default:
        return 'Full dashboard view'
    }
  }

  const getViewModeColor = (mode: string) => {
    switch (mode) {
      case 'dashboard':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
      case 'task':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      case 'hybrid':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Clients
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Dashboard Editor - {client.name}</h2>
          <p className="text-muted-foreground">
            Configure the dashboard experience for your client and manage their unique dashboard URL.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Current Dashboard URL */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client Dashboard URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input 
                  value={getDashboardUrl()} 
                  readOnly 
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyUrl}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOpenDashboard}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this unique URL with your client to give them access to their personalized dashboard.
              </p>
            </CardContent>
          </Card>

          {/* Current View Mode */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current View Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                {getViewModeIcon(client.view_mode || 'dashboard')}
                <Badge variant="secondary" className={getViewModeColor(client.view_mode || 'dashboard')}>
                  {(client.view_mode || 'dashboard').charAt(0).toUpperCase() + (client.view_mode || 'dashboard').slice(1)} Mode
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {getViewModeDescription(client.view_mode || 'dashboard')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* View Mode Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configure View Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="view-mode">Select View Mode</Label>
                <Select value={viewMode} onValueChange={(value: 'dashboard' | 'task' | 'hybrid') => setViewMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Dashboard Mode
                      </div>
                    </SelectItem>
                    <SelectItem value="task">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Task Mode
                      </div>
                    </SelectItem>
                    <SelectItem value="hybrid">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Hybrid Mode
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button
                  onClick={handleSaveChanges}
                  disabled={isLoading || viewMode === client.view_mode}
                  className="w-full"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* View Mode Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dashboard Modes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <div className={`p-3 rounded-lg border ${viewMode === 'dashboard' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : 'bg-muted/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4" />
                    <strong>Dashboard Mode</strong>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Shows a complete dashboard with live analytics, KPI boxes, graphs, and content sections. Perfect for data-driven client relationships.
                  </p>
                </div>

                <div className={`p-3 rounded-lg border ${viewMode === 'task' ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950' : 'bg-muted/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckSquare className="w-4 h-4" />
                    <strong>Task Mode</strong>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Displays a simple, clean task list interface. Ideal for onboarding processes or project completion tracking.
                  </p>
                </div>

                <div className={`p-3 rounded-lg border ${viewMode === 'hybrid' ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' : 'bg-muted/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4" />
                    <strong>Hybrid Mode</strong>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Combines the full dashboard experience with a task sidebar. Best of both worlds for comprehensive client management.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}