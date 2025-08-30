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
  Save, Eye, Upload, Download, Star, Target
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
  const [activeTab, setActiveTab] = useState<'layout' | 'content' | 'branding' | 'advanced' | 'preview'>('layout')
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
  }, [client.id])

  const loadDashboardContent = async () => {
    if (!client.id) return
    
    try {
      const content = await dashboardContentOperations.getByClientId(client.id)
      setDashboardContent(content)
    } catch (error) {
      console.error('Error loading dashboard content:', error)
    }
  }

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
      const updatedClient = await clientOperations.updateDashboardConfig(client.id, dashboardConfig)
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

  const TabButton = ({ tab, label, icon }: { tab: typeof activeTab; label: string; icon: React.ReactNode }) => (
    <Button
      variant={activeTab === tab ? "default" : "outline"}
      onClick={() => setActiveTab(tab)}
      className="flex items-center gap-2"
    >
      {icon}
      {label}
    </Button>
  )

  const renderLayoutEditor = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={dashboardConfig.layout?.enableKPIs || false}
                onChange={(e) => updateLayout('enableKPIs', e.target.checked)}
                className="rounded"
              />
              <span>KPI Cards</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={dashboardConfig.layout?.enableCharts || false}
                onChange={(e) => updateLayout('enableCharts', e.target.checked)}
                className="rounded"
              />
              <span>Charts & Analytics</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={dashboardConfig.layout?.enableTasks || false}
                onChange={(e) => updateLayout('enableTasks', e.target.checked)}
                className="rounded"
              />
              <span>Task Management</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={dashboardConfig.layout?.enableActivity || false}
                onChange={(e) => updateLayout('enableActivity', e.target.checked)}
                className="rounded"
              />
              <span>Recent Activity</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>View Mode Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={client.view_mode} 
            onValueChange={(value: 'dashboard' | 'task' | 'hybrid') => {
              onClientUpdated({ ...client, view_mode: value })
            }}
          >
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
        </CardContent>
      </Card>
    </div>
  )

  const renderContentEditor = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            KPI Configuration
            <Button onClick={addKPI} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add KPI
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardConfig.kpis?.map((kpi, index) => (
              <div key={kpi.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">KPI #{index + 1}</h4>
                  <Button 
                    onClick={() => removeKPI(index)} 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={kpi.title}
                      onChange={(e) => updateKPI(index, { title: e.target.value })}
                      placeholder="KPI Title"
                    />
                  </div>
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={kpi.value}
                      onChange={(e) => updateKPI(index, { value: e.target.value })}
                      placeholder="KPI Value"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select 
                      value={kpi.type} 
                      onValueChange={(value: 'percentage' | 'number' | 'currency' | 'text') => 
                        updateKPI(index, { type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="currency">Currency</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description (optional)</Label>
                    <Input
                      value={kpi.description || ''}
                      onChange={(e) => updateKPI(index, { description: e.target.value })}
                      placeholder="KPI Description"
                    />
                  </div>
                </div>
              </div>
            )) || <p className="text-muted-foreground">No KPIs configured. Click "Add KPI" to get started.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderBrandingEditor = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Primary Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={dashboardConfig.theme?.primaryColor || "#3b82f6"}
                  onChange={(e) => updateThemeColor('primaryColor', e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={dashboardConfig.theme?.primaryColor || "#3b82f6"}
                  onChange={(e) => updateThemeColor('primaryColor', e.target.value)}
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            <div>
              <Label>Secondary Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={dashboardConfig.theme?.secondaryColor || "#64748b"}
                  onChange={(e) => updateThemeColor('secondaryColor', e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={dashboardConfig.theme?.secondaryColor || "#64748b"}
                  onChange={(e) => updateThemeColor('secondaryColor', e.target.value)}
                  placeholder="#64748b"
                />
              </div>
            </div>
            <div>
              <Label>Background Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={dashboardConfig.theme?.backgroundColor || "#ffffff"}
                  onChange={(e) => updateThemeColor('backgroundColor', e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={dashboardConfig.theme?.backgroundColor || "#ffffff"}
                  onChange={(e) => updateThemeColor('backgroundColor', e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding & Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={dashboardConfig.branding?.showCompanyName || false}
                onChange={(e) => updateBranding('showCompanyName', e.target.checked)}
                className="rounded"
              />
              <span>Show Company Name</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={dashboardConfig.branding?.showLogo || false}
                onChange={(e) => updateBranding('showLogo', e.target.checked)}
                className="rounded"
              />
              <span>Show Logo</span>
            </label>
          </div>
          
          <div>
            <Label>Custom Welcome Message</Label>
            <textarea
              value={dashboardConfig.branding?.customWelcomeMessage || ''}
              onChange={(e) => updateBranding('customWelcomeMessage', e.target.value)}
              placeholder="Enter a custom welcome message for this client..."
              className="w-full p-3 border rounded-md min-h-[100px] resize-none"
            />
          </div>
          
          <div>
            <Label>Company Description</Label>
            <textarea
              value={dashboardConfig.branding?.companyDescription || ''}
              onChange={(e) => updateBranding('companyDescription', e.target.value)}
              placeholder="Brief description about your company or services..."
              className="w-full p-3 border rounded-md min-h-[80px] resize-none"
            />
          </div>
          
          {dashboardConfig.branding?.showLogo && (
            <div>
              <Label>Logo URL</Label>
              <Input
                value={dashboardConfig.branding?.logoUrl || ''}
                onChange={(e) => updateBranding('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderPreview = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="border rounded-lg p-6 min-h-[400px]"
            style={{ 
              backgroundColor: dashboardConfig.theme?.backgroundColor || "#ffffff",
              color: dashboardConfig.theme?.textColor || "#000000"
            }}
          >
            {/* Preview Header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                {dashboardConfig.branding?.showLogo && dashboardConfig.branding?.logoUrl && (
                  <img 
                    src={dashboardConfig.branding.logoUrl} 
                    alt="Logo" 
                    className="w-12 h-12 object-contain"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold">
                    Welcome{dashboardConfig.branding?.showCompanyName && client.company ? `, ${client.company}` : ''}!
                  </h1>
                  {dashboardConfig.branding?.customWelcomeMessage && (
                    <p className="text-gray-600 mt-1">{dashboardConfig.branding.customWelcomeMessage}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Preview KPIs */}
            {dashboardConfig.layout?.enableKPIs && dashboardConfig.kpis && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Key Performance Indicators</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardConfig.kpis.map((kpi, index) => (
                    <div 
                      key={kpi.id}
                      className="border rounded-lg p-4"
                      style={{ borderColor: dashboardConfig.theme?.primaryColor || "#3b82f6" }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Target className="w-4 h-4" style={{ color: dashboardConfig.theme?.primaryColor || "#3b82f6" }} />
                        <Badge variant="outline">{kpi.type}</Badge>
                      </div>
                      <p className="text-2xl font-bold" style={{ color: dashboardConfig.theme?.primaryColor || "#3b82f6" }}>
                        {kpi.value}
                      </p>
                      <p className="text-sm text-gray-600">{kpi.title}</p>
                      {kpi.description && (
                        <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview Other Sections */}
            {dashboardConfig.layout?.enableCharts && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Analytics</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-center text-gray-500">Chart preview will appear here</p>
                </div>
              </div>
            )}

            {dashboardConfig.layout?.enableTasks && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Tasks</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <CheckSquare className="w-4 h-4 text-green-500" />
                    <span>Sample completed task</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span>Sample pending task</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

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
            <h2 className="text-2xl font-bold">Dashboard Content Editor - {client.name}</h2>
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

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b pb-4">
        <TabButton tab="layout" label="Layout" icon={<Layers className="w-4 h-4" />} />
        <TabButton tab="content" label="Content" icon={<Type className="w-4 h-4" />} />
        <TabButton tab="branding" label="Branding" icon={<Palette className="w-4 h-4" />} />
        <TabButton tab="advanced" label="Advanced" icon={<Settings className="w-4 h-4" />} />
        <TabButton tab="preview" label="Preview" icon={<Eye className="w-4 h-4" />} />
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'layout' && renderLayoutEditor()}
        {activeTab === 'content' && renderContentEditor()}
        {activeTab === 'branding' && renderBrandingEditor()}
        {activeTab === 'advanced' && (
          <DashboardAdvancedEditor
            client={client}
            dashboardConfig={dashboardConfig}
            onConfigUpdate={setDashboardConfig}
          />
        )}
        {activeTab === 'preview' && renderPreview()}
      </div>
    </div>
  )
}