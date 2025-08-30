import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Enhanced settings for Netlify compatibility
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'sb-auth-token',
    flowType: 'pkce'
  }
})

// For server-side operations that require elevated permissions
// Only create admin client on server-side
let supabaseAdmin: ReturnType<typeof createClient> | null = null

if (typeof window === 'undefined') {
  // Server-side only
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseServiceKey) {
    throw new Error('Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY')
  }
  
  supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export { supabaseAdmin }

// Client type definition
export interface Client {
  id?: string
  name: string
  company?: string
  email: string
  phone?: string
  status: 'active' | 'inactive' | 'pending' | 'completed'
  view_mode: 'dashboard' | 'task' | 'hybrid'
  dashboard_slug: string
  dashboard_config?: DashboardConfig
  user_id?: string
  created_at?: string
  updated_at?: string
}

// Dashboard configuration types
export interface DashboardConfig {
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
  branding?: {
    showLogo?: boolean
    logoUrl?: string
    showCompanyName?: boolean
    customWelcomeMessage?: string
    companyDescription?: string
  }
  layout?: {
    enableKPIs?: boolean
    enableCharts?: boolean
    enableTasks?: boolean
    enableActivity?: boolean
    enableAnnouncements?: boolean
    enableQuickActions?: boolean
    enableTaskStats?: boolean
    enableProgressOverview?: boolean
    sectionOrder?: string[]
    widgetVisibility?: {
      kpiCards?: boolean[]
      chartSections?: {
        performanceChart?: boolean
        performanceTrends?: boolean
      }
      quickActions?: {
        viewMessages?: boolean
        downloadReports?: boolean
        scheduleMeeting?: boolean
        addKPI?: boolean
        contactSupport?: boolean
        downloadResources?: boolean
        viewTasks?: boolean
      }
      activityFeed?: boolean
      taskList?: boolean
      taskStats?: {
        totalTasks?: boolean
        completedTasks?: boolean
        inProgressTasks?: boolean
      }
      progressOverview?: boolean
      announcements?: boolean
      helpSection?: boolean
    }
  }
  kpis?: Array<{
    id: string
    title: string
    value: string
    type: 'percentage' | 'number' | 'currency' | 'text'
    icon?: string
    color?: string
    description?: string
  }>
  tasks?: Array<{
    id: string
    title: string
    description: string
    status: 'pending' | 'in-progress' | 'completed'
    priority: 'high' | 'medium' | 'low'
    dueDate?: string
    category?: string
  }>
  announcements?: Array<{
    id: string
    title: string
    content: string
    type: 'info' | 'success' | 'warning' | 'error'
    isActive: boolean
    createdAt: string
  }>
  media?: Array<{
    id: string
    type: 'image' | 'video' | 'document'
    title: string
    url: string
    description?: string
  }>
}

// Dashboard template type
export interface DashboardTemplate {
  id?: string
  user_id?: string
  name: string
  description?: string
  config: DashboardConfig
  is_default?: boolean
  created_at?: string
  updated_at?: string
}

// Dashboard content type
export interface DashboardContent {
  id?: string
  client_id: string
  content_type: 'welcome_message' | 'kpi' | 'task' | 'announcement' | 'media'
  content_key: string
  content_data: any
  display_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// Dashboard asset type
export interface DashboardAsset {
  id?: string
  client_id: string
  asset_type: 'image' | 'video' | 'document' | 'logo'
  file_name: string
  file_path: string
  file_size?: number
  mime_type?: string
  alt_text?: string
  created_at?: string
  updated_at?: string
}

// Client operations
export const clientOperations = {
  // Get all clients
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Client[]
  },

  // Get client by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Client
  },

  // Get client by dashboard slug (for public dashboard access)
  async getBySlug(slug: string) {
    console.log('Fetching client by slug:', slug)
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('dashboard_slug', slug)
      .single()
    
    if (error) {
      console.error('Error fetching client by slug:', error)
      throw error
    }
    
    console.log('Found client:', data)
    return data as Client
  },

  // Create new client
  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'dashboard_slug'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    
    // Create default dashboard configuration for new clients
    const defaultDashboardConfig: DashboardConfig = {
      branding: {
        showLogo: false,
        logoUrl: '',
        showCompanyName: true,
        customWelcomeMessage: '',
        companyDescription: ''
      },
      theme: {
        primaryColor: '#3b82f6',
        backgroundColor: '#f9fafb',
        textColor: '#1f2937'
      },
      layout: {
        enableKPIs: true,
        enableCharts: true,
        enableActivity: true,
        enableQuickActions: true,
        enableTaskStats: true,
        enableProgressOverview: true,
        widgetVisibility: {
          kpiCards: [true, true, true, true], // Default 4 KPI cards visible
          chartSections: {
            performanceChart: true,
            performanceTrends: true
          },
          quickActions: {
            viewMessages: true,
            downloadReports: true,
            scheduleMeeting: true,
            addKPI: true,
            contactSupport: true,
            downloadResources: true,
            viewTasks: true
          },
          activityFeed: true,
          taskList: true,
          taskStats: {
            totalTasks: true,
            completedTasks: true,
            inProgressTasks: true
          },
          progressOverview: true,
          announcements: true,
          helpSection: true
        }
      },
      kpis: [
        {
          id: '1',
          title: 'Project Progress',
          value: '78%',
          type: 'percentage' as const,
          description: 'Overall project completion rate'
        },
        {
          id: '2',
          title: 'Revenue Generated',
          value: '$24,500',
          type: 'currency' as const,
          description: 'Monthly recurring revenue'
        },
        {
          id: '3',
          title: 'Active Projects',
          value: '12',
          type: 'number' as const,
          description: 'Currently active projects'
        },
        {
          id: '4',
          title: 'Client Satisfaction',
          value: '4.8/5',
          type: 'text' as const,
          description: 'Average satisfaction score'
        }
      ],
      announcements: []
    }
    
    // Ensure view_mode is set, default to 'dashboard' if not provided
    const clientData = {
      ...client,
      view_mode: client.view_mode || 'dashboard',
      dashboard_config: defaultDashboardConfig,
      user_id: user.id
    }
    
    console.log('Creating client with data:', clientData)
    
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase client creation error:', error)
      throw error
    }
    
    console.log('Client created successfully:', data)
    return data as Client
  },

  // Update client
  async update(id: string, updates: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Client
  },

  // Delete client
  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Search clients
  async search(query: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`name.ilike.%${query}%,company.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Client[]
  },

  // Filter clients by status
  async filterByStatus(status: string) {
    if (status === 'all') {
      return this.getAll()
    }
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Client[]
  },

  // Update dashboard configuration
  async updateDashboardConfig(id: string, config: DashboardConfig) {
    const { data, error } = await supabase
      .from('clients')
      .update({ dashboard_config: config })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Client
  }
}

// Dashboard template operations
export const dashboardTemplateOperations = {
  // Get all templates for current user
  async getAll() {
    const { data, error } = await supabase
      .from('dashboard_templates')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as DashboardTemplate[]
  },

  // Create new template
  async create(template: Omit<DashboardTemplate, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('dashboard_templates')
      .insert([{ ...template, user_id: user.id }])
      .select()
      .single()
    
    if (error) throw error
    return data as DashboardTemplate
  },

  // Update template
  async update(id: string, updates: Partial<Omit<DashboardTemplate, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('dashboard_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as DashboardTemplate
  },

  // Delete template
  async delete(id: string) {
    const { error } = await supabase
      .from('dashboard_templates')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Dashboard content operations
export const dashboardContentOperations = {
  // Get all content for a client
  async getByClientId(clientId: string) {
    const { data, error } = await supabase
      .from('dashboard_content')
      .select('*')
      .eq('client_id', clientId)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as DashboardContent[]
  },

  // Create new content
  async create(content: Omit<DashboardContent, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('dashboard_content')
      .insert([content])
      .select()
      .single()
    
    if (error) throw error
    return data as DashboardContent
  },

  // Update content
  async update(id: string, updates: Partial<Omit<DashboardContent, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('dashboard_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as DashboardContent
  },

  // Delete content
  async delete(id: string) {
    const { error } = await supabase
      .from('dashboard_content')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Bulk update content for a client
  async bulkUpdate(clientId: string, contents: Array<Omit<DashboardContent, 'id' | 'created_at' | 'updated_at' | 'client_id'>>) {
    // First, delete existing content
    await supabase
      .from('dashboard_content')
      .delete()
      .eq('client_id', clientId)
    
    // Then insert new content
    const contentData = contents.map((content, index) => ({
      ...content,
      client_id: clientId,
      display_order: index
    }))
    
    const { data, error } = await supabase
      .from('dashboard_content')
      .insert(contentData)
      .select()
    
    if (error) throw error
    return data as DashboardContent[]
  }
}

// Dashboard asset operations
export const dashboardAssetOperations = {
  // Get all assets for a client
  async getByClientId(clientId: string) {
    const { data, error } = await supabase
      .from('dashboard_assets')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as DashboardAsset[]
  },

  // Create new asset record (file upload handled separately)
  async create(asset: Omit<DashboardAsset, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('dashboard_assets')
      .insert([asset])
      .select()
      .single()
    
    if (error) throw error
    return data as DashboardAsset
  },

  // Update asset
  async update(id: string, updates: Partial<Omit<DashboardAsset, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('dashboard_assets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as DashboardAsset
  },

  // Delete asset
  async delete(id: string) {
    const { error } = await supabase
      .from('dashboard_assets')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export default supabase