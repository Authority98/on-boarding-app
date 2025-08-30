"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, Trash2, GripVertical, Upload, FileText, Image, Video,
  MessageSquare, Calendar, Target, Star, ChevronUp, ChevronDown
} from "lucide-react"
import { 
  type Client, 
  type DashboardConfig,
  type DashboardContent,
  dashboardContentOperations
} from "@/lib/supabase"
import { toast } from "sonner"

interface DashboardAdvancedEditorProps {
  client: Client
  dashboardConfig: DashboardConfig
  onConfigUpdate: (config: DashboardConfig) => void
}

export function DashboardAdvancedEditor({ 
  client, 
  dashboardConfig, 
  onConfigUpdate 
}: DashboardAdvancedEditorProps) {
  const [activeSection, setActiveSection] = useState<'tasks' | 'announcements' | 'media'>('tasks')
  const [isLoading, setIsLoading] = useState(false)

  const updateConfig = (updates: Partial<DashboardConfig>) => {
    onConfigUpdate({ ...dashboardConfig, ...updates })
  }

  const updateTasks = (tasks: NonNullable<DashboardConfig['tasks']>) => {
    updateConfig({ tasks })
  }

  const updateAnnouncements = (announcements: NonNullable<DashboardConfig['announcements']>) => {
    updateConfig({ announcements })
  }

  const addTask = () => {
    const newTask = {
      id: `task_${Date.now()}`,
      title: "New Task",
      description: "Task description",
      status: "pending" as const,
      priority: "medium" as const,
      category: "General"
    }
    
    const currentTasks = dashboardConfig.tasks || []
    updateTasks([...currentTasks, newTask])
  }

  const updateTask = (index: number, updates: Partial<NonNullable<DashboardConfig['tasks']>[number]>) => {
    const currentTasks = dashboardConfig.tasks || []
    const updatedTasks = currentTasks.map((task, i) => 
      i === index ? { ...task, ...updates } : task
    )
    updateTasks(updatedTasks)
  }

  const removeTask = (index: number) => {
    const currentTasks = dashboardConfig.tasks || []
    updateTasks(currentTasks.filter((_, i) => i !== index))
  }

  const moveTask = (index: number, direction: 'up' | 'down') => {
    const currentTasks = dashboardConfig.tasks || []
    const newTasks = [...currentTasks]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < newTasks.length) {
      [newTasks[index], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[index]]
      updateTasks(newTasks)
    }
  }

  const addAnnouncement = () => {
    const newAnnouncement = {
      id: `announcement_${Date.now()}`,
      title: "New Announcement",
      content: "Announcement content",
      type: "info" as const,
      isActive: true,
      createdAt: new Date().toISOString()
    }
    
    const currentAnnouncements = dashboardConfig.announcements || []
    updateAnnouncements([...currentAnnouncements, newAnnouncement])
  }

  const updateAnnouncement = (index: number, updates: Partial<NonNullable<DashboardConfig['announcements']>[number]>) => {
    const currentAnnouncements = dashboardConfig.announcements || []
    const updatedAnnouncements = currentAnnouncements.map((announcement, i) => 
      i === index ? { ...announcement, ...updates } : announcement
    )
    updateAnnouncements(updatedAnnouncements)
  }

  const removeAnnouncement = (index: number) => {
    const currentAnnouncements = dashboardConfig.announcements || []
    updateAnnouncements(currentAnnouncements.filter((_, i) => i !== index))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const renderTasksEditor = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Task Management</h3>
        <Button onClick={addTask} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      <div className="space-y-3">
        {(dashboardConfig.tasks || []).map((task, index) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveTask(index, 'up')}
                    disabled={index === 0}
                    className="p-1 h-auto"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveTask(index, 'down')}
                    disabled={index === (dashboardConfig.tasks || []).length - 1}
                    className="p-1 h-auto"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Task Title</Label>
                      <Input
                        value={task.title}
                        onChange={(e) => updateTask(index, { title: e.target.value })}
                        placeholder="Task title"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={task.category || ''}
                        onChange={(e) => updateTask(index, { category: e.target.value })}
                        placeholder="Category"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <textarea
                      value={task.description}
                      onChange={(e) => updateTask(index, { description: e.target.value })}
                      placeholder="Task description"
                      className="w-full p-2 border rounded-md min-h-[60px] resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Status</Label>
                      <Select 
                        value={task.status} 
                        onValueChange={(value: 'pending' | 'in-progress' | 'completed') => 
                          updateTask(index, { status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Priority</Label>
                      <Select 
                        value={task.priority} 
                        onValueChange={(value: 'high' | 'medium' | 'low') => 
                          updateTask(index, { priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="low">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={task.dueDate || ''}
                        onChange={(e) => updateTask(index, { dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority} priority
                      </Badge>
                      <Badge variant="outline">
                        {task.status}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => removeTask(index)}
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(dashboardConfig.tasks || []).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tasks configured. Click "Add Task" to get started.
          </div>
        )}
      </div>
    </div>
  )

  const renderAnnouncementsEditor = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Announcements</h3>
        <Button onClick={addAnnouncement} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Announcement
        </Button>
      </div>
      
      <div className="space-y-3">
        {(dashboardConfig.announcements || []).map((announcement, index) => (
          <Card key={announcement.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={announcement.title}
                      onChange={(e) => updateAnnouncement(index, { title: e.target.value })}
                      placeholder="Announcement title"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select 
                      value={announcement.type} 
                      onValueChange={(value: 'info' | 'success' | 'warning' | 'error') => 
                        updateAnnouncement(index, { type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Content</Label>
                  <textarea
                    value={announcement.content}
                    onChange={(e) => updateAnnouncement(index, { content: e.target.value })}
                    placeholder="Announcement content"
                    className="w-full p-2 border rounded-md min-h-[80px] resize-none"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={announcement.isActive}
                        onChange={(e) => updateAnnouncement(index, { isActive: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <Badge className={getAnnouncementColor(announcement.type)}>
                      {announcement.type}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => removeAnnouncement(index)}
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(dashboardConfig.announcements || []).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No announcements configured. Click "Add Announcement" to get started.
          </div>
        )}
      </div>
    </div>
  )

  const renderMediaEditor = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Media & Documents</h3>
        <Button size="sm" variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(dashboardConfig.media || []).map((item, index) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {item.type === 'image' && <Image className="w-5 h-5" />}
                  {item.type === 'video' && <Video className="w-5 h-5" />}
                  {item.type === 'document' && <FileText className="w-5 h-5" />}
                  <span className="font-medium text-sm">{item.title}</span>
                </div>
                
                <div className="aspect-video bg-gray-100 rounded border flex items-center justify-center">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.title} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="w-8 h-8 mx-auto mb-2">
                        {item.type === 'video' && <Video className="w-8 h-8" />}
                        {item.type === 'document' && <FileText className="w-8 h-8" />}
                      </div>
                      <p className="text-xs">{item.type}</p>
                    </div>
                  )}
                </div>
                
                {item.description && (
                  <p className="text-xs text-gray-600">{item.description}</p>
                )}
                
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{item.type}</Badge>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(dashboardConfig.media || []).length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No media files uploaded. Click "Upload File" to get started.
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { key: 'tasks', label: 'Tasks', icon: Target },
          { key: 'announcements', label: 'Announcements', icon: MessageSquare },
          { key: 'media', label: 'Media', icon: Image }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeSection === key ? "default" : "ghost"}
            onClick={() => setActiveSection(key as typeof activeSection)}
            className="flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Section Content */}
      <div className="min-h-[400px]">
        {activeSection === 'tasks' && renderTasksEditor()}
        {activeSection === 'announcements' && renderAnnouncementsEditor()}
        {activeSection === 'media' && renderMediaEditor()}
      </div>
    </div>
  )
}