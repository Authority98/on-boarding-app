"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, CheckCircle, Clock, TrendingUp, Plus, Crown } from "lucide-react"
import { clientOperations, type Client } from "@/lib/supabase"
import { toast } from "sonner"

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeClients: 0,
    completedClients: 0,
    avgTasksPerClient: 0,
    successRate: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await clientOperations.getAll()
      setClients(data)
      
      // Calculate stats
      const activeCount = data.filter(client => client.status === 'active').length
      const completedCount = data.filter(client => client.status === 'completed').length
      const totalClients = data.length
      const successRate = totalClients > 0 ? Math.round((completedCount / totalClients) * 100) : 0
      
      setStats({
        activeClients: activeCount,
        completedClients: completedCount,
        avgTasksPerClient: totalClients > 0 ? Math.round(totalClients / Math.max(activeCount, 1)) : 0,
        successRate
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
      case 'inactive':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200'
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200'
    }
  }

  // Get recent clients (last 3)
  const recentClients = clients.slice(0, 3)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agency Dashboard</h1>
          <p className="text-muted-foreground">Manage your agency, employees, clients, and onboarding workflows</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold">{loading ? '...' : stats.activeClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{loading ? '...' : stats.completedClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">{loading ? '...' : clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{loading ? '...' : `${stats.successRate}%`}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Clients</CardTitle>
            <Link href="/dashboard/clients" className="text-sm text-primary hover:text-primary/80">
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground py-4">
                Loading clients...
              </div>
            ) : recentClients.length > 0 ? (
              recentClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.company || 'No company'}</p>
                      <p className="text-xs text-muted-foreground/70">Added {formatDate(client.created_at!)}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No clients found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Employees */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Current Employees</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock employee data - replace with real data when employees table is created */}
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Admin User</p>
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                  Online
                </Badge>
              </div>
              <div className="text-center text-muted-foreground py-4 text-sm">
                Employee management system coming soon...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
