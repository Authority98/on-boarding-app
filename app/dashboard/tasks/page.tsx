"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("preset")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Task Management</h1>
        <p className="text-muted-foreground">Monitor and manage all client tasks across your agency</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        <Button
          variant={activeTab === "preset" ? "default" : "outline"}
          onClick={() => setActiveTab("preset")}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Preset Tasks (0)
        </Button>
        <Button
          variant={activeTab === "custom" ? "default" : "outline"}
          onClick={() => setActiveTab("custom")}
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Custom Tasks (3)
        </Button>
      </div>

      {activeTab === "preset" && (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Tasks created from onboarding templates. These follow your standardized workflows.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-muted-foreground">In Progress</span>
                </div>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm text-muted-foreground">Waiting</span>
                </div>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search tasks..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status (0)</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Empty State */}
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No preset tasks found</h3>
            <p className="text-muted-foreground">No preset tasks exist yet. Create templates and assign them to clients.</p>
          </div>
        </div>
      )}

      {activeTab === "custom" && (
        <div className="space-y-6">
          <p className="text-muted-foreground">Custom tasks created manually for specific client needs.</p>

          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search tasks..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status (3)</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-medium">Setup Google Analytics</h3>
                      <p className="text-sm text-muted-foreground">John Smith - Tech Startup Inc</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</div>
                    <div className="text-xs text-muted-foreground/70">2 days ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-medium">Brand Guidelines Review</h3>
                      <p className="text-sm text-muted-foreground">Sarah Johnson - Design Co</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">In Progress</div>
                    <div className="text-xs text-muted-foreground/70">Started yesterday</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <h3 className="font-medium">Contract Signing</h3>
                      <p className="text-sm text-muted-foreground">Mike Wilson - Wilson Consulting</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Pending</div>
                    <div className="text-xs text-muted-foreground/70">Due in 3 days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
