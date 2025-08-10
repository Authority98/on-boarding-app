"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Building, Mail, Phone, Filter } from "lucide-react"
import { AddClientDialog } from "@/components/add-client-dialog"
import { clientOperations, type Client } from "@/lib/supabase"
import { toast } from "sonner"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredClients, setFilteredClients] = useState<Client[]>([])

  // Load clients on component mount
  useEffect(() => {
    loadClients()
  }, [])

  // Filter clients when search query or status filter changes
  useEffect(() => {
    filterClients()
  }, [clients, searchQuery, statusFilter])

  const loadClients = async () => {
    try {
      setLoading(true)
      const data = await clientOperations.getAll()
      setClients(data)
    } catch (error) {
      console.error("Error loading clients:", error)
      toast.error("Failed to load clients")
    } finally {
      setLoading(false)
    }
  }

  const filterClients = async () => {
    try {
      let filtered = clients

      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter(client => client.status === statusFilter)
      }

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(client => 
          client.name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          (client.company && client.company.toLowerCase().includes(query))
        )
      }

      setFilteredClients(filtered)
    } catch (error) {
      console.error("Error filtering clients:", error)
    }
  }

  const handleClientAdded = (newClient: Client) => {
    setClients(prev => [newClient, ...prev])
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
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
      case 'inactive':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Client Management</h1>
          <p className="text-muted-foreground">Manage your clients and their onboarding progress</p>
        </div>
        <AddClientDialog onClientAdded={handleClientAdded} />
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search clients..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading clients...</div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-muted-foreground mb-2">
            {searchQuery || statusFilter !== "all" ? "No clients found matching your criteria" : "No clients yet"}
          </div>
          {!searchQuery && statusFilter === "all" && (
            <p className="text-sm text-muted-foreground">Add your first client to get started</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <h3 className="font-semibold text-lg mb-1">{client.name}</h3>

                <div className="space-y-2 mb-4">
                  {client.company && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="w-4 h-4" />
                      {client.company}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {client.email}
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {client.phone}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant="secondary" className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Added:</span>
                  <span className="text-sm">{client.created_at ? formatDate(client.created_at) : 'N/A'}</span>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Dashboard Editor
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
