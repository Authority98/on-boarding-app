import { notFound } from 'next/navigation'
import { clientOperations } from '@/lib/supabase'
import { ClientDashboard } from '@/components/client-dashboard'

interface ClientDashboardPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ClientDashboardPage({ params }: ClientDashboardPageProps) {
  try {
    const { slug } = await params
    console.log('Loading client dashboard for slug:', slug)
    
    const client = await clientOperations.getBySlug(slug)
    
    if (!client) {
      console.log('No client found for slug:', slug)
      notFound()
    }

    console.log('Successfully loaded client:', client.name)
    return <ClientDashboard client={client} />
  } catch (error) {
    console.error('Error loading client dashboard:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: ClientDashboardPageProps) {
  try {
    const { slug } = await params
    const client = await clientOperations.getBySlug(slug)
    
    if (!client) {
      return {
        title: 'Client Dashboard Not Found'
      }
    }

    return {
      title: `Dashboard - ${client.name}`,
      description: `${client.name}'s personalized dashboard`,
    }
  } catch (error) {
    return {
      title: 'Client Dashboard Not Found'
    }
  }
}