"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, ExternalLink } from 'lucide-react'
import { Client } from '@/lib/supabase'

export interface PreviewWrapperProps {
  client: Client
  dashboardUrl: string
  showPreview: boolean
  onTogglePreview: (show: boolean) => void
  onOpenDashboard: () => void
  children: React.ReactNode
}

export const PreviewWrapper: React.FC<PreviewWrapperProps> = ({
  client,
  dashboardUrl,
  showPreview,
  onTogglePreview,
  onOpenDashboard,
  children
}) => {
  if (!showPreview) {
    return (
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
            <Button onClick={() => onTogglePreview(true)} className="gap-2">
              <Eye className="w-4 h-4" />
              Show Preview to Start Editing
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 transition-all duration-300">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Live Preview with Inline Editing</h3>
          <p className="text-sm text-gray-600 mt-1">
            {client.view_mode?.charAt(0).toUpperCase() + client.view_mode?.slice(1)} Mode • 
            Previewing as <span className="font-medium">{client.name}</span> •
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
            onClick={onOpenDashboard}
            className="gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Full View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onTogglePreview(false)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Hide Preview
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg bg-white shadow-lg overflow-hidden">
        {/* Browser-like header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 border-b">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="ml-2 font-mono text-xs text-gray-500">
              {dashboardUrl}
            </span>
          </div>
        </div>
        
        {/* Preview content with scroll */}
        <div className="max-h-[580px] overflow-y-auto">
          <div className="overflow-hidden">
            <div className="bg-white min-h-[400px] overflow-hidden">
              {children}
            </div>
            
            {/* Help text */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                📝 Click any text to edit • 🎨 Click colors to change • ⚙️ Use buttons to toggle sections<br/>
                ✨ Preview matches exactly what your clients will see
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}