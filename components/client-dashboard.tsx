"use client"

import { type Client } from '@/lib/supabase'
import { DashboardMode } from '@/components/dashboard-mode'
import { TaskMode } from '@/components/task-mode'
import { HybridMode } from '@/components/hybrid-mode'

interface ClientDashboardProps {
  client: Client
}

export function ClientDashboard({ client }: ClientDashboardProps) {
  switch (client.view_mode) {
    case 'task':
      return <TaskMode client={client} />
    case 'hybrid':
      return <HybridMode client={client} />
    case 'dashboard':
    default:
      return <DashboardMode client={client} />
  }
}